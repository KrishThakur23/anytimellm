from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional, Dict, Any, List

# Business / Tenant
class BusinessCreate(BaseModel):
    name: str

class BusinessOut(BaseModel):
    id: UUID
    name: str
    api_settings: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True

# Catalog / Products
class CatalogCreate(BaseModel):
    category: Optional[str] = None
    name: str
    description: Optional[str] = None
    price: Optional[float] = None
    attributes: Dict[str, Any] = Field(default_factory=dict)
    is_available: bool = True

class CatalogOut(BaseModel):
    id: UUID
    business_id: UUID
    category: Optional[str]
    name: str
    description: Optional[str]
    price: Optional[float]
    attributes: Dict[str, Any]
    is_available: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Documents
class DocumentOut(BaseModel):
    id: UUID
    business_id: UUID
    file_name: str
    file_type: str
    status: str
    summary: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# Web Chat Client
class ChatMessageIn(BaseModel):
    content: str
    customer_phone: str # Identifying phone or username for session isolation

class ChatMessageOut(BaseModel):
    sender: str # 'customer' or 'agent'
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
