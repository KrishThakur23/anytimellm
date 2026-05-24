import os
import sys
import asyncio
from uuid import UUID

# Ensure we are looking in current directory for modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.routers.webhook import process_single_whatsapp_event

DATABASE_URL = "postgresql://postgres:postgrespassword@localhost:5432/anytimellm"

async def main():
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    business_id = UUID("7565af2b-0fd9-4668-b4a1-f0adcce945cf")
    phone = "919810218674"
    name = "Krish Thakur"
    text = "Hey"
    
    print("Calling process_single_whatsapp_event...")
    try:
        from app.models import Customer, Conversation, Message
        from app.services.agent import agent_graph
        from app.services.meta_whatsapp import send_whatsapp_message
        from langchain_core.messages import HumanMessage, AIMessage
        
        # 1. Get or create Customer
        customer = (
            db.query(Customer)
            .filter(Customer.business_id == business_id, Customer.phone_number == phone)
            .first()
        )
        if not customer:
            print("Creating customer...")
            customer = Customer(
                business_id=business_id,
                phone_number=phone,
                name=name
            )
            db.add(customer)
            db.commit()
            db.refresh(customer)
        else:
            print("Found customer.")

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
            print("Creating conversation...")
            conversation = Conversation(
                business_id=business_id,
                customer_id=customer.id,
                channel="whatsapp",
                status="active"
            )
            db.add(conversation)
            db.commit()
            db.refresh(conversation)
        else:
            print("Found conversation.")

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

        print("Invoking agent graph...")
        result_state = agent_graph.invoke(initial_state)
        
        agent_reply_msg = result_state["messages"][-1]
        agent_reply_text = agent_reply_msg.content
        print(f"Agent Reply: {agent_reply_text}")

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
        print("Logged messages to DB.")

        # 6. Send outgoing reply message via Meta WhatsApp Graph API
        print("Sending outgoing WhatsApp message...")
        await send_whatsapp_message(to_phone=phone, text=agent_reply_text)
        print("Outbound message function finished.")
        
    except Exception as e:
        import traceback
        db.rollback()
        print("EXCEPTION OCCURRED:")
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(main())
