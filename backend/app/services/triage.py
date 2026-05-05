from typing import Optional
from pydantic import BaseModel, Field
from llama_index.core.program import LLMTextCompletionProgram
from ..core.llm import setup_llm

class TriageResult(BaseModel):
    category: str = Field(description="The category of the ticket (e.g., Technical, Billing, General, Feature Request)")
    priority: str = Field(description="The priority of the ticket (low, medium, high, urgent)")
    confidence: float = Field(description="Confidence score for the prediction (0.0 to 1.0)")
    reasoning: str = Field(description="Brief reasoning for the classification")

TRIAGE_PROMPT_TMPL = (
    "You are an expert support agent. Classify the following ticket into JSON format.\n"
    "Title: {title}\n"
    "Description: {description}\n\n"
    "Available Categories: Technical, Billing, General, Feature Request\n"
    "Available Priorities: low, medium, high, urgent\n\n"
    "Output MUST be valid JSON matching this schema:\n"
    "{{\"category\": \"string\", \"priority\": \"string\", \"confidence\": float, \"reasoning\": \"string\"}}\n"
    "Do NOT include any other text before or after the JSON.\n"
)

class TriageService:
    def __init__(self):
        self.llm = setup_llm()
        self.program = LLMTextCompletionProgram.from_defaults(
            output_cls=TriageResult,
            prompt_template_str=TRIAGE_PROMPT_TMPL,
            llm=self.llm,
            verbose=True
        )

    def classify_ticket(self, title: str, description: str) -> TriageResult:
        """Classifies a ticket and returns a structured result."""
        try:
            result = self.program(title=title, description=description)
            return result
        except Exception as e:
            print(f"Error during classification: {str(e)}")
            # Fallback
            return TriageResult(
                category="General",
                priority="medium",
                confidence=0.5,
                reasoning=f"Error in AI classification: {str(e)}"
            )

triage_service = TriageService()
