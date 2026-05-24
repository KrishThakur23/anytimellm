import io
import logging
from abc import ABC, abstractmethod
from typing import Dict, Type

logger = logging.getLogger(__name__)

# Optional dependencies imported inside functions to keep the core imports lightweight
# and handle missing system-level binaries gracefully.

class BaseParser(ABC):
    @abstractmethod
    def parse(self, file_content: bytes, filename: str = "") -> str:
        """Parse raw bytes and return structured text."""
        pass


class PyMuPDFParser(BaseParser):
    def parse(self, file_content: bytes, filename: str = "") -> str:
        logger.info(f"Parsing PDF {filename} using PyMuPDF")
        try:
            import fitz  # PyMuPDF
            doc = fitz.open(stream=file_content, filetype="pdf")
            text = ""
            for page in doc:
                text += page.get_text()
            doc.close()
            return text.strip()
        except ImportError:
            logger.warning("PyMuPDF is not installed, trying pdfplumber fallback")
            return PDFPlumberParser().parse(file_content, filename)
        except Exception as e:
            logger.error(f"Error parsing PDF with PyMuPDF: {e}")
            raise e


class PDFPlumberParser(BaseParser):
    def parse(self, file_content: bytes, filename: str = "") -> str:
        logger.info(f"Parsing PDF {filename} using pdfplumber")
        try:
            import pdfplumber
            text = ""
            with pdfplumber.open(io.BytesIO(file_content)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            return text.strip()
        except ImportError:
            logger.error("pdfplumber is not installed")
            return "[Error: pdfplumber package is missing]"
        except Exception as e:
            logger.error(f"Error parsing PDF with pdfplumber: {e}")
            raise e


class TesseractOCRParser(BaseParser):
    def parse(self, file_content: bytes, filename: str = "") -> str:
        logger.info(f"Parsing Image {filename} using Tesseract OCR")
        try:
            from PIL import Image
            import pytesseract
            
            image = Image.open(io.BytesIO(file_content))
            # PyTesseract will raise an TesseractNotFoundError if tesseract exe is not in PATH
            text = pytesseract.image_to_string(image)
            return text.strip()
        except ImportError:
            logger.error("PIL or pytesseract package is missing")
            return "[Error: PIL or pytesseract package is missing]"
        except Exception as e:
            logger.warning(f"Tesseract OCR failed (probably binary is not installed): {e}")
            return f"[OCR Fallback - Content from {filename} cannot be extracted. Tesseract binary or path error: {str(e)}]"


class HTMLParser(BaseParser):
    def parse(self, file_content: bytes, filename: str = "") -> str:
        logger.info(f"Parsing HTML content")
        try:
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(file_content, "html.parser")
            
            # Remove scripts and style elements
            for script in soup(["script", "style"]):
                script.decompose()
                
            text = soup.get_text(separator="\n")
            # Clean up whitespace
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = "\n".join(chunk for chunk in chunks if chunk)
            return text.strip()
        except ImportError:
            logger.error("BeautifulSoup4 is not installed")
            return "[Error: BeautifulSoup4 package is missing]"
        except Exception as e:
            logger.error(f"Error parsing HTML: {e}")
            raise e


class ParserRegistry:
    def __init__(self):
        self._parsers: Dict[str, Type[BaseParser]] = {}
        # Register default parsers
        self.register_parser("pdf", PyMuPDFParser)
        self.register_parser("png", TesseractOCRParser)
        self.register_parser("jpg", TesseractOCRParser)
        self.register_parser("jpeg", TesseractOCRParser)
        self.register_parser("html", HTMLParser)
        self.register_parser("txt", BaseParser) # text is parsed directly

    def register_parser(self, extension: str, parser_class: Type[BaseParser]):
        self._parsers[extension.lower()] = parser_class

    def get_parser(self, extension: str) -> BaseParser:
        ext = extension.lower().strip(".")
        parser_class = self._parsers.get(ext)
        if not parser_class:
            # Simple text fallback parser
            return FallbackTextParser()
        return parser_class()


class FallbackTextParser(BaseParser):
    def parse(self, file_content: bytes, filename: str = "") -> str:
        try:
            return file_content.decode("utf-8")
        except UnicodeDecodeError:
            try:
                return file_content.decode("latin-1")
            except Exception as e:
                logger.error(f"Could not decode fallback text file: {e}")
                return f"[Binary file: {filename}]"


# Instantiate global parser manager
parser_registry = ParserRegistry()
