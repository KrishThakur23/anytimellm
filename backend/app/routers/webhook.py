import logging
from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response, status
from sqlalchemy.orm import Session
from uuid import UUID
from langchain_core.messages import HumanMessage, AIMessage

from app.database import get_db
from app.config import settings
from app.models import Business, Customer, Conversation, Message
from app.services.agent import agent_graph
from app.services.twilio_whatsapp import send_whatsapp_message

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/webhooks/whatsapp", tags=["Meta WhatsApp Webhooks"])

@router.get("/incoming")
def verify_whatsapp_unified_webhook(
    mode: str = Query(None, alias="hub.mode"),
    verify_token: str = Query(None, alias="hub.verify_token"),
    challenge: str = Query(None, alias="hub.challenge")
):
    """Meta unified webhook verification endpoint. Responds to verification challenges globally."""
    print("\n==================================================")
    print(f"[UNIFIED WEBHOOK GET VERIFY] Verification request.")
    print(f"  hub.mode     : {mode}")
    print(f"  hub.challenge: {challenge}")
    print(f"  hub.verify_token: {verify_token}")
    print("==================================================\n")
    logger.info(f"Meta unified webhook verification challenge received")
    
    expected_token = settings.META_WEBHOOK_VERIFY_TOKEN
    if mode == "subscribe" and verify_token == expected_token:
        logger.info("Unified Webhook verification succeeded!")
        print("[UNIFIED WEBHOOK GET VERIFY SUCCESS] Verification tokens match!")
        return Response(content=challenge, media_type="text/plain")
        
    logger.warning(f"Unified Webhook verification failed. Expected: {expected_token}, Got: {verify_token}")
    print("[UNIFIED WEBHOOK GET VERIFY ERROR] Verification failed!")
    raise HTTPException(status_code=403, detail="Verification token mismatch.")

@router.post("/incoming")
async def handle_incoming_unified_message(
    request: Request,
    db: Session = Depends(get_db)
):
    """Processes incoming WhatsApp messages from the unified App webhook, resolves the business by phone_number_id, and triggers the agent."""
    try:
        body_bytes = await request.body()
        body_str = body_bytes.decode("utf-8")
        print("\n==================================================")
        print(f"[UNIFIED WEBHOOK RECEIVE] Incoming payload.")
        print(f"[BODY]: {body_str}")
        print("==================================================\n")
        
        import json
        payload = json.loads(body_str)
        
        entries = payload.get("entry", [])
        for entry in entries:
            changes = entry.get("changes", [])
            for change in changes:
                value = change.get("value", {})
                metadata = value.get("metadata", {})
                phone_number_id = metadata.get("phone_number_id")
                
                messages = value.get("messages", [])
                contacts = value.get("contacts", [])
                
                if not phone_number_id or not messages:
                    continue
                    
                # Resolve Business dynamically by phone_number_id
                try:
                    biz = db.query(Business).filter(Business.api_settings['meta_phone_number_id'].astext == phone_number_id).first()
                except Exception:
                    # In-memory fallback
                    businesses = db.query(Business).all()
                    biz = next((b for b in businesses if b.api_settings.get("meta_phone_number_id") == phone_number_id), None)
                    
                if not biz:
                    logger.error(f"Business workspace with phone_number_id '{phone_number_id}' not found in database.")
                    print(f"[UNIFIED WEBHOOK ERROR] Business workspace not found for phone_number_id: {phone_number_id}")
                    continue
                    
                msg = messages[0]
                if msg.get("type") != "text":
                    logger.warning(f"Unsupported message type received on unified webhook: {msg.get('type')}")
                    continue
                    
                customer_phone = msg.get("from")
                message_body = msg.get("text", {}).get("body", "").strip()
                
                if not customer_phone or not message_body:
                    continue
                    
                customer_name = "WhatsApp User"
                if contacts:
                    customer_name = contacts[0].get("profile", {}).get("name", "WhatsApp User")
                    
                print(f"[UNIFIED WEBHOOK ROUTE SUCCESS] Resolved Business ID: {biz.id} ({biz.name})")
                await process_single_whatsapp_event(
                    business_id=biz.id,
                    phone=customer_phone,
                    name=customer_name,
                    text=message_body,
                    db=db
                )
                
    except Exception as e:
        logger.error(f"Failed to parse incoming unified webhook payload: {e}")
        print(f"[UNIFIED WEBHOOK PARSE ERROR]: {e}")
        return {"status": "error", "message": "Failed to parse body"}

    return {"status": "accepted"}


@router.get("/{business_id}")
def verify_whatsapp_webhook(
    business_id: UUID,
    mode: str = Query(None, alias="hub.mode"),
    verify_token: str = Query(None, alias="hub.verify_token"),
    challenge: str = Query(None, alias="hub.challenge"),
    db: Session = Depends(get_db)
):
    """Meta webhook verification endpoint. Responds to GET request verify challenge."""
    print("\n==================================================")
    print(f"[WEBHOOK GET VERIFY] Received verification request.")
    print(f"  business_id  : {business_id}")
    print(f"  hub.mode     : {mode}")
    print(f"  hub.challenge: {challenge}")
    print(f"  hub.verify_token: {verify_token}")
    print("==================================================\n")
    logger.info(f"Meta webhook verification challenge received for business: {business_id}")
    
    # Verify business exists
    biz = db.query(Business).filter(Business.id == business_id).first()
    if not biz:
        print(f"[WEBHOOK GET VERIFY ERROR] Business tenant {business_id} not found in database!")
        raise HTTPException(status_code=404, detail="Business tenant not found.")

    # Match verify token
    # Support overriding verification token on a per-business basis, falling back to global settings
    expected_token = biz.api_settings.get("wa_verify_token", settings.META_WA_VERIFY_TOKEN)
    print(f"[WEBHOOK GET VERIFY] Expected verification token: '{expected_token}'")
    print(f"[WEBHOOK GET VERIFY] Received verification token: '{verify_token}'")
    
    if mode == "subscribe" and verify_token == expected_token:
        logger.info("Webhook verification succeeded!")
        print("[WEBHOOK GET VERIFY SUCCESS] Verification tokens match! Returning challenge response.")
        return Response(content=challenge, media_type="text/plain")
        
    logger.warning(f"Webhook verification failed. Expected: {expected_token}, Got: {verify_token}")
    print("[WEBHOOK GET VERIFY ERROR] Verification failed! Tokens do not match or mode is not 'subscribe'.")
    raise HTTPException(status_code=403, detail="Verification token mismatch.")


@router.post("/{business_id}")
async def handle_incoming_whatsapp_message(
    business_id: UUID,
    request: Request,
    db: Session = Depends(get_db)
):
    """Processes incoming WhatsApp messages from Meta or Twilio, runs the business's LangGraph agent, and sends back replies."""
    try:
        content_type = request.headers.get("content-type", "")
        
        if "application/x-www-form-urlencoded" in content_type:
            # Twilio Webhook (Form urlencoded)
            form_data = await request.form()
            body_str = str(dict(form_data))
            print("\n==================================================")
            print(f"[TWILIO WEBHOOK RECEIVE] Business: {business_id}")
            print(f"[TWILIO WEBHOOK BODY]: {body_str}")
            print("==================================================\n")
            
            customer_phone = form_data.get("From", "")
            if customer_phone.startswith("whatsapp:"):
                customer_phone = customer_phone.replace("whatsapp:", "").strip()
                
            message_body = form_data.get("Body", "").strip()
            customer_name = form_data.get("ProfileName", "WhatsApp User")
            
            if not customer_phone or not message_body:
                print("[TWILIO WEBHOOK] Missing 'From' or 'Body' field in payload.")
                return {"status": "ignored", "reason": "missing fields"}
                
            await process_single_whatsapp_event(
                business_id=business_id,
                phone=customer_phone,
                name=customer_name,
                text=message_body,
                db=db
            )
            
        else:
            # Meta Webhook (JSON)
            body_bytes = await request.body()
            body_str = body_bytes.decode("utf-8")
            print("\n==================================================")
            print(f"[META WEBHOOK RECEIVE] Business: {business_id}")
            print(f"[META WEBHOOK BODY]: {body_str}")
            print("==================================================\n")
            
            import json
            payload = json.loads(body_str)
            
            entries = payload.get("entry", [])
            for entry in entries:
                changes = entry.get("changes", [])
                for change in changes:
                    value = change.get("value", {})
                    messages = value.get("messages", [])
                    contacts = value.get("contacts", [])
                    
                    if not messages:
                        continue
                        
                    msg = messages[0]
                    if msg.get("type") != "text":
                        logger.warning(f"Unsupported message type received: {msg.get('type')}")
                        continue
                        
                    customer_phone = msg.get("from")
                    message_body = msg.get("text", {}).get("body", "").strip()
                    
                    if not customer_phone or not message_body:
                        continue
                        
                    customer_name = "WhatsApp User"
                    if contacts:
                        customer_name = contacts[0].get("profile", {}).get("name", "WhatsApp User")
                        
                    await process_single_whatsapp_event(
                        business_id=business_id,
                        phone=customer_phone,
                        name=customer_name,
                        text=message_body,
                        db=db
                    )
                    
    except Exception as e:
        logger.error(f"Failed to parse incoming webhook payload: {e}")
        print(f"[WEBHOOK PARSE ERROR]: {e}")
        import traceback
        traceback.print_exc()
        return {"status": "error", "message": "Failed to parse body"}

    return {"status": "accepted"}


async def process_single_whatsapp_event(
    business_id: UUID,
    phone: str,
    name: str,
    text: str,
    db: Session
):
    """Performs customer retrieval, state restoration, LangGraph invocation, and outbound message delivery."""
    try:
        # 1. Get or create Customer
        customer = (
            db.query(Customer)
            .filter(Customer.business_id == business_id, Customer.phone_number == phone)
            .first()
        )
        if not customer:
            customer = Customer(
                business_id=business_id,
                phone_number=phone,
                name=name
            )
            db.add(customer)
            db.commit()
            db.refresh(customer)

        # 2. Get or create active Conversation (WhatsApp channel)
        conversation = (
            db.query(Conversation)
            .filter(
                Conversation.business_id == business_id,
                Conversation.customer_id == customer.id,
                Conversation.channel == "whatsapp",
                Conversation.status == "active"
            )
            .first()
        )
        if not conversation:
            conversation = Conversation(
                business_id=business_id,
                customer_id=customer.id,
                channel="whatsapp",
                status="active"
            )
            db.add(conversation)
            db.commit()
            db.refresh(conversation)

        # 3. Retrieve recent history for agent context (last 15 messages)
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

        # Check if conversation is paused for manual takeover
        if conversation.is_ai_paused:
            print(f"[WEBHOOK PROCESS] AI Agent is PAUSED for conversation {conversation.id}. Logging customer message and skipping AI reply.")
            cust_msg = Message(
                conversation_id=conversation.id,
                sender="customer",
                content=text
            )
            db.add(cust_msg)
            db.commit()
            print(f"[WEBHOOK PROCESS] Logged messages to DB (Conversation ID: {conversation.id})")
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

        print(f"[WEBHOOK PROCESS] Invoking LangGraph agent workflow for message: '{text}'")
        result_state = agent_graph.invoke(initial_state)
        
        agent_reply_msg = result_state["messages"][-1]
        agent_reply_text = agent_reply_msg.content
        print(f"[WEBHOOK PROCESS] Agent response generated: '{agent_reply_text}'")

        # 5. Log messages to DB
        cust_msg = Message(
            conversation_id=conversation.id,
            sender="customer",
            content=text
        )
        agent_msg = Message(
            conversation_id=conversation.id,
            sender="agent",
            content=agent_reply_text
        )
        db.add(cust_msg)
        db.add(agent_msg)
        db.commit()
        print(f"[WEBHOOK PROCESS] Logged messages to DB (Conversation ID: {conversation.id})")

        # 6. Send outgoing reply message via Twilio or Meta WhatsApp API
        biz = db.query(Business).filter(Business.id == business_id).first()
        if biz:
            print(f"[WEBHOOK PROCESS] Sending reply via WhatsApp API for business: {biz.name} to {phone}...")
            await send_whatsapp_message(business=biz, to_phone=phone, text=agent_reply_text)
            print(f"[WEBHOOK PROCESS] Reply sent successfully!")
        else:
            print(f"[WEBHOOK PROCESS ERROR] Business {business_id} not found on reply step.")

    except Exception as e:
        db.rollback()
        logger.error(f"Error processing WhatsApp event: {e}")
        print(f"[WEBHOOK PROCESS ERROR] Exception occurred: {e}")
        import traceback
        traceback.print_exc()
