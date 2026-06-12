import logging
import asyncio
import jwt
from fastapi import APIRouter, Depends, HTTPException, status, Request, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session, joinedload, selectinload
from uuid import UUID
from typing import List
from datetime import datetime

from app.database import get_db
from app.models import Business, Catalog, Order, Conversation, Message
from app.schemas import BusinessCreate, BusinessOut, CatalogCreate, CatalogOut, OrderOut, ConversationOut, MessageOut, MessageCreate
from app.services.security import get_current_user
from app.config import settings

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
def get_business_details(
    business_id: UUID,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetch details and current configuration settings for a business."""
    if current_user.business_id != business_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this business.")
    biz = db.query(Business).filter(Business.id == business_id).first()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found.")
    return biz


@router.patch("/{business_id}/settings", response_model=BusinessOut)
def update_business_settings(
    business_id: UUID,
    payload: dict,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update custom API settings (system prompt, model, temperature, etc.) for a business."""
    if current_user.business_id != business_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this business.")
    biz = db.query(Business).filter(Business.id == business_id).first()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found.")
    
    try:
        # Handle direct business field updates
        if "onboarding_status" in payload:
            biz.onboarding_status = payload.pop("onboarding_status")
        if "business_type" in payload:
            biz.business_type = payload.pop("business_type")
        
        # Handle API settings updates
        if payload:  # If there are remaining fields to update in api_settings
            settings_data = dict(biz.api_settings or {})
            for k, v in payload.items():
                settings_data[k] = v
            biz.api_settings = settings_data
            from sqlalchemy.orm.attributes import flag_modified
            flag_modified(biz, "api_settings")
        
        db.commit()
        db.refresh(biz)
        return biz
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating settings: {e}")
        raise HTTPException(status_code=500, detail="Could not update business settings.")



@router.post("/{business_id}/catalog", response_model=CatalogOut, status_code=status.HTTP_201_CREATED)
def add_catalog_item(
    business_id: UUID,
    payload: CatalogCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a menu item, subscription, or catalog asset to the business's relational data store."""
    if current_user.business_id != business_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this business.")
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
def get_business_catalog(
    business_id: UUID,
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve catalog list representing items owned by this business tenant."""
    if current_user.business_id != business_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this business.")
    return (
        db.query(Catalog)
        .filter(Catalog.business_id == business_id)
        .order_by(Catalog.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/{business_id}/orders", response_model=List[OrderOut])
def get_business_orders(
    business_id: UUID,
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve all orders placed by customers for this business tenant."""
    if current_user.business_id != business_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this business.")
    # Verify business exists
    biz = db.query(Business).filter(Business.id == business_id).first()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found.")
        
    orders = (
        db.query(Order)
        .filter(Order.business_id == business_id)
        .options(joinedload(Order.customer))
        .order_by(Order.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    out = []
    for o in orders:
        out.append(OrderOut(
            id=o.id,
            business_id=o.business_id,
            customer_id=o.customer_id,
            details=o.details,
            status=o.status,
            created_at=o.created_at,
            customer_name=o.customer.name if o.customer else "Unknown Customer",
            customer_phone=o.customer.phone_number if o.customer else "Unknown Phone"
        ))
    return out


@router.patch("/{business_id}/orders/{order_id}", response_model=OrderOut)
async def update_order_status(
    business_id: UUID,
    order_id: UUID,
    payload: dict,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update status of a specific order ('pending', 'confirmed', or 'cancelled') and notify the customer via WhatsApp."""
    if current_user.business_id != business_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this business.")
    # Verify business exists
    biz = db.query(Business).filter(Business.id == business_id).first()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found.")
        
    order = db.query(Order).filter(Order.id == order_id, Order.business_id == business_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found for this business.")
        
    new_status = payload.get("status")
    if not new_status or new_status not in ["pending", "confirmed", "cancelled"]:
        raise HTTPException(status_code=400, detail="Invalid status. Must be pending, confirmed, or cancelled.")
        
    old_status = order.status
    try:
        order.status = new_status
        db.commit()
        db.refresh(order)
        
        # Notify customer if status changed and it is confirmed or cancelled
        if new_status != old_status and new_status in ["confirmed", "cancelled"] and order.customer:
            recipient_phone = order.customer.phone_number
            if recipient_phone:
                recipient_phone = recipient_phone.strip()
                # Get or create active Conversation (WhatsApp channel)
                conversation = (
                    db.query(Conversation)
                    .filter(
                        Conversation.business_id == business_id,
                        Conversation.customer_id == order.customer_id,
                        Conversation.channel == "whatsapp",
                        Conversation.status == "active"
                    )
                    .first()
                )
                if not conversation:
                    conversation = Conversation(
                        business_id=business_id,
                        customer_id=order.customer_id,
                        channel="whatsapp",
                        status="active"
                    )
                    db.add(conversation)
                    db.commit()
                    db.refresh(conversation)

                # Format notification message content
                if new_status == "confirmed":
                    notification_text = f"Your order (ID: {str(order.id)[:8]}) has been confirmed! Thank you for ordering with us."
                else: # cancelled
                    notification_text = f"Your order (ID: {str(order.id)[:8]}) has been cancelled."
                
                # Log message in database as agent message so it shows in the dashboard chat
                new_msg = Message(
                    conversation_id=conversation.id,
                    sender="agent",
                    content=notification_text
                )
                db.add(new_msg)
                db.commit()
                
                # Send the actual WhatsApp message
                biz = db.query(Business).filter(Business.id == business_id).first()
                from app.services.whatsapp import send_whatsapp_message
                await send_whatsapp_message(business=biz, to_phone=recipient_phone, text=notification_text)

        return OrderOut(
            id=order.id,
            business_id=order.business_id,
            customer_id=order.customer_id,
            details=order.details,
            status=order.status,
            created_at=order.created_at,
            customer_name=order.customer.name if order.customer else "Unknown Customer",
            customer_phone=order.customer.phone_number if order.customer else "Unknown Phone"
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating order status: {e}")
        raise HTTPException(status_code=500, detail="Could not update order status.")


@router.get("/{business_id}/chats", response_model=List[ConversationOut])
def get_business_chats(
    business_id: UUID,
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetch all conversations representing active WhatsApp customer channels for this business."""
    if current_user.business_id != business_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this business.")
    # Verify business exists
    biz = db.query(Business).filter(Business.id == business_id).first()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found.")
        
    conversations = (
        db.query(Conversation)
        .filter(Conversation.business_id == business_id, Conversation.channel == "whatsapp")
        .options(joinedload(Conversation.customer), selectinload(Conversation.messages))
        .order_by(Conversation.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    
    out = []
    for conv in conversations:
        # Load associated messages sorted in chronological order (done in-memory to avoid N+1 query)
        msgs = sorted(conv.messages, key=lambda m: m.created_at)
        mapped_msgs = [
            MessageOut(
                id=m.id,
                conversation_id=m.conversation_id,
                sender=m.sender,
                content=m.content,
                created_at=m.created_at
            ) for m in msgs
        ]
        
        last_msg = mapped_msgs[-1].content if mapped_msgs else "No messages"
        
        out.append(ConversationOut(
            id=conv.id,
            business_id=conv.business_id,
            customer_id=conv.customer_id,
            channel=conv.channel,
            status=conv.status,
            created_at=conv.created_at,
            customer_name=conv.customer.name if conv.customer else "WhatsApp User",
            customer_phone=conv.customer.phone_number if conv.customer else "Unknown Phone",
            last_message_content=last_msg,
            messages=mapped_msgs,
            is_ai_paused=conv.is_ai_paused
        ))
    return out


@router.get("/{business_id}/chats/stream")
async def chat_stream(
    business_id: UUID,
    request: Request,
    token: str = Query(..., description="Authentication token passed via query param for EventSource compatibility"),
    db: Session = Depends(get_db)
):
    """
    Server-Sent Events (SSE) endpoint to push real-time refresh signals to the client
    when new messages are received in any chat for this business.
    """
    # 1. Verify token & permissions
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        user_id_str = payload.get("user_id")
        user_biz_id_str = payload.get("business_id")
        if not user_id_str or not user_biz_id_str:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        
        if UUID(user_biz_id_str) != business_id:
            raise HTTPException(status_code=403, detail="Not authorized to access this business.")
    except Exception:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # 2. Generator that monitors messages via PubSub
    async def event_generator():
        from app.services.pubsub import chat_pubsub
        
        # Subscribe a queue for this business
        queue = chat_pubsub.subscribe(str(business_id))
        
        try:
            while True:
                # If the client disconnected, clean up immediately
                if await request.is_disconnected():
                    break
                
                try:
                    # Wait for a publish signal (suspends execution, 0% CPU/DB load)
                    msg = await asyncio.wait_for(queue.get(), timeout=30.0)
                    yield f"data: {msg}\n\n"
                except asyncio.TimeoutError:
                    # Send a heartbeat comment to keep EventSource connection alive
                    yield ": keepalive\n\n"
        except Exception as e:
            logger.error(f"Error in SSE event stream: {e}")
        finally:
            # Always clean up listener queue on disconnect
            chat_pubsub.unsubscribe(str(business_id), queue)
            
    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.post("/{business_id}/chats/{conversation_id}/messages", response_model=MessageOut)
async def send_manual_chat_reply(
    business_id: UUID,
    conversation_id: UUID,
    payload: MessageCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save a manual agent message response and transmit it back to the customer's WhatsApp number."""
    if current_user.business_id != business_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this business.")
    # Verify business exists
    biz = db.query(Business).filter(Business.id == business_id).first()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found.")
        
    conv = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.business_id == business_id
    ).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found.")
        
    customer = conv.customer
    if not customer or not customer.phone_number:
        raise HTTPException(status_code=400, detail="Customer phone number not configured.")
        
    try:
        new_msg = Message(
            conversation_id=conversation_id,
            sender="agent",
            content=payload.content
        )
        db.add(new_msg)
        db.commit()
        db.refresh(new_msg)
        
        # Publish real-time event to sync other dashboard tabs/sessions
        from app.services.pubsub import chat_pubsub
        chat_pubsub.publish(str(business_id), "refresh")
        
        # Dispatch WhatsApp outbox
        from app.services.whatsapp import send_whatsapp_message
        await send_whatsapp_message(business=biz, to_phone=customer.phone_number, text=payload.content)
        
        return MessageOut(
            id=new_msg.id,
            conversation_id=new_msg.conversation_id,
            sender=new_msg.sender,
            content=new_msg.content,
            created_at=new_msg.created_at
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Error sending manual reply: {e}")
        raise HTTPException(status_code=500, detail="Failed to dispatch and save manual message.")


@router.patch("/{business_id}/chats/{conversation_id}", response_model=ConversationOut)
def update_conversation_status(
    business_id: UUID,
    conversation_id: UUID,
    payload: dict,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Toggle the AI Agent pause flag or update the conversation status."""
    if current_user.business_id != business_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this business.")
    biz = db.query(Business).filter(Business.id == business_id).first()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found.")
        
    conv = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.business_id == business_id
    ).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found.")
        
    if "is_ai_paused" in payload:
        conv.is_ai_paused = bool(payload["is_ai_paused"])
        
    if "status" in payload:
        conv.status = payload["status"]
        
    try:
        db.commit()
        db.refresh(conv)
        
        # Load associated messages in chronological order
        msgs = (
            db.query(Message)
            .filter(Message.conversation_id == conv.id)
            .order_by(Message.created_at.asc())
            .all()
        )
        mapped_msgs = [
            MessageOut(
                id=m.id,
                conversation_id=m.conversation_id,
                sender=m.sender,
                content=m.content,
                created_at=m.created_at
            ) for m in msgs
        ]
        
        last_msg = mapped_msgs[-1].content if mapped_msgs else "No messages"
        
        return ConversationOut(
            id=conv.id,
            business_id=conv.business_id,
            customer_id=conv.customer_id,
            channel=conv.channel,
            status=conv.status,
            created_at=conv.created_at,
            customer_name=conv.customer.name if conv.customer else "WhatsApp User",
            customer_phone=conv.customer.phone_number if conv.customer else "Unknown Phone",
            last_message_content=last_msg,
            messages=mapped_msgs,
            is_ai_paused=conv.is_ai_paused
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating conversation settings: {e}")
        raise HTTPException(status_code=500, detail="Could not update conversation settings.")
