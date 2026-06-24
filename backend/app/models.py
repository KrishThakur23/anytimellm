import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Text, Numeric, Boolean, ForeignKey, DateTime, JSON, Date, Integer
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
    subscription: Mapped["Subscription"] = relationship(back_populates="business", uselist=False, cascade="all, delete-orphan")


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
    ai_pause_reason: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    ai_paused_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
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
    role: Mapped[str] = mapped_column(String(50), default="owner", server_default="'owner'") # 'owner', 'admin', 'member'
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    
    business: Mapped["Business"] = relationship(back_populates="users")

    @property
    def trial_expired(self) -> bool:
        if self.business and self.business.subscription:
            return self.business.subscription.status == "expired"
        return False

# --- Billing & Subscription Models ---

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    business_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False, unique=True)
    plan_type: Mapped[str] = mapped_column(String(50), default="TRIAL") # TRIAL, STARTER, GROWTH, ENTERPRISE
    status: Mapped[str] = mapped_column(String(50), default="active") # active, pending_payment, past_due, canceled, expired, suspended
    subscription_status_reason: Mapped[Optional[str]] = mapped_column(String(100), nullable=True) # expired_trial, payment_failed, etc.
    trial_start_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    trial_end_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    subscription_start_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    subscription_end_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    business: Mapped["Business"] = relationship(back_populates="subscription")


class SubscriptionHistory(Base):
    __tablename__ = "subscription_history"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    business_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False, index=True)
    old_plan: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    new_plan: Mapped[str] = mapped_column(String(50), nullable=False)
    status_change: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    amount: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), nullable=True)
    provider: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)


class PlanEntitlement(Base):
    __tablename__ = "plan_entitlements"
    
    plan_type: Mapped[str] = mapped_column(String(50), primary_key=True)
    max_documents: Mapped[int] = mapped_column(Integer, default=0)
    max_conversations: Mapped[int] = mapped_column(Integer, default=0) # per month or billing period
    max_agents: Mapped[int] = mapped_column(Integer, default=1)
    max_products: Mapped[int] = mapped_column(Integer, default=0)
    max_integrations: Mapped[int] = mapped_column(Integer, default=0)
    max_users: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)


class TrialClaim(Base):
    __tablename__ = "trial_claims"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    business_phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, index=True)
    whatsapp_number: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, index=True)
    domain: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, index=True)
    claimed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)


class ConversionEvent(Base):
    __tablename__ = "conversion_events"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    business_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False, index=True)
    event_type: Mapped[str] = mapped_column(String(100), nullable=False) # Trial Started, Knowledge Uploaded, etc.
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)


class UsageSnapshot(Base):
    __tablename__ = "usage_snapshots"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    business_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False, index=True)
    date: Mapped[datetime] = mapped_column(Date, nullable=False, index=True)
    conversation_count: Mapped[int] = mapped_column(Integer, default=0)
    document_count: Mapped[int] = mapped_column(Integer, default=0)
    order_count: Mapped[int] = mapped_column(Integer, default=0)
    revenue_assisted: Mapped[float] = mapped_column(Numeric(10, 2), default=0.0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)


class BillingWebhookEvent(Base):
    __tablename__ = "billing_webhook_events"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    provider: Mapped[str] = mapped_column(String(50), nullable=False) # e.g., razorpay
    event_type: Mapped[str] = mapped_column(String(100), nullable=False)
    payload: Mapped[dict] = mapped_column(JSON, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="pending") # pending, processed, failed
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    retry_count: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    processed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)


class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    business_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("businesses.id", ondelete="SET NULL"), nullable=True, index=True)
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    entity_type: Mapped[str] = mapped_column(String(50), nullable=False)
    entity_id: Mapped[str] = mapped_column(String(255), nullable=False)
    details: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
