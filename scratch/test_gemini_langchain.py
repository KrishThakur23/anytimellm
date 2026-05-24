import os
import sys

sys.path.append(r"c:\Users\ACER\Desktop\anytimellm\backend")

from app.config import settings
from langchain_google_genai import ChatGoogleGenerativeAI

print("Initializing ChatGoogleGenerativeAI...")
try:
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        google_api_key=settings.GEMINI_API_KEY,
        temperature=0.2
    )
    print("Invoking model...")
    res = llm.invoke("Hello, say 'Test successful!' if you receive this.")
    print("Response received:")
    print(res.content)
except Exception as e:
    import traceback
    print("Error invoking Gemini model via langchain:")
    traceback.print_exc()
