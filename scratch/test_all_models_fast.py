import os
import sys

sys.path.append(r"c:\Users\ACER\Desktop\anytimellm\backend")

from app.config import settings
from langchain_google_genai import ChatGoogleGenerativeAI

models_to_test = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-flash-latest",
    "gemini-pro-latest"
]

# Ensure GOOGLE_API_KEY environment variable is set
os.environ["GOOGLE_API_KEY"] = settings.GEMINI_API_KEY

for model_name in models_to_test:
    print(f"\n--- Testing model: {model_name} ---")
    try:
        llm = ChatGoogleGenerativeAI(
            model=model_name,
            google_api_key=settings.GEMINI_API_KEY,
            temperature=0.2,
            max_retries=0
        )
        res = llm.invoke("Hello, say 'OK' if you work.")
        print(f"SUCCESS: {res.content.strip()}")
    except Exception as e:
        # Print only the first line or message of the error to keep it clean
        err_msg = str(e).split('\n')[0]
        print(f"FAILED: {err_msg}")
