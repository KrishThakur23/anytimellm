import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.database import get_db
from app.models import Business, Catalog
from app.schemas import BusinessCreate, BusinessOut, CatalogCreate, CatalogOut

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/businesses", tags=["Businesses & Tenant Settings"])

@router.post("", response_model=BusinessOut, status_code=status.HTTP_201_CREATED)
def register_business(payload: BusinessCreate, db: Session = Depends(get_db)):
    """Registers a new business tenant on the platform, providing them an isolated namespace and DB context."""
    try:
        new_biz = Business(
            name=payload.name,
            api_settings={
                "system_prompt": f"You are a helpful virtual assistant for {payload.name}. You can answer customer questions about our products, check availability in our database, or help place an order."
            }
        )
        db.add(new_biz)
        db.commit()
        db.refresh(new_biz)
        return new_biz
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating business: {e}")
        raise HTTPException(status_code=500, detail="Internal server error registering business.")


@router.get("/{business_id}", response_model=BusinessOut)
def get_business_details(business_id: UUID, db: Session = Depends(get_db)):
    """Fetch details and current configuration settings for a business."""
    biz = db.query(Business).filter(Business.id == business_id).first()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found.")
    return biz


@router.post("/{business_id}/catalog", response_model=CatalogOut, status_code=status.HTTP_201_CREATED)
def add_catalog_item(business_id: UUID, payload: CatalogCreate, db: Session = Depends(get_db)):
    """Add a menu item, subscription, or catalog asset to the business's relational data store."""
    # Verify business exists
    biz = db.query(Business).filter(Business.id == business_id).first()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found.")
        
    try:
        item = Catalog(
            business_id=business_id,
            category=payload.category,
            name=payload.name,
            description=payload.description,
            price=payload.price,
            attributes=payload.attributes,
            is_available=payload.is_available
        )
        db.add(item)
        db.commit()
        db.refresh(item)
        return item
    except Exception as e:
        db.rollback()
        logger.error(f"Error adding catalog item: {e}")
        raise HTTPException(status_code=500, detail="Could not create catalog item.")


@router.get("/{business_id}/catalog", response_model=List[CatalogOut])
def get_business_catalog(business_id: UUID, db: Session = Depends(get_db)):
    """Retrieve catalog list representing items owned by this business tenant."""
    return db.query(Catalog).filter(Catalog.business_id == business_id).all()
