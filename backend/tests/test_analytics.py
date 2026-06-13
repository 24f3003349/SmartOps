import pytest
from app.models.ticket import Ticket, TicketStatus

def test_analytics_empty_database(client):
    response = client.get("/api/v1/analytics/overview")
    assert response.status_code == 200
    data = response.json()
    assert data["total_tickets"] == 0
    assert data["resolved_tickets"] == 0
    assert data["avg_confidence"] == 0.0
    assert data["pending_triage"] == 0
    assert data["category_distribution"] == {}
    assert data["resolution_rate"] == 0

def test_analytics_populated_database(client, session):
    # Add tickets manually to database
    t1 = Ticket(
        title="T1",
        description="D1",
        contact_email="u1@example.com",
        status=TicketStatus.NEW,
        category=None,
        ai_confidence=None
    )
    t2 = Ticket(
        title="T2",
        description="D2",
        contact_email="u2@example.com",
        status=TicketStatus.RESOLVED,
        category="Billing",
        ai_confidence=0.9
    )
    t3 = Ticket(
        title="T3",
        description="D3",
        contact_email="u3@example.com",
        status=TicketStatus.IN_PROGRESS,
        category="Technical",
        ai_confidence=0.8
    )
    t4 = Ticket(
        title="T4",
        description="D4",
        contact_email="u4@example.com",
        status=TicketStatus.RESOLVED,
        category="Technical",
        ai_confidence=0.7
    )
    session.add_all([t1, t2, t3, t4])
    session.commit()
    
    response = client.get("/api/v1/analytics/overview")
    assert response.status_code == 200
    data = response.json()
    
    assert data["total_tickets"] == 4
    assert data["resolved_tickets"] == 2
    # Resolution rate = 2/4 * 100 = 50.0%
    assert data["resolution_rate"] == 50.0
    # Avg confidence = (0.9 + 0.8 + 0.7) / 3 = 0.8
    assert data["avg_confidence"] == 0.8
    # Pending triage = status == new and category == None (t1 satisfies this)
    assert data["pending_triage"] == 1
    
    # Category distribution: Billing=1, Technical=2
    dist = data["category_distribution"]
    assert dist["Billing"] == 1
    assert dist["Technical"] == 2
