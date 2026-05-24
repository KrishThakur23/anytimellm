from typing import TypedDict, Annotated, Sequence, Optional
from langchain_core.messages import BaseMessage
import operator

class AgentState(TypedDict):
    # Conversation message history
    messages: Annotated[Sequence[BaseMessage], operator.add]
    
    # Context keys for multi-tenancy and routing
    business_id: str
    customer_id: str
    
    # Store intermediate retrieved data
    db_results: Optional[str]
    vector_results: Optional[str]
    
    # Controls graph flow transitions
    next_action: Optional[str]
