import logging
import httpx
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.database import get_db
from app.models import Document, Business
from app.schemas import DocumentOut
from app.services.parser import parser_registry
from app.services.vector_db import index_document_text

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/ingest", tags=["Document & URL Ingestion"])

@router.post("/file", response_model=DocumentOut, status_code=status.HTTP_202_ACCEPTED)
async def upload_document_file(
    business_id: UUID = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Uploads a file (PDF, TXT, Image), extracts text using local parsers/OCR, and indexes embeddings into Pinecone."""
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
    db: Session = Depends(get_db)
):
    """Crawls a website URL, scrapes text content via HTML parser, and indexes embeddings into Pinecone."""
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
def list_business_documents(business_id: UUID, db: Session = Depends(get_db)):
    """Fetch status and list of documents uploaded by the tenant."""
    return db.query(Document).filter(Document.business_id == business_id).all()
