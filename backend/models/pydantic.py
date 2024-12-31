from pydantic import BaseModel
from typing import List

# ChatMessage model remains the same
class ChatMessage(BaseModel):
    role: str
    content: str

# Updated ChatRequest model to include session_id
class ChatRequest(BaseModel):
    session_id: str  # Include session_id to track the session
    messages: List[ChatMessage]
