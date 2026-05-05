from fastapi import APIRouter
from .endpoints import tickets, knowledge

api_router = APIRouter()
api_router.include_router(tickets.router, prefix="/tickets", tags=["tickets"])
api_router.include_router(knowledge.router, prefix="/knowledge", tags=["knowledge"])
