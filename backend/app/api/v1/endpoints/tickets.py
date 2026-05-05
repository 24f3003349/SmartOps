from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlmodel import Session, select
from typing import List
from ....core.db import get_session
from ....models.ticket import Ticket

router = APIRouter()

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
    ticket: Ticket
):
    session.add(ticket)
    session.commit()
    session.refresh(ticket)
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
