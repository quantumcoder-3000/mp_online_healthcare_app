from paddleocr import PaddleOCRVL
import sys

print("Initializing PaddleOCRVL...")
try:
    options = {
        "device": "gpu",
        "use_ocr_for_image_block": True,
        "format_block_content": True,
    }
    pipeline = PaddleOCRVL(**options)
    print("Success!")
except Exception as e:
    print(f"Exception: {e}")
    sys.exit(1)