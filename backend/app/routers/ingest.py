import logging
import httpx
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional

from app.database import get_db
from app.models import Document, Business
from app.schemas import DocumentOut
from app.services.parser import parser_registry
from app.services.vector_db import index_document_text
from app.services.security import get_current_user
from app.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/ingest", tags=["Document & URL Ingestion"])

async def validate_document_content(text: str, business_name: str, business_type: str) -> tuple[bool, str]:
    """
    Uses Gemini/GPT to validate if the extracted text makes sense as a catalog, menu, pricing list,
    or business knowledge document for the given business.
    Returns (is_valid, reason).
    """
    from langchain_core.messages import SystemMessage, HumanMessage
    from app.config import settings
    import json
    import re
    
    # Trim text to prevent token overflow (4000 characters is plenty for verification)
    sample_text = text[:4000]
    
    system_prompt = (
        "You are an AI document verification assistant. Your job is to analyze the text extracted from an uploaded document (such as a catalog, menu, price list, inventory, or service list) "
        "and determine if it is a relevant business document for a specific business, or if it is a completely unrelated, random file (such as a personal photo, selfie, random screenshot, generic meme, or unrelated chat log).\n\n"
        "You must respond in raw JSON format using the following structure:\n"
        "{\n"
        "  \"is_valid\": true or false,\n"
        "  \"reason\": \"a brief message explaining why it is valid or why it is invalid/doesn't make sense\"\n"
        "}"
    )
    
    user_prompt = (
        f"Business Name: {business_name}\n"
        f"Business Industry/Type: {business_type}\n\n"
        f"Extracted Document Text:\n"
        f"\"\"\"\n"
        f"{sample_text}\n"
        f"\"\"\"\n\n"
        f"Is this a valid catalog, menu, price list, inventory, or relevant business knowledge document for this business? Return the JSON response."
    )
    
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_prompt)
    ]
    
    llm = None
    if settings.GEMINI_API_KEY:
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            llm = ChatGoogleGenerativeAI(
                model="gemini-2.5-flash",
                google_api_key=settings.GEMINI_API_KEY,
                temperature=0.0,
                max_retries=1
            )
        except Exception as e:
            logger.error(f"Failed to load LangChain ChatGoogleGenerativeAI: {e}")
            
    if not llm and settings.OPENAI_API_KEY:
        try:
            from langchain_openai import ChatOpenAI
            llm = ChatOpenAI(
                model="gpt-4o-mini",
                api_key=settings.OPENAI_API_KEY,
                temperature=0.0,
                max_retries=1
            )
        except Exception as e:
            logger.error(f"Failed to load LangChain ChatOpenAI: {e}")
            
    if not llm:
        # If no LLM available, allow the file to pass
        return True, "No LLM available for validation"
        
    try:
        response = await llm.ainvoke(messages)
        content = response.content
        
        # Parse JSON
        match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", content, re.DOTALL)
        if match:
            parsed = json.loads(match.group(1))
        else:
            parsed = json.loads(content.strip())
            
        is_valid = bool(parsed.get("is_valid", True))
        reason = str(parsed.get("reason", ""))
        return is_valid, reason
    except Exception as e:
        logger.error(f"Error validating document content via LLM: {e}")
        # Fail open in case of unexpected errors so user is not blocked
        return True, "Validation skipped due to system error"


@router.post("/file", response_model=DocumentOut, status_code=status.HTTP_202_ACCEPTED)
async def upload_document_file(
    business_id: UUID = Form(...),
    file: UploadFile = File(...),
    business_name: Optional[str] = Form(None),
    business_type: Optional[str] = Form(None),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Uploads a file (PDF, TXT, Image), extracts text using local parsers/OCR, and indexes embeddings into Pinecone."""
    if current_user.business_id != business_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this business.")
    # 1. Verify business exists
    biz = db.query(Business).filter(Business.id == business_id).first()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found.")

    filename = file.filename or "unknown_file"
    ext = filename.split(".")[-1].lower() if "." in filename else "txt"
    
    # Create database placeholder log
    db_doc = Document(
        business_id=business_id,
        file_name=filename,
        file_type=ext,
        status="processing"
    )
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    
    try:
        # Read file bytes
        file_bytes = await file.read()
        
        # 2. Extract content using registered parsers
        parser = parser_registry.get_parser(ext)
        extracted_text = parser.parse(file_bytes, filename)
        
        if not extracted_text or extracted_text.startswith("[Error"):
            raise ValueError(extracted_text or "No text could be extracted.")
            
        # Check document relevance via LLM if profile context is supplied
        if business_name and business_type:
            is_valid, reason = await validate_document_content(extracted_text, business_name, business_type)
            if not is_valid:
                db_doc.status = "failed"
                db.commit()
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"doesn't make any sense: {reason}"
                )

        # Create summary (e.g. first 200 characters)
        summary = extracted_text[:200] + ("..." if len(extracted_text) > 200 else "")
        
        # 3. Save text inside Relational Database
        db_doc.raw_content = extracted_text
        db_doc.summary = summary
        db_doc.status = "completed"
        db.commit()
        db.refresh(db_doc)
        
        # 4. Generate Embeddings & index in Pinecone
        index_document_text(
            text=extracted_text,
            business_id=str(business_id),
            document_id=str(db_doc.id),
            file_name=filename
        )
        
        return db_doc
        
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Failed to ingest file {filename}: {e}")
        db_doc.status = "failed"
        db.commit()
        raise HTTPException(
            status_code=500,
            detail=f"Failed parsing file: {str(e)}"
        )


@router.post("/url", response_model=DocumentOut, status_code=status.HTTP_202_ACCEPTED)
async def crawl_website_url(
    business_id: UUID = Form(...),
    url: str = Form(...),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Crawls a website URL, scrapes text content via HTML parser, and indexes embeddings into Pinecone."""
    if current_user.business_id != business_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this business.")
    # Verify business exists
    biz = db.query(Business).filter(Business.id == business_id).first()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found.")
        
    db_doc = Document(
        business_id=business_id,
        file_name=url,
        file_type="html",
        status="processing"
    )
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    
    try:
        # Fetch page content
        headers = {"User-Agent": "Mozilla/5.0 AnytimeLLM Bot"}
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers, timeout=15.0)
            response.raise_for_status()
            
        # Parse content using registered HTML parser
        parser = parser_registry.get_parser("html")
        extracted_text = parser.parse(response.content, url)
        
        summary = f"Scraped website content from: {url}"
        
        # Update db document
        db_doc.raw_content = extracted_text
        db_doc.summary = summary
        db_doc.status = "completed"
        db.commit()
        db.refresh(db_doc)
        
        # Ingest to vector index
        index_document_text(
            text=extracted_text,
            business_id=str(business_id),
            document_id=str(db_doc.id),
            file_name=url
        )
        
        return db_doc
        
    except Exception as e:
        logger.error(f"Failed crawling URL {url}: {e}")
        db_doc.status = "failed"
        db.commit()
        raise HTTPException(
            status_code=500,
            detail=f"Failed crawling website: {str(e)}"
        )


@router.get("/{business_id}", response_model=List[DocumentOut])
def list_business_documents(
    business_id: UUID,
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetch status and list of documents uploaded by the tenant."""
    if current_user.business_id != business_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this business.")
    return (
        db.query(Document)
        .filter(Document.business_id == business_id)
        .order_by(Document.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
