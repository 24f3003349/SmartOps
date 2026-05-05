from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlmodel import Session, select
from typing import List
from ....core.db import get_session, engine
from ....core.config import settings
from ....models.ticket import Ticket
from ....services.triage import triage_service

router = APIRouter()

def process_ticket_triage(ticket_id: int):
    """Background task to classify and route the ticket."""
    print(f"DEBUG: Starting triage for ticket {ticket_id}")
    with Session(engine) as session:
        ticket = session.get(Ticket, ticket_id)
        if not ticket:
            print(f"DEBUG: Ticket {ticket_id} not found in background task")
            return
        
        # Run AI Triage
        print(f"DEBUG: Running AI classification for ticket {ticket_id}")
        result = triage_service.classify_ticket(ticket.title, ticket.description)
        print(f"DEBUG: AI Result: {result}")
        
        # Update Ticket
        ticket.category = result.category
        ticket.priority = result.priority
        ticket.ai_confidence = result.confidence
        ticket.ai_suggestion = result.reasoning
        
        # Simple Routing
        assigned_to = settings.DEFAULT_ROUTING.get(result.category)
        if assigned_to:
            print(f"DEBUG: Routing to user {assigned_to}")
            ticket.assigned_to = assigned_to
        
        # If confidence is low, flag for review (status update)
        if result.confidence < 0.6:
            print(f"DEBUG: Low confidence triage, setting status to waiting")
            ticket.status = "waiting"
            
        session.add(ticket)
        session.commit()
        print(f"DEBUG: Triage completed and committed for ticket {ticket_id}")

@router.get("/", response_model=List[Ticket])
def read_tickets(
    session: Session = Depends(get_session),
    offset: int = 0,
    limit: int = 100,
):
    tickets = session.exec(select(Ticket).offset(offset).limit(limit)).all()
    return tickets

@router.post("/", response_model=Ticket, status_code=201)
def create_ticket(
    *,
    session: Session = Depends(get_session),
    ticket: Ticket,
    background_tasks: BackgroundTasks
):
    session.add(ticket)
    session.commit()
    session.refresh(ticket)
    
    # Trigger AI Triage in background
    background_tasks.add_task(process_ticket_triage, ticket.id)
    
    return ticket

@router.get("/{ticket_id}", response_model=Ticket)
def read_ticket(
    *,
    session: Session = Depends(get_session),
    ticket_id: str
):
    ticket = session.get(Ticket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket
