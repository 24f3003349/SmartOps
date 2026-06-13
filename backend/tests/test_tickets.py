import pytest
from sqlmodel import Session, select
from app.models.ticket import Ticket, TicketStatus, TicketPriority
from app.models.user import User

@pytest.fixture(autouse=True)
def seed_user(session: Session):
    """Seeds a default user with ID 1 to satisfy foreign key / routing requirements."""
    user = User(
        id=1,
        email="admin@smartops.ai",
        hashed_password="hashedpassword",
        full_name="Admin User",
        is_superuser=True
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

def test_create_ticket_and_triage(client, session):
    # 1. Verify list is empty
    response = client.get("/api/v1/tickets/")
    assert response.status_code == 200
    assert len(response.json()) == 0

    # 2. Create ticket
    payload = {
        "title": "Need help with billing statement",
        "description": "I got billed twice for my subscription this month. Please refund.",
        "contact_email": "customer@example.com",
        "status": "new",
        "priority": "medium"
    }
    
    response = client.post("/api/v1/tickets/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] is not None
    assert data["title"] == payload["title"]
    assert data["contact_email"] == payload["contact_email"]
    
    # 3. Check triage background task was run and committed to database
    ticket_id = data["id"]
    db_ticket = session.get(Ticket, ticket_id)
    assert db_ticket is not None
    # Category Billing has high priority and high confidence in our mock
    assert db_ticket.category == "Billing"
    assert db_ticket.priority == TicketPriority.HIGH
    assert db_ticket.ai_confidence == 0.85
    assert db_ticket.assigned_to == 1
    assert db_ticket.status == TicketStatus.NEW

def test_low_confidence_triage_routing(client, session):
    # Urgent in title triggers low confidence mock (0.55 confidence)
    payload = {
        "title": "Urgent technical outage",
        "description": "The server is completely down!",
        "contact_email": "dev@example.com"
    }
    response = client.post("/api/v1/tickets/", json=payload)
    assert response.status_code == 201
    ticket_id = response.json()["id"]
    
    db_ticket = session.get(Ticket, ticket_id)
    # Check that confidence < 0.6 updates status to waiting
    assert db_ticket.category == "Technical"
    assert db_ticket.priority == TicketPriority.URGENT
    assert db_ticket.ai_confidence == 0.55
    assert db_ticket.status == TicketStatus.WAITING

def test_read_ticket(client, session):
    # Add a ticket manually
    ticket = Ticket(
        title="General question",
        description="How do I change my settings?",
        contact_email="user@example.com",
        status="new"
    )
    session.add(ticket)
    session.commit()
    session.refresh(ticket)
    
    # Retrieve it
    response = client.get(f"/api/v1/tickets/{ticket.id}")
    assert response.status_code == 200
    assert response.json()["title"] == "General question"
    
    # Non-existent ticket
    response = client.get("/api/v1/tickets/999")
    assert response.status_code == 404

def test_resolve_ticket(client, session):
    # Add ticket
    ticket = Ticket(
        title="Billing refund",
        description="Double charge",
        contact_email="user@example.com",
        status="new"
    )
    session.add(ticket)
    session.commit()
    session.refresh(ticket)
    
    # Resolve
    resolution = "Refund processed successfully."
    response = client.post(
        f"/api/v1/tickets/{ticket.id}/resolve?resolution_text={resolution}"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "resolved"
    assert data["ai_suggestion"] == resolution
    
    # Verify in DB
    db_ticket = session.get(Ticket, ticket.id)
    assert db_ticket.status == TicketStatus.RESOLVED

def test_generate_draft(client, session):
    # Add ticket
    ticket = Ticket(
        title="Technical issue with login",
        description="Cannot login to my account",
        contact_email="user@example.com",
        status="new"
    )
    session.add(ticket)
    session.commit()
    session.refresh(ticket)
    
    # Generate draft
    response = client.post(f"/api/v1/tickets/{ticket.id}/draft")
    assert response.status_code == 200
    assert "Mocked email response draft" in response.json()["draft"]
