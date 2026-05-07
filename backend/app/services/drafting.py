from llama_index.core import PromptTemplate
from .knowledge import knowledge_service
from ..models.ticket import Ticket
from ..core.llm import setup_llm

DRAFT_PROMPT_TMPL = (
    "You are a professional customer support agent for SmartOps AI.\n"
    "Your goal is to draft a helpful, polite, and accurate response to the customer ticket below.\n"
    "Use the provided context from our knowledge base to answer the user's questions.\n\n"
    "--- TICKET ---\n"
    "Title: {title}\n"
    "Description: {description}\n\n"
    "--- CONTEXT ---\n"
    "{context_str}\n\n"
    "--- INSTRUCTION ---\n"
    "Draft a professional email reply. If the context doesn't contain the answer, "
    "provide a polite general response and mention that a human agent will follow up soon.\n"
    "Final Draft:"
)

class DraftingService:
    def __init__(self):
        self.llm = setup_llm()
        self.prompt_tmpl = PromptTemplate(DRAFT_PROMPT_TMPL)

    def generate_draft(self, ticket: Ticket) -> str:
        """Generates a response draft based on ticket content and knowledge base context."""
        try:
            # 1. Get Query Engine from Knowledge Service
            query_engine = knowledge_service.get_query_engine()
            
            # 2. Query the engine with the ticket title/description
            # We use the ticket content as the query
            query_str = f"Ticket Title: {ticket.title}\nDescription: {ticket.description}"
            response = query_engine.query(query_str)
            
            # 3. If the query engine already did the synthesis, we can return it.
            # But to ensure custom branding/tone, we can do a second pass if needed.
            # For now, we'll trust the QueryEngine's response as the base.
            return str(response)
        except Exception as e:
            print(f"Error during draft generation: {str(e)}")
            return (
                f"Hi there,\n\n"
                f"Thank you for reaching out about '{ticket.title}'. "
                f"Our team has received your ticket and is looking into it. "
                f"We will get back to you as soon as possible.\n\n"
                f"Best regards,\nSmartOps Support Team"
            )

drafting_service = DraftingService()
