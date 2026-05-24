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

for model_name in models_to_test:
    print(f"\n--- Testing model: {model_name} ---")
    try:
        # We need to make sure GOOGLE_API_KEY environment variable is set
        # since langchain_google_genai uses it by default if google_api_key parameter is not specified or checked
        os.environ["GOOGLE_API_KEY"] = settings.GEMINI_API_KEY
        
        llm = ChatGoogleGenerativeAI(
            model=model_name,
            google_api_key=settings.GEMINI_API_KEY,
            temperature=0.2
        )
        res = llm.invoke("Hello, say 'OK' if you work.")
        print(f"SUCCESS: {res.content.strip()}")
    except Exception as e:
        print(f"FAILED: {e}")
