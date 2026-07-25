import asyncio
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlmodel import Session, select
from typing import List
from ....core.db import get_session, engine
from ....core.config import settings
from ....models.ticket import Ticket
from ....services.triage import triage_service
from ....services.drafting import drafting_service
from ....services.diff_metrics import calculate_diff_metrics
from ....services.events import event_broadcaster

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
        
        try:
            event_broadcaster.publish_sync("triage_completed", {"ticket_id": ticket_id, "category": ticket.category, "priority": ticket.priority})
        except Exception as e:
            print(f"Warning: Failed to broadcast triage event: {str(e)}")

@router.post("/{ticket_id}/draft", response_model=dict)
def generate_ticket_draft(
    *,
    session: Session = Depends(get_session),
    ticket_id: int
):
    """Generates an AI response draft for a ticket."""
    ticket = session.get(Ticket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    draft = drafting_service.generate_draft(ticket)
    return {"draft": draft}

@router.post("/{ticket_id}/resolve", response_model=Ticket)
def resolve_ticket(
    *,
    session: Session = Depends(get_session),
    ticket_id: int,
    resolution_text: str
):
    """Resolves a ticket with a final response and computes diff metrics."""
    ticket = session.get(Ticket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Calculate diff metrics between original AI suggestion/draft and final response
    original_draft = ticket.ai_suggestion or ""
    diff_data = calculate_diff_metrics(original_draft, resolution_text)
    
    # Update ticket info
    ticket.status = "resolved"
    ticket.ai_suggestion = resolution_text # Save final text
    metadata = dict(ticket.metadata_info or {})
    metadata.update(diff_data)
    ticket.metadata_info = metadata
    
    # Simulate sending email
    print(f"SIMULATION: Sending email to {ticket.contact_email} with resolution: {resolution_text[:50]}...")
    
    session.add(ticket)
    session.commit()
    session.refresh(ticket)
    return ticket

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
    
    # Broadcast ticket creation event
    try:
        event_broadcaster.publish_sync("ticket_created", {"ticket_id": ticket.id, "title": ticket.title})
    except Exception:
        pass
    
    return ticket

@router.get("/{ticket_id}", response_model=Ticket)
def read_ticket(
    *,
    session: Session = Depends(get_session),
    ticket_id: int
):
    ticket = session.get(Ticket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


