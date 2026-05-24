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

tools_list = [query_vector_store_tool, query_catalog_sql_tool, place_order_tool]


def get_llm():
    """Initializes Google Gemini model, with a clean local fallback if keys are missing."""
    if not settings.GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY not found. Using local mock chatbot LLM.")
        # Local mock fallback
        class MockLLM:
            def bind_tools(self, tools):
                return self
            def __call__(self, messages, **kwargs):
                return AIMessage(content="[LLM Mock Response] Please configure GEMINI_API_KEY to test real AI agent reasoning.")
            def invoke(self, messages, **kwargs):
                # If the last message is a ToolMessage, summarize and finish the loop
                if messages and messages[-1].__class__.__name__ == "ToolMessage":
                    tool_msg = messages[-1]
                    return AIMessage(content=f"I have successfully executed the tool '{tool_msg.name}'. Result details: {tool_msg.content}")

                # Simple pattern match to invoke mock tool calls for testing if desired
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
                return AIMessage(content="Hello! I'm Apex Dental Care's assistant. How can I help you check the catalog, make an order, or read our docs?")
        return MockLLM()
        
    try:
        return ChatGoogleGenerativeAI(
            model="gemini-3.1-flash-lite",
            google_api_key=settings.GEMINI_API_KEY,
            temperature=0.2
        )
    except Exception as e:
        logger.error(f"Error loading Gemini model: {e}")
        raise e


# 2. Define Graph Nodes

def agent_node(state: AgentState) -> Dict[str, Any]:
    """Invokes the Gemini LLM model with state history and business custom context."""
    logger.info("Executing Agent Node")
    
    # Query business name and customized prompt from DB
    db = SessionLocal()
    business_name = "AnytimeLLM Client"
    system_prompt = "You are a helpful, professional business AI assistant. You have tools to search catalog databases, retrieve document files, and place customer orders."
    try:
        import uuid
        biz_uuid = uuid.UUID(state["business_id"]) if isinstance(state["business_id"], str) else state["business_id"]
        business = db.query(Business).filter(Business.id == biz_uuid).first()
        if business:
            business_name = business.name
            system_prompt = business.api_settings.get("system_prompt", system_prompt)
    except Exception as e:
        logger.error(f"Error querying business settings: {e}")
    finally:
        db.close()

    # Prepend business guidelines system message
    full_prompt = (
        f"{system_prompt}\n"
        f"Context details:\n"
        f"- You are assisting customers on behalf of: {business_name}.\n"
        f"- Current Business ID: {state['business_id']}\n"
        f"- Customer ID: {state['customer_id']}\n\n"
        f"Instructions:\n"
        f"1. To check catalogs, pricing, or menus, call the query_catalog_sql_tool.\n"
        f"2. To fetch company details, policies, hours, or generic guidelines, call query_vector_store_tool.\n"
        f"3. To place orders or reserve catalog items, use place_order_tool.\n"
        f"4. Keep answers clean, direct, and tailored to the business information retrieved."
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
