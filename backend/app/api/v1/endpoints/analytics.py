from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from typing import Dict, Any
from ....core.db import get_session
from ....models.ticket import Ticket

router = APIRouter()

@router.get("/overview")
def get_analytics_overview(session: Session = Depends(get_session)) -> Dict[str, Any]:
    """Retrieves high-level metrics for the dashboard."""
    
    # 1. Total Tickets
    total_tickets = session.exec(select(func.count(Ticket.id))).one()
    
    # 2. Resolved Tickets
    resolved_tickets = session.exec(
        select(func.count(Ticket.id)).where(Ticket.status == "resolved")
    ).one()
    
    # 3. Avg AI Confidence (excluding nulls)
    avg_confidence = session.exec(
        select(func.avg(Ticket.ai_confidence)).where(Ticket.ai_confidence != None)
    ).one() or 0.0
    
    # 4. Category Distribution
    categories = session.exec(
        select(Ticket.category, func.count(Ticket.id))
        .where(Ticket.category != None)
        .group_by(Ticket.category)
    ).all()
    
    category_dist = {cat: count for cat, count in categories}
    
    # 5. Pending Triage (status == new and category == None)
    pending_triage = session.exec(
        select(func.count(Ticket.id))
        .where(Ticket.status == "new")
        .where(Ticket.category == None)
    ).one()

    return {
        "total_tickets": total_tickets,
        "resolved_tickets": resolved_tickets,
        "avg_confidence": round(float(avg_confidence), 2),
        "pending_triage": pending_triage,
        "category_distribution": category_dist,
        "resolution_rate": round((resolved_tickets / total_tickets * 100), 1) if total_tickets > 0 else 0
    }
