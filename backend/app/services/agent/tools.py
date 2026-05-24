import logging
import json
from typing import Dict, Any, List
from sqlalchemy import text
from app.database import SessionLocal
from app.services.vector_db import search_vector_store
from app.models import Catalog, Order, Customer

logger = logging.getLogger(__name__)

def query_vector_store_tool(query: str, business_id: str) -> str:
    """Search business-specific unstructured knowledge base for menus, policies, catalogs, or business information."""
    try:
        docs = search_vector_store(query, business_id, k=4)
        if not docs:
            return "No matching unstructured documents found."
            
        formatted_results = []
        for i, doc in enumerate(docs):
            filename = doc.metadata.get("file_name", "Unknown File")
            formatted_results.append(f"Source [{filename}]:\n{doc.page_content}\n")
            
        return "\n---\n".join(formatted_results)
    except Exception as e:
        logger.error(f"Error in vector store tool: {e}")
        return f"Error searching knowledge base: {str(e)}"


def query_catalog_sql_tool(search_query: str, business_id: str) -> str:
    """Safe read-only search of structured catalog items (menu items, subscriptions, price lookups)."""
    db = SessionLocal()
    try:
        import uuid
        biz_uuid = uuid.UUID(business_id) if isinstance(business_id, str) else business_id
        # Perform structured filter to isolate tenant business_id
        # We query the catalogs table matching name or description
        stmt = (
            db.query(Catalog)
            .filter(Catalog.business_id == biz_uuid)
            .filter(Catalog.is_available == True)
            .filter(
                Catalog.name.ilike(f"%{search_query}%") | 
                Catalog.description.ilike(f"%{search_query}%")
            )
            .limit(10)
        )
        results = stmt.all()
        if not results:
            return f"No products or catalog items matching '{search_query}' were found."
            
        catalog_list = []
        for item in results:
            catalog_list.append({
                "name": item.name,
                "price": float(item.price) if item.price else 0.0,
                "description": item.description or "",
                "category": item.category or "",
                "attributes": item.attributes
            })
            
        return json.dumps(catalog_list, indent=2)
    except Exception as e:
        logger.error(f"Error query catalog tool: {e}")
        return f"Error executing catalog search: {str(e)}"
    finally:
        db.close()


def place_order_tool(customer_id: str, business_id: str, order_items_json: str) -> str:
    """Write action to place an order for catalog items. Takes structured JSON string of items and quantity."""
    db = SessionLocal()
    try:
        import uuid
        cust_uuid = uuid.UUID(customer_id) if isinstance(customer_id, str) else customer_id
        biz_uuid = uuid.UUID(business_id) if isinstance(business_id, str) else business_id

        # Parse items check
        try:
            items = json.loads(order_items_json)
        except json.JSONDecodeError:
            return "Error: order_items_json is invalid JSON format."

        # Verify customer belongs to the business
        customer = db.query(Customer).filter(Customer.id == cust_uuid, Customer.business_id == biz_uuid).first()
        if not customer:
            return "Error: Customer profile not found or invalid business tenant."

        # Create structured order
        new_order = Order(
            business_id=biz_uuid,
            customer_id=cust_uuid,
            details={"items": items},
            status="pending"
        )
        db.add(new_order)
        db.commit()
        db.refresh(new_order)
        
        logger.info(f"Order created successfully: {new_order.id}")
        return json.dumps({
            "status": "success",
            "order_id": str(new_order.id),
            "message": "Order placed successfully. A representative will contact you to confirm.",
            "details": new_order.details
        })
    except Exception as e:
        db.rollback()
        logger.error(f"Error placing order: {e}")
        return f"Error submitting order: {str(e)}"
    finally:
        db.close()
