import pytest
from unittest.mock import MagicMock
from app.services.triage import TriageService, TriageResult

def test_triage_service_success():
    # Instantiate a service
    service = TriageService()
    
    # Mock the program call
    mock_result = TriageResult(
        category="Billing",
        priority="high",
        confidence=0.95,
        reasoning="Test billing query"
    )
    service.program = MagicMock(return_value=mock_result)
    
    result = service.classify_ticket("Billing issue", "I was charged twice.")
    
    assert result.category == "Billing"
    assert result.priority == "high"
    assert result.confidence == 0.95
    assert result.reasoning == "Test billing query"
    service.program.assert_called_once_with(title="Billing issue", description="I was charged twice.")

def test_triage_service_exception_fallback():
    service = TriageService()
    
    # Force program to throw an exception
    service.program = MagicMock(side_effect=Exception("Ollama offline"))
    
    result = service.classify_ticket("Billing issue", "I was charged twice.")
    
    # Verify fallback is triggered
    assert result.category == "General"
    assert result.priority == "medium"
    assert result.confidence == 0.5
    assert "Error in AI classification" in result.reasoning
    assert "Ollama offline" in result.reasoning
