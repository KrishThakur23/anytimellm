import io
import logging
from abc import ABC, abstractmethod
from typing import Dict, Type

from app.config import settings

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


class GoogleVisionOCRParser(BaseParser):
    def parse(self, file_content: bytes, filename: str = "") -> str:
        logger.info(f"Parsing Image {filename} using Google Cloud Vision OCR")
        
        # 1. Attempt using Service Account credentials via official Client Library
        from google.cloud import vision
        import json
        
        # Try loading raw JSON string from environment variable first
        json_str = settings.GOOGLE_SERVICE_ACCOUNT_JSON
        if json_str:
            try:
                logger.info("Initializing Google Vision client with GOOGLE_SERVICE_ACCOUNT_JSON environment variable.")
                service_account_info = json.loads(json_str)
                client = vision.ImageAnnotatorClient.from_service_account_info(service_account_info)
                image = vision.Image(content=file_content)
                response = client.text_detection(image=image)
                
                if response.error.message:
                    logger.error(f"Google Cloud Vision Service Account API Error: {response.error.message}")
                else:
                    text_annotations = response.text_annotations
                    if not text_annotations:
                        logger.info(f"No text detected by Google Vision OCR in {filename}")
                        return ""
                    return text_annotations[0].description.strip()
            except Exception as e:
                logger.error(f"Google Cloud Vision client initialization via JSON string failed: {e}. Trying file path fallback.")

        # Fallback to file path credentials if raw JSON string is not set
        from pathlib import Path
        credentials_path = settings.GOOGLE_APPLICATION_CREDENTIALS
        resolved_path = None
        
        if credentials_path:
            p = Path(credentials_path)
            if p.exists():
                resolved_path = str(p.resolve())
            else:
                # Check relative to backend folder and workspace root
                possible_paths = [
                    Path(__file__).resolve().parents[2] / p, # relative to backend
                    Path(__file__).resolve().parents[3] / p  # relative to workspace root
                ]
                for pp in possible_paths:
                    if pp.exists():
                        resolved_path = str(pp.resolve())
                        break
        
        if resolved_path:
            try:
                logger.info(f"Initializing Google Vision client with service account key: {resolved_path}")
                client = vision.ImageAnnotatorClient.from_service_account_json(resolved_path)
                image = vision.Image(content=file_content)
                response = client.text_detection(image=image)
                
                if response.error.message:
                    logger.error(f"Google Cloud Vision Service Account API Error: {response.error.message}")
                else:
                    text_annotations = response.text_annotations
                    if not text_annotations:
                        logger.info(f"No text detected by Google Vision OCR in {filename}")
                        return ""
                    return text_annotations[0].description.strip()
            except Exception as e:
                logger.error(f"Google Cloud Vision Client Library exception: {e}. Trying REST API fallback.")
        else:
            logger.info("No valid Google service account JSON key found or configured.")

        # 2. REST API key fallback
        api_key = settings.GOOGLE_VISION_API_KEY or settings.GEMINI_API_KEY
        if not api_key:
            logger.warning("No Google Vision API key configured. Falling back to local Tesseract OCR.")
            return TesseractOCRParser().parse(file_content, filename)
            
        import base64
        import json
        import httpx
        
        try:
            image_content = base64.b64encode(file_content).decode("utf-8")
            payload = {
                "requests": [
                    {
                        "image": {"content": image_content},
                        "features": [{"type": "TEXT_DETECTION"}]
                    }
                ]
            }
            
            url = f"https://vision.googleapis.com/v1/images:annotate?key={api_key}"
            headers = {"Content-Type": "application/json"}
            
            with httpx.Client() as client:
                response = client.post(url, json=payload, headers=headers)
                
            if response.status_code != 200:
                logger.error(f"Google Vision REST API returned status {response.status_code}: {response.text}")
                return TesseractOCRParser().parse(file_content, filename)
                
            response_json = response.json()
            responses = response_json.get("responses", [])
            if not responses:
                logger.warning("Google Vision REST API returned empty responses.")
                return ""
                
            first_response = responses[0]
            if "error" in first_response:
                error_msg = first_response["error"].get("message", "Unknown API error")
                logger.error(f"Google Vision REST API response contained error: {error_msg}")
                return TesseractOCRParser().parse(file_content, filename)
                
            text_annotations = first_response.get("textAnnotations", [])
            if not text_annotations:
                logger.info(f"No text detected by Google Vision OCR in {filename}")
                return ""
                
            full_text = text_annotations[0].get("description", "")
            return full_text.strip()
            
        except Exception as e:
            logger.error(f"Exception raised during Google Vision REST OCR: {e}. Falling back to Tesseract.")
            return TesseractOCRParser().parse(file_content, filename)


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
        self.register_parser("png", GoogleVisionOCRParser)
        self.register_parser("jpg", GoogleVisionOCRParser)
        self.register_parser("jpeg", GoogleVisionOCRParser)
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
