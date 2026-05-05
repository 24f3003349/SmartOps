from datetime import datetime
from enum import Enum
from typing import Optional, List
from sqlmodel import SQLModel, Field, JSON, Column

class TicketStatus(str, Enum):
    NEW = "new"
    IN_PROGRESS = "in_progress"
    WAITING = "waiting"
    RESOLVED = "resolved"

class TicketPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class TicketBase(SQLModel):
    title: str
    description: str
    status: TicketStatus = Field(default=TicketStatus.NEW)
    priority: TicketPriority = Field(default=TicketPriority.MEDIUM)
    category: Optional[str] = None
    contact_email: str
    assigned_to: Optional[int] = Field(default=None, foreign_key="user.id")

class Ticket(TicketBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    ai_suggestion: Optional[str] = None
    ai_confidence: Optional[float] = None
    metadata_info: dict = Field(default_factory=dict, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TicketCreate(TicketBase):
    pass

class TicketUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TicketStatus] = None
    priority: Optional[TicketPriority] = None
    category: Optional[str] = None
    assigned_to: Optional[int] = None
    ai_suggestion: Optional[str] = None
