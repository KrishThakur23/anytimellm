import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Text, Numeric, Boolean, ForeignKey, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

class Business(Base):
    __tablename__ = "businesses"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    api_settings: Mapped[dict] = mapped_column(JSON, default=dict, server_default='{}')
    business_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    onboarding_status: Mapped[str] = mapped_column(String(50), default="pending", server_default="'pending'")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    
    documents: Mapped[List["Document"]] = relationship(back_populates="business", cascade="all, delete-orphan")
    catalogs: Mapped[List["Catalog"]] = relationship(back_populates="business", cascade="all, delete-orphan")
    customers: Mapped[List["Customer"]] = relationship(back_populates="business", cascade="all, delete-orphan")
    conversations: Mapped[List["Conversation"]] = relationship(back_populates="business", cascade="all, delete-orphan")
    orders: Mapped[List["Order"]] = relationship(back_populates="business", cascade="all, delete-orphan")
    users: Mapped[List["User"]] = relationship(back_populates="business", cascade="all, delete-orphan")


class Document(Base):
    __tablename__ = "documents"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    business_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False, index=True)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_type: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="pending") # 'pending', 'processing', 'completed', 'failed'
    raw_content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    
    business: Mapped["Business"] = relationship(back_populates="documents")


class Catalog(Base):
    __tablename__ = "catalogs"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    business_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False, index=True)
    category: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    price: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), nullable=True)
    attributes: Mapped[dict] = mapped_column(JSON, default=dict, server_default='{}')
    is_available: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    
    business: Mapped["Business"] = relationship(back_populates="catalogs")


class Customer(Base):
    __tablename__ = "customers"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    business_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False, index=True)
    phone_number: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, index=True) # format: 'whatsapp:+123456789'
    name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    metadata_: Mapped[dict] = mapped_column(JSON, default=dict, server_default='{}')
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    
    business: Mapped["Business"] = relationship(back_populates="customers")
    conversations: Mapped[List["Conversation"]] = relationship(back_populates="customer", cascade="all, delete-orphan")
    orders: Mapped[List["Order"]] = relationship(back_populates="customer", cascade="all, delete-orphan")


class Conversation(Base):
    __tablename__ = "conversations"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    business_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True)
    channel: Mapped[str] = mapped_column(String(50), nullable=False) # 'whatsapp' or 'web'
    status: Mapped[str] = mapped_column(String(50), default="active") # 'active' or 'closed'
    is_ai_paused: Mapped[bool] = mapped_column(Boolean, default=False, server_default='false')
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    
    business: Mapped["Business"] = relationship(back_populates="conversations")
    customer: Mapped["Customer"] = relationship(back_populates="conversations")
    messages: Mapped[List["Message"]] = relationship(back_populates="conversation", cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "messages"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    conversation_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False, index=True)
    sender: Mapped[str] = mapped_column(String(50), nullable=False) # 'customer' or 'agent'
    content: Mapped[str] = mapped_column(Text, nullable=False)
    meta_message_id: Mapped[Optional[str]] = mapped_column(String(255), unique=True, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    
    conversation: Mapped["Conversation"] = relationship(back_populates="messages")


class Order(Base):
    __tablename__ = "orders"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    business_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True)
    details: Mapped[dict] = mapped_column(JSON, default=dict, server_default='{}')
    status: Mapped[str] = mapped_column(String(50), default="pending") # 'pending', 'confirmed', 'cancelled'
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    
    business: Mapped["Business"] = relationship(back_populates="orders")
    customer: Mapped["Customer"] = relationship(back_populates="orders")


class User(Base):
    __tablename__ = "users"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    business_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    
    business: Mapped["Business"] = relationship(back_populates="users")
