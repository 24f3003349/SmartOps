import pytest
from fastapi.testclient import TestClient

def test_full_ticket_lifecycle_with_diff_and_events(client: TestClient):
    # 1. Create a ticket
    ticket_payload = {
        "title": "Database Connection Timeout",
        "description": "Our application cannot connect to the PostgreSQL cluster after 10:00 PM.",
        "contact_email": "devops@company.com",
        "status": "new",
        "priority": "medium"
    }
    create_res = client.post("/api/v1/tickets/", json=ticket_payload)
    assert create_res.status_code == 201
    ticket_data = create_res.json()
    ticket_id = ticket_data["id"]
    assert ticket_id is not None

    # 2. Get ticket draft
    draft_res = client.post(f"/api/v1/tickets/{ticket_id}/draft")
    assert draft_res.status_code == 200
    draft_text = draft_res.json().get("draft")
    assert draft_text is not None

    # 3. Resolve ticket with modified response (Human-in-the-Loop)
    final_response = draft_text + "\n\nNote: Upgraded DB instance to db.m5.large."
    resolve_res = client.post(
        f"/api/v1/tickets/{ticket_id}/resolve",
        params={"resolution_text": final_response}
    )
    assert resolve_res.status_code == 200
    resolved_ticket = resolve_res.json()
    assert resolved_ticket["status"] == "resolved"
    assert "metadata_info" in resolved_ticket
    assert "similarity_score" in resolved_ticket["metadata_info"]
    assert "edit_distance" in resolved_ticket["metadata_info"]

    # 4. Check analytics metrics summary
    analytics_res = client.get("/api/v1/analytics/summary")
    assert analytics_res.status_code == 200
    summary = analytics_res.json()
    assert "avg_draft_similarity" in summary
    assert summary["total_tickets"] >= 1
