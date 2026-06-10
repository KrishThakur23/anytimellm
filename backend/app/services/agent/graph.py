import logging
from typing import Literal, Dict, Any
from langchain_core.messages import SystemMessage, AIMessage, ToolMessage
from langchain_core.tools import tool
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, END

from app.config import settings
from app.database import SessionLocal
from app.models import Business
from app.services.agent.state import AgentState
from app.services.agent import tools as real_tools

logger = logging.getLogger(__name__)

# 1. Define LLM schemas for tools (these only expose arguments to LLM, business_id and customer_id are injected in nodes)

@tool
def query_vector_store_tool(query: str) -> str:
    """Search unstructured documents, FAQs, policies, scraped website data, and custom catalogs for this business."""
    return ""

@tool
def query_catalog_sql_tool(search_query: str) -> str:
    """Search the structured database catalog for products, menu items, prices, subscriptions, or item availability."""
    return ""

@tool
def place_order_tool(order_items_json: str) -> str:
    """Place an order or book an appointment for catalog items. The items parameter must be a JSON array, e.g. '[{"name": "Burger", "quantity": 2}]'."""
    return ""

@tool
def get_customer_orders_tool() -> str:
    """Retrieve all orders placed by this customer, showing order ID, items list, status, and creation date."""
    return ""

@tool
def cancel_order_tool(order_id: str) -> str:
    """Cancel a specific order using its order ID. The order ID must be retrieved by checking customer orders first."""
    return ""

tools_list = [query_vector_store_tool, query_catalog_sql_tool, place_order_tool, get_customer_orders_tool, cancel_order_tool]


class FallbackLLM:
    def __init__(self, tools):
        self.tools = tools
        self.models_config = []
        
        # 1. Gemini 2.5 Flash
        if settings.GEMINI_API_KEY:
            self.models_config.append({
                "name": "Gemini 2.5 Flash",
                "model_id": "gemini-2.5-flash",
                "client": ChatGoogleGenerativeAI(
                    model="gemini-2.5-flash",
                    google_api_key=settings.GEMINI_API_KEY,
                    temperature=0.2
                ).bind_tools(tools)
            })
            
        # 2. Gemini 3.1 Flash Lite
        if settings.GEMINI_API_KEY:
            self.models_config.append({
                "name": "Gemini 3.1 Flash Lite",
                "model_id": "gemini-3.1-flash-lite",
                "client": ChatGoogleGenerativeAI(
                    model="gemini-3.1-flash-lite",
                    google_api_key=settings.GEMINI_API_KEY,
                    temperature=0.2
                ).bind_tools(tools)
            })
            
        # 3. GPT-4o-mini
        if settings.OPENAI_API_KEY:
            try:
                from langchain_openai import ChatOpenAI
                self.models_config.append({
                    "name": "GPT-4o-mini",
                    "model_id": "gpt-4o-mini",
                    "client": ChatOpenAI(
                        model="gpt-4o-mini",
                        api_key=settings.OPENAI_API_KEY,
                        temperature=0.2
                    ).bind_tools(tools)
                })
            except Exception as e:
                logger.error(f"Failed to load langchain-openai client: {e}")
            
        # Fallback to local mock if no API keys are configured
        if not self.models_config:
            logger.warning("No LLM API keys configured. Falling back to local Mock LLM.")
            self.models_config.append({
                "name": "Mock LLM",
                "model_id": "mock-llm",
                "client": self._get_mock_client()
            })

    def _get_mock_client(self):
        class MockClient:
            def invoke(self, messages, **kwargs):
                if messages and messages[-1].__class__.__name__ == "ToolMessage":
                    tool_msg = messages[-1]
                    return AIMessage(content=f"I have successfully executed the tool '{tool_msg.name}'. Result details: {tool_msg.content}")

                last_msg = messages[-1].content.lower()
                if "catalog" in last_msg or "price" in last_msg or "menu" in last_msg:
                    return AIMessage(
                        content="Let me look up the catalog for you.",
                        tool_calls=[{
                            "name": "query_catalog_sql_tool",
                            "args": {"search_query": "deep clean"},
                            "id": "call_mock_sql_1"
                        }]
                    )
                elif "order" in last_msg or "buy" in last_msg:
                    return AIMessage(
                        content="Submitting order.",
                        tool_calls=[{
                            "name": "place_order_tool",
                            "args": {"order_items_json": '[{"name": "Prophylaxis Deep Cleaning", "quantity": 1}]'},
                            "id": "call_mock_order_1"
                        }]
                    )
                elif "info" in last_msg or "policy" in last_msg:
                    return AIMessage(
                        content="Checking files.",
                        tool_calls=[{
                            "name": "query_vector_store_tool",
                            "args": {"query": last_msg},
                            "id": "call_mock_vector_1"
                        }]
                    )
                return AIMessage(content="Hello! I'm AnytimeLLM's assistant. How can I help you check the catalog, make an order, or read our docs?")
        return MockClient()

    def invoke(self, messages, **kwargs):
        attempts = 2  # First run + 1 retry of the whole list
        
        for attempt in range(1, attempts + 1):
            if attempt > 1:
                print(f"\n[LLM FALLBACK CHAIN] >>> Starting Retry Cycle #{attempt - 1} of the entire model sequence...")
                logger.info(f"Starting Retry Cycle #{attempt - 1} of the entire model sequence")
                
            for idx, model_info in enumerate(self.models_config):
                name = model_info["name"]
                model_id = model_info["model_id"]
                client = model_info["client"]
                
                print(f"[LLM EXECUTION] Attempting model {idx+1}/{len(self.models_config)}: {name} ({model_id}) [Cycle {attempt}]")
                logger.info(f"Attempting model {name} ({model_id}) [Cycle {attempt}]")
                
                try:
                    response = client.invoke(messages, **kwargs)
                    print(f"[LLM SUCCESS] Model {name} ({model_id}) succeeded!")
                    logger.info(f"Model {name} ({model_id}) succeeded")
                    return response
                except Exception as e:
                    error_msg = str(e)
                    print(f"[LLM FALLBACK WARNING] Model {name} ({model_id}) failed: {error_msg}")
                    logger.warning(f"Model {name} ({model_id}) failed: {error_msg}")
                    
        # Graceful fallback response if all models and retries fail
        error_reply = "I'm sorry, I am currently experiencing connection issues with my reasoning models. Please try again in a few moments."
        print(f"[LLM FALLBACK ERROR] All models and retries failed. Returning graceful fallback reply.")
        logger.error("All models and retries failed. Returning graceful fallback reply.")
        return AIMessage(content=error_reply)


def get_llm():
    """Initializes standard fallback wrapper adapter."""
    class LLMFactory:
        def bind_tools(self, tools):
            return FallbackLLM(tools)
    return LLMFactory()


# 2. Define Graph Nodes

def agent_node(state: AgentState) -> Dict[str, Any]:
    """Invokes the Gemini LLM model with state history and business custom context."""
    logger.info("Executing Agent Node")
    
    # Query business name and customized prompt from DB
    db = SessionLocal()
    business_name = "AnytimeLLM Client"
    system_prompt = "You are a helpful, professional business AI assistant. You have tools to search catalog databases, retrieve document files, and place customer orders."
    b_type = "dining"
    try:
        import uuid
        biz_uuid = uuid.UUID(state["business_id"]) if isinstance(state["business_id"], str) else state["business_id"]
        business = db.query(Business).filter(Business.id == biz_uuid).first()
        if business:
            business_name = business.name
            system_prompt = business.api_settings.get("system_prompt", system_prompt)
            b_type = business.business_type or "dining"
    except Exception as e:
        logger.error(f"Error querying business settings: {e}")
    finally:
        db.close()

    # Build type-specific descriptions
    place_tool_desc = (
        "To place orders or reserve catalog items, use place_order_tool. Once placed, always state clearly: 'Order placed' or 'Order placed successfully'."
        if b_type != "salon" else
        "To book service slots or appointments, use place_order_tool. Once booked, always state clearly: 'Appointment booked' or 'Appointment booked successfully'."
    )
    cancel_tool_desc = (
        "To cancel a specific order, use cancel_order_tool. Always call get_customer_orders_tool first to identify the correct order ID. Once cancelled, always state clearly: 'Your order was cancelled' or 'Your order has been cancelled successfully'."
        if b_type != "salon" else
        "To cancel a specific appointment, use cancel_order_tool. Always call get_customer_orders_tool first to identify the correct booking ID. Once cancelled, always state clearly: 'Your appointment was cancelled' or 'Your appointment has been cancelled successfully'."
    )
    history_tool_desc = (
        "To retrieve the customer's order history or check order status, use get_customer_orders_tool."
        if b_type != "salon" else
        "To retrieve the customer's appointment history or check booking status, use get_customer_orders_tool."
    )

    # Prepend business guidelines system message
    full_prompt = (
        f"{system_prompt}\n\n"
        f"Context & Persona Guidelines:\n"
        f"- You are a customer support agent representing the business: {business_name}.\n"
        f"- Always speak as an official representative of {business_name}.\n"
        f"- Current Business ID: {state['business_id']}\n"
        f"- Customer ID: {state['customer_id']}\n\n"
        f"Instructions:\n"
        f"1. To check catalogs, pricing, or menus, call the query_catalog_sql_tool first. If it returns that the catalog is empty or has no matching items, you MUST query the unstructured files using query_vector_store_tool to find the menu, price lists, or catalog details.\n"
        f"2. To fetch company details, policies, hours, or generic guidelines, call query_vector_store_tool.\n"
        f"3. {place_tool_desc}\n"
        f"4. {history_tool_desc}\n"
        f"5. {cancel_tool_desc}\n"
        f"6. Keep answers clean, direct, and tailored to the business information retrieved.\n"
        f"7. CRITICAL: Never mention filenames, file extensions (e.g. 'WhatsApp Image...', '.jpeg', '.pdf', '.png'), document sources, or database queries to the customer. State information directly.\n"
        f"8. CRITICAL: Avoid meta-talk like 'Based on the retrieved document...', 'I have searched...', or 'According to the file...'. Respond directly and conversationally.\n"
        f"9. CRITICAL: If you do not have enough information to answer the question, state that politely or ask for clarification, rather than summarizing your search attempts.\n"
        f"10. CRITICAL: You must remain strictly on-topic and focus only on the business, store catalog, menu, services, opening hours, policies, or placing/cancelling orders/appointments. If the customer asks random, off-topic, or irrelevant questions (such as video games, sports, general knowledge, math, coding, personal chat, or opinions about other topics), politely decline to answer, state that you can only assist with store-related inquiries, and steer them back to your business offerings."
    )
    
    sys_msg = SystemMessage(content=full_prompt)
    
    llm = get_llm()
    llm_with_tools = llm.bind_tools(tools_list)
    
    # Run model
    response = llm_with_tools.invoke([sys_msg] + list(state["messages"]))
    
    # Coerce content to string if it returned as a list of content blocks
    if isinstance(response.content, list):
        text_parts = []
        for part in response.content:
            if isinstance(part, dict):
                if part.get("type") == "text":
                    text_parts.append(part.get("text", ""))
            elif isinstance(part, str):
                text_parts.append(part)
        response.content = "".join(text_parts)
    
    return {"messages": [response]}


def execute_tools_node(state: AgentState) -> Dict[str, Any]:
    """Intercepts and executes the requested LLM tool calls using verified context parameters from State."""
    logger.info("Executing Tools Node")
    
    messages = state["messages"]
    last_message = messages[-1]
    
    tool_messages = []
    
    if not hasattr(last_message, "tool_calls") or not last_message.tool_calls:
        logger.warning("Tools node called but no tool calls found.")
        return {"messages": []}
        
    for tool_call in last_message.tool_calls:
        tool_name = tool_call["name"]
        arguments = tool_call["args"]
        call_id = tool_call.get("id", "call_default")
        
        logger.info(f"Invoking tool {tool_name} with arguments: {arguments}")
        
        # Enforce multi-tenancy by using state variables directly rather than LLM parameters
        if tool_name == "query_vector_store_tool":
            result = real_tools.query_vector_store_tool(
                query=arguments.get("query", ""),
                business_id=state["business_id"]
            )
        elif tool_name == "query_catalog_sql_tool":
            result = real_tools.query_catalog_sql_tool(
                search_query=arguments.get("search_query", ""),
                business_id=state["business_id"]
            )
        elif tool_name == "place_order_tool":
            result = real_tools.place_order_tool(
                customer_id=state["customer_id"],
                business_id=state["business_id"],
                order_items_json=arguments.get("order_items_json", "[]")
            )
        elif tool_name == "get_customer_orders_tool":
            result = real_tools.get_customer_orders_tool(
                customer_id=state["customer_id"],
                business_id=state["business_id"]
            )
        elif tool_name == "cancel_order_tool":
            result = real_tools.cancel_order_tool(
                order_id=arguments.get("order_id", ""),
                customer_id=state["customer_id"],
                business_id=state["business_id"]
            )
        else:
            result = f"Error: Tool name '{tool_name}' is not recognized."
            
        tool_messages.append(ToolMessage(
            content=result,
            name=tool_name,
            tool_call_id=call_id
        ))
        
    return {"messages": tool_messages}


# 3. Define Conditional Routing

def should_continue(state: AgentState) -> Literal["continue", "end"]:
    """Determines whether to loop to tools execution or end the conversation step."""
    messages = state["messages"]
    last_message = messages[-1]
    
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "continue"
    return "end"


# 4. Compile Graph

workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("agent", agent_node)
workflow.add_node("tools", execute_tools_node)

# Set entry point
workflow.set_entry_point("agent")

# Add conditional path
workflow.add_conditional_edges(
    "agent",
    should_continue,
    {
        "continue": "tools",
        "end": END
    }
)

# Loop tools output back to agent
workflow.add_edge("tools", "agent")

# Compile graph
agent_graph = workflow.compile()
