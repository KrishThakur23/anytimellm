import sys
import io

sys.path.append(r"c:\Users\ACER\Desktop\anytimellm\backend")

from app.services.parser import parser_registry

def test_ocr():
    # 1. Create a simple mock image with text using PIL
    try:
        from PIL import Image, ImageDraw
        print("Creating mock image with text...")
        # Create a new white image
        img = Image.new("RGB", (400, 100), color=(255, 255, 255))
        d = ImageDraw.Draw(img)
        # Draw some simple text
        d.text((10, 40), "AnytimeLLM OCR Test Successful", fill=(0, 0, 0))
        
        # Save to bytes
        img_bytes_io = io.BytesIO()
        img.save(img_bytes_io, format="PNG")
        image_bytes = img_bytes_io.getvalue()
        
        print("Mock image created successfully.")
    except Exception as e:
        print(f"Failed to create mock image: {e}")
        return

    # 2. Get the parser for PNG
    parser = parser_registry.get_parser("png")
    print(f"Selected parser class: {parser.__class__.__name__}")
    
    # 3. Run the parse method
    try:
        print("Invoking parse method...")
        parsed_text = parser.parse(image_bytes, "test_ocr_mock.png")
        print("\n================ OCR PARSED TEXT ================")
        print(parsed_text)
        print("=================================================\n")
    except Exception as e:
        print(f"Error executing parse: {e}")

if __name__ == "__main__":
    test_ocr()
