import logging
import json
from typing import Dict, Any, List
from sqlalchemy import text
from app.database import SessionLocal
from app.services.vector_db import search_vector_store
from app.models import Catalog, Order, Customer, Business

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
            # If filename is an auto-generated WhatsApp image, format as a generic knowledge context block
            if "WhatsApp Image" in filename or filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                formatted_results.append(f"Knowledge Context Block {i+1}:\n{doc.page_content}\n")
            else:
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
        
        # Check if structured catalog table is empty for this tenant
        total_items = db.query(Catalog).filter(Catalog.business_id == biz_uuid).count()
        if total_items == 0:
            return "No structured catalog items found. Note: The structured SQL catalog is currently empty for this business. Please search the unstructured uploaded documents using query_vector_store_tool to find the menu, price lists, or business details."
            
        # Parse query for generic words
        query_text = search_query.strip().lower() if search_query else ""
        generic_words = ["menu", "all", "list", "items", "catalog", "food", "show", "get"]
        
        stmt = (
            db.query(Catalog)
            .filter(Catalog.business_id == biz_uuid)
            .filter(Catalog.is_available == True)
        )
        
        if query_text and query_text not in generic_words:
            stmt = stmt.filter(
                Catalog.name.ilike(f"%{search_query}%") | 
                Catalog.description.ilike(f"%{search_query}%")
            )
            
        results = stmt.limit(30).all()
        if not results:
            return f"No products or catalog items matching '{search_query}' were found in the structured catalog. If you think the menu or item is in an uploaded image or document, try calling query_vector_store_tool."
            
        # Fetch business to check business_type
        biz = db.query(Business).filter(Business.id == biz_uuid).first()
        b_type = biz.business_type if (biz and biz.business_type) else "dining"

        catalog_list = []
        for item in results:
            item_data = {
                "name": item.name,
                "price": float(item.price) if item.price else 0.0,
                "description": item.description or "",
                "category": item.category or ""
            }
            attrs = item.attributes or {}
            if b_type == "clothing":
                item_data["variants"] = attrs.get("variants", [])
                item_data["available_sizes"] = attrs.get("sizes", [])
            elif b_type == "grocery":
                item_data["unit"] = attrs.get("unit", "piece")
                item_data["stock_quantity"] = attrs.get("stock_quantity", 0)
            elif b_type == "salon":
                item_data["duration_minutes"] = attrs.get("duration", 30)
                item_data["available_staff"] = attrs.get("staff_member", "Any Staff")
            else:  # dining / default
                item_data["available"] = attrs.get("available", True)
                
            catalog_list.append(item_data)
            
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

        # Fetch business to check business_type
        biz = db.query(Business).filter(Business.id == biz_uuid).first()
        b_type = biz.business_type if (biz and biz.business_type) else "dining"

        # Type-specific validation checks
        if b_type == "clothing":
            for item in items:
                if not item.get("size") or not item.get("color"):
                    return "Error: Please specify both 'size' and 'color' for the clothing item you wish to order."
        elif b_type == "salon":
            for item in items:
                if not item.get("time_slot") or not item.get("date"):
                    return "Error: Please specify both 'date' and 'time_slot' for your salon appointment booking."

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
        
        msg = "Order placed successfully. A representative will contact you to confirm."
        if b_type == "salon":
            msg = "Appointment booked successfully. A representative will contact you to confirm."

        return json.dumps({
            "status": "success",
            "order_id": str(new_order.id),
            "message": msg,
            "details": new_order.details
        })
    except Exception as e:
        db.rollback()
        logger.error(f"Error placing order: {e}")
        return f"Error submitting order: {str(e)}"
    finally:
        db.close()


def get_customer_orders_tool(customer_id: str, business_id: str) -> str:
    """Retrieve all orders placed by this customer, showing order ID, items, status, and creation date."""
    db = SessionLocal()
    try:
        import uuid
        cust_uuid = uuid.UUID(customer_id) if isinstance(customer_id, str) else customer_id
        biz_uuid = uuid.UUID(business_id) if isinstance(business_id, str) else business_id
        
        orders = (
            db.query(Order)
            .filter(Order.business_id == biz_uuid, Order.customer_id == cust_uuid)
            .order_by(Order.created_at.desc())
            .all()
        )
        if not orders:
            return "You have not placed any orders yet."
            
        orders_list = []
        for o in orders:
            orders_list.append({
                "order_id": str(o.id),
                "status": o.status,
                "details": o.details,
                "created_at": o.created_at.isoformat()
            })
        return json.dumps(orders_list, indent=2)
    except Exception as e:
        logger.error(f"Error in get_customer_orders_tool: {e}")
        return f"Error retrieving orders: {str(e)}"
    finally:
        db.close()


def cancel_order_tool(order_id: str, customer_id: str, business_id: str) -> str:
    """Cancel a specific order using the order ID. The status of the order will be changed to 'cancelled'."""
    db = SessionLocal()
    try:
        import uuid
        ord_uuid = uuid.UUID(order_id) if isinstance(order_id, str) else order_id
        cust_uuid = uuid.UUID(customer_id) if isinstance(customer_id, str) else customer_id
        biz_uuid = uuid.UUID(business_id) if isinstance(business_id, str) else business_id
        
        order = (
            db.query(Order)
            .filter(Order.id == ord_uuid, Order.business_id == biz_uuid, Order.customer_id == cust_uuid)
            .first()
        )
        if not order:
            return f"Error: Order with ID '{order_id}' was not found for this account."
            
        if order.status == "cancelled":
            return "This order has already been cancelled."
            
        order.status = "cancelled"
        db.commit()
        
        return json.dumps({
            "status": "success",
            "message": "Your order has been cancelled successfully.",
            "order_id": order_id
        })
    except Exception as e:
        db.rollback()
        logger.error(f"Error in cancel_order_tool: {e}")
        return f"Error cancelling order: {str(e)}"
    finally:
        db.close()
