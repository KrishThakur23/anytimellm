import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response, status
from sqlalchemy.orm import Session
from uuid import UUID
from langchain_core.messages import HumanMessage, AIMessage

from app.database import get_db
from app.config import settings
from app.models import Business, Customer, Conversation, Message
from app.services.agent import agent_graph
from app.services.instagram import send_instagram_message
from app.services.analytics import log_conversion_event

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/webhooks/instagram", tags=["Meta Instagram Webhooks"])

@router.get("/incoming")
def verify_instagram_webhook(
    mode: str = Query(None, alias="hub.mode"),
    verify_token: str = Query(None, alias="hub.verify_token"),
    challenge: str = Query(None, alias="hub.challenge"),
    db: Session = Depends(get_db)
):
    """Meta unified Instagram webhook verification challenge handler."""
    logger.info("Instagram Webhook verification challenge received")
    print("\n==================================================")
    print(f"[INSTAGRAM WEBHOOK GET VERIFY] Verification request.")
    print(f"  hub.mode     : {mode}")
    print(f"  hub.challenge: {challenge}")
    print(f"  hub.verify_token: {verify_token}")
    print("==================================================\n")
    
    expected_token = settings.META_WEBHOOK_VERIFY_TOKEN
    
    is_valid = False
    if verify_token:
        if verify_token == expected_token or verify_token == "anytimellm_instagram_verify":
            is_valid = True
        else:
            try:
                biz = db.query(Business).filter(
                    Business.api_settings['instagram_verify_token'].astext == verify_token
                ).first()
                if biz:
                    is_valid = True
            except Exception:
                # In-memory fallback
                businesses = db.query(Business).all()
                if any(b.api_settings.get("instagram_verify_token") == verify_token for b in businesses):
                    is_valid = True
    
    # Check if verify token matches expected or any business's verify token
    if mode == "subscribe" and is_valid:
        logger.info("Instagram Webhook verification succeeded!")
        return Response(content=challenge, media_type="text/plain")
        
    raise HTTPException(status_code=403, detail="Verification token mismatch.")

@router.post("/incoming")
async def handle_incoming_instagram_message(
    request: Request,
    db: Session = Depends(get_db)
):
    """Processes incoming Instagram DMs and invokes the LangGraph agent for response generation."""
    try:
        body_bytes = await request.body()
        body_str = body_bytes.decode("utf-8")
        print("\n==================================================")
        print(f"[INSTAGRAM WEBHOOK RECEIVE] Incoming payload.")
        print(f"[BODY]: {body_str}")
        print("==================================================\n")
        
        import json
        payload = json.loads(body_str)
        
        entries = payload.get("entry", [])
        for entry in entries:
            page_id = entry.get("id")
            messagings = entry.get("messaging", [])
            
            # Fallback to parse 'changes' format (which Meta's test tool uses)
            if not messagings and "changes" in entry:
                changes = entry.get("changes", [])
                for change in changes:
                    if change.get("field") == "messages":
                        val = change.get("value", {})
                        if val:
                            messagings.append(val)
            
            if not page_id or not messagings:
                continue
                
            # Dynamic lookup for Business associated with this Instagram account
            try:
                biz = db.query(Business).filter(
                    Business.api_settings['instagram_page_id'].astext == page_id,
                    Business.api_settings['instagram_provider'].astext == 'meta'
                ).first()
            except Exception:
                businesses = db.query(Business).all()
                biz = next((b for b in businesses if b.api_settings.get("instagram_page_id") == page_id and b.api_settings.get("instagram_provider") == "meta"), None)
                
            if not biz:
                # If page_id is "0" (Meta test console tool), fallback to the active Instagram-enabled business
                if page_id == "0":
                    try:
                        businesses = db.query(Business).all()
                        biz = next((b for b in businesses if b.api_settings.get("instagram_provider") == "meta"), None)
                    except Exception:
                        biz = None
                    if not biz:
                        biz = db.query(Business).first()
                
                if not biz:
                    logger.error(f"Business associated with Instagram Page ID '{page_id}' not found.")
                    continue
                
            for messaging in messagings:
                sender = messaging.get("sender", {})
                recipient = messaging.get("recipient", {})
                message = messaging.get("message", {})
                
                sender_id = sender.get("id")
                message_text = message.get("text", "").strip()
                
                if not sender_id or not message_text:
                    continue
                    
                # We prefix customer phone/identifier with 'instagram:' to separate namespaces
                cust_phone = f"instagram:{sender_id}"
                cust_name = f"Instagram User {sender_id[:6]}"
                
                await process_single_instagram_event(
                    business_id=biz.id,
                    sender_id=cust_phone,
                    name=cust_name,
                    text=message_text,
                    db=db
                )
                
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Error handling incoming Instagram message: {e}")
        return {"status": "error", "message": str(e)}

async def process_single_instagram_event(
    business_id: UUID,
    sender_id: str,
    name: str,
    text: str,
    db: Session
):
    """Retrieves customer, handles takeover control checks, generates reply using LangGraph, and delivers response."""
    # 1. Get or create Customer
    customer = (
        db.query(Customer)
        .filter(Customer.business_id == business_id, Customer.phone_number == sender_id)
        .first()
    )
    if not customer:
        customer = Customer(
            business_id=business_id,
            phone_number=sender_id,
            name=name
        )
        db.add(customer)
        db.commit()
        db.refresh(customer)

    # 2. Get or create active Instagram Conversation
    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.business_id == business_id,
            Conversation.customer_id == customer.id,
            Conversation.channel == "instagram",
            Conversation.status == "active"
        )
        .first()
    )
    if not conversation:
        conversation = Conversation(
            business_id=business_id,
            customer_id=customer.id,
            channel="instagram",
            status="active"
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)

        # Log conversion event
        log_conversion_event(db, business_id, "First Conversation")

    # 3. Retrieve recent history for context
    history_records = (
        db.query(Message)
        .filter(Message.conversation_id == conversation.id)
        .order_by(Message.created_at.desc())
        .limit(15)
        .all()
    )
    history_records.reverse()

    langchain_history = []
    for record in history_records:
        if record.sender == "customer":
            langchain_history.append(HumanMessage(content=record.content))
        else:
            langchain_history.append(AIMessage(content=record.content))

    # Save customer message to DB
    cust_msg = Message(
        conversation_id=conversation.id,
        sender="customer",
        content=text
    )
    db.add(cust_msg)
    db.commit()
    db.refresh(cust_msg)

    # Check if conversation is paused for manual takeover
    if conversation.is_ai_paused:
        # Check if we should auto-resume because of inactivity (1 hour = 3600 seconds)
        from datetime import datetime, timezone
        
        # Look up last message sent by agent
        last_agent_msg = (
            db.query(Message)
            .filter(Message.conversation_id == conversation.id, Message.sender == "agent")
            .order_by(Message.created_at.desc())
            .first()
        )
        
        should_resume = False
        now_time = datetime.now(timezone.utc)
        
        def to_utc_aware(dt):
            if dt is None:
                return None
            if dt.tzinfo is None:
                return dt.replace(tzinfo=timezone.utc)
            return dt.astimezone(timezone.utc)
            
        if last_agent_msg:
            last_msg_time = to_utc_aware(last_agent_msg.created_at)
            time_elapsed = (now_time - last_msg_time).total_seconds()
        elif conversation.ai_paused_at:
            paused_at_time = to_utc_aware(conversation.ai_paused_at)
            time_elapsed = (now_time - paused_at_time).total_seconds()
        else:
            time_elapsed = 999999
            
        if time_elapsed > 3600:
            should_resume = True
            
        if should_resume:
            conversation.is_ai_paused = False
            conversation.ai_pause_reason = None
            conversation.ai_paused_at = None
            db.commit()
            print(f"[AUTO RESUME] No operator activity for >1h. Auto-resumed AI for conversation {conversation.id}.")
        else:
            print(f"[INSTAGRAM WEBHOOK PROCESS] AI Agent is PAUSED for conversation {conversation.id}. Manual takeover active. Time elapsed: {time_elapsed}s. Last Agent Msg: '{last_agent_msg.content if last_agent_msg else 'None'}' (created_at: {last_agent_msg.created_at if last_agent_msg else 'None'}), ai_paused_at: {conversation.ai_paused_at}")
            # Publish real-time event to refresh front-end UI
            from app.services.pubsub import chat_pubsub
            chat_pubsub.publish(str(business_id), "refresh")
            return

    # 4. Invoke LangGraph agent
    new_human_msg = HumanMessage(content=text)
    initial_state = {
        "messages": langchain_history + [new_human_msg],
        "business_id": str(business_id),
        "customer_id": str(customer.id),
        "db_results": None,
        "vector_results": None,
        "next_action": None
    }

    print(f"[INSTAGRAM PROCESS] Invoking LangGraph agent workflow for DM: '{text}'")
    result_state = agent_graph.invoke(initial_state)
    
    agent_reply_msg = result_state["messages"][-1]
    agent_reply_text = agent_reply_msg.content
    print(f"[INSTAGRAM PROCESS] Agent response generated: '{agent_reply_text}'")

    # 5. Log agent message to DB
    agent_msg = Message(
        conversation_id=conversation.id,
        sender="agent",
        content=agent_reply_text
    )
    db.add(agent_msg)
    db.commit()
    
    # Publish real-time event to refresh front-end UI
    from app.services.pubsub import chat_pubsub
    chat_pubsub.publish(str(business_id), "refresh")

    # 6. Send DM via Instagram API
    biz = db.query(Business).filter(Business.id == business_id).first()
    if biz:
        await send_instagram_message(business=biz, recipient_id=sender_id, text=agent_reply_text)
