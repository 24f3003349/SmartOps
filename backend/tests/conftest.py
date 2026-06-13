import pytest
from unittest.mock import MagicMock
from sqlmodel import create_engine, SQLModel, Session
from sqlalchemy.pool import StaticPool

# 1. Create a shared in-memory SQLite database engine for testing
test_engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

# 2. Patch app.core.db engine before any other modules import it
import app.core.db
app.core.db.engine = test_engine

# 3. Import app and models now that the engine is patched
from app.main import app
from app.core.db import get_session
from app.models.ticket import Ticket
from app.models.user import User

@pytest.fixture
def session():
    """Provides a clean database session for each test by recreating tables."""
    SQLModel.metadata.create_all(test_engine)
    
    with Session(test_engine) as db_session:
        # Inject active session into FastAPI get_session dependency
        def override_get_session():
            yield db_session
            
        app.dependency_overrides[get_session] = override_get_session
        yield db_session
        
    app.dependency_overrides.clear()
    SQLModel.metadata.drop_all(test_engine)

@pytest.fixture
def client(session):
    """Provides a TestClient to make HTTP requests against the FastAPI app."""
    from fastapi.testclient import TestClient
    with TestClient(app) as test_client:
        yield test_client

# 4. Mock AI Services to avoid needing local Ollama or OpenAI credentials
@pytest.fixture(autouse=True)
def mock_ai_services(monkeypatch):
    """Mocks triage and drafting services to return pre-defined responses immediately."""
    from app.services.triage import triage_service, TriageResult
    from app.services.drafting import drafting_service
    from app.services.knowledge import knowledge_service
    
    # Mock Triage Service
    def mock_classify_ticket(title: str, description: str):
        # Determine simple mock class based on title
        category = "Technical"
        priority = "medium"
        confidence = 0.85
        reasoning = "Mocked classification for testing"
        
        if "billing" in title.lower() or "billing" in description.lower():
            category = "Billing"
            priority = "high"
        elif "feature" in title.lower():
            category = "Feature Request"
            priority = "low"
        elif "urgent" in title.lower() or "urgent" in description.lower():
            priority = "urgent"
            confidence = 0.55 # Low confidence test
            
        return TriageResult(
            category=category,
            priority=priority,
            confidence=confidence,
            reasoning=reasoning
        )
        
    monkeypatch.setattr(triage_service, "classify_ticket", mock_classify_ticket)
    
    # Mock Drafting Service
    def mock_generate_draft(ticket):
        return f"Mocked email response draft for ticket '{ticket.title}' based on knowledge base."
        
    monkeypatch.setattr(drafting_service, "generate_draft", mock_generate_draft)
    
    # Mock Knowledge Service to prevent real file loading/embedding
    mock_query_engine = MagicMock()
    mock_query_engine.query.return_value = "Mocked query engine response"
    
    monkeypatch.setattr(knowledge_service, "get_query_engine", lambda: mock_query_engine)
    monkeypatch.setattr(knowledge_service, "ingest_documents", lambda: None)
    monkeypatch.setattr(knowledge_service, "load_index", lambda: None)
