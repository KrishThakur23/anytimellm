import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List
from langchain_core.messages import HumanMessage, AIMessage

from app.database import get_db
from app.models import Business, Customer, Conversation, Message
from app.schemas import ChatMessageIn, ChatMessageOut
from app.services.agent import agent_graph

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/chat", tags=["Web Chat Interface"])

@router.post("/{business_id}", response_model=ChatMessageOut)
def chat_with_agent(
    business_id: UUID,
    payload: ChatMessageIn,
    db: Session = Depends(get_db)
):
    """Processes web chat messages, runs the compiled LangGraph orchestration agent, and returns the response."""
    # 1. Verify business
    biz = db.query(Business).filter(Business.id == business_id).first()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found.")

    try:
        # 2. Get or create Customer
        customer = (
            db.query(Customer)
            .filter(Customer.business_id == business_id, Customer.phone_number == payload.customer_phone)
            .first()
        )
        if not customer:
            customer = Customer(
                business_id=business_id,
                phone_number=payload.customer_phone,
                name="Web User"
            )
            db.add(customer)
            db.commit()
            db.refresh(customer)

        # 3. Get or create active Conversation
        conversation = (
            db.query(Conversation)
            .filter(
                Conversation.business_id == business_id,
                Conversation.customer_id == customer.id,
                Conversation.channel == "web",
                Conversation.status == "active"
            )
            .first()
        )
        if not conversation:
            conversation = Conversation(
                business_id=business_id,
                customer_id=customer.id,
                channel="web",
                status="active"
            )
            db.add(conversation)
            db.commit()
            db.refresh(conversation)

        # 4. Fetch message history for LangGraph context
        # Note: We fetch the last 15 messages to avoid blowing up context window
        history_records = (
            db.query(Message)
            .filter(Message.conversation_id == conversation.id)
            .order_by(Message.created_at.desc())
            .limit(15)
            .all()
        )
        history_records.reverse()  # chronological order

        langchain_history = []
        for record in history_records:
            if record.sender == "customer":
                langchain_history.append(HumanMessage(content=record.content))
            else:
                langchain_history.append(AIMessage(content=record.content))

        # 5. Build input state for LangGraph
        new_human_msg = HumanMessage(content=payload.content)
        initial_state = {
            "messages": langchain_history + [new_human_msg],
            "business_id": str(business_id),
            "customer_id": str(customer.id),
            "db_results": None,
            "vector_results": None,
            "next_action": None
        }

        # 6. Execute LangGraph
        result_state = agent_graph.invoke(initial_state)
        
        # Extract reply content
        agent_reply_msg = result_state["messages"][-1]
        agent_reply_text = agent_reply_msg.content

        # 7. Write history logs in database
        cust_msg = Message(
            conversation_id=conversation.id,
            sender="customer",
            content=payload.content
        )
        agent_msg = Message(
            conversation_id=conversation.id,
            sender="agent",
            content=agent_reply_text
        )
        db.add(cust_msg)
        db.add(agent_msg)
        db.commit()
        db.refresh(agent_msg)

        return ChatMessageOut(
            sender="agent",
            content=agent_reply_text,
            created_at=agent_msg.created_at
        )

    except Exception as e:
        db.rollback()
        logger.error(f"Error executing chat loop: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error executing chatbot session: {str(e)}"
        )
