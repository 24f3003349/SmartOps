# Phase 3 Research: AI Classification & Routing

## 1. Structured AI Extraction (LlamaIndex)
To get reliable categories and priorities, we should use LlamaIndex's `PydanticProgram` or `StructuredOutput` capabilities.
- **Input:** Ticket title and description.
- **Output Schema:**
  ```python
  class ClassificationResult(BaseModel):
      category: str
      priority: str
      confidence: float
      reasoning: str
  ```
- **Prompt:** A few-shot prompt with predefined categories (e.g., Technical, Billing, General) and priorities (Low, Medium, High, Urgent).

## 2. Asynchronous Triage (FastAPI)
Classification can take 2-10 seconds depending on the model (Ollama).
- **Implementation:** Use `fastapi.BackgroundTasks` in the `POST /tickets` endpoint.
- **Flow:** Ingest ticket -> Return 201 -> Trigger background task -> Update ticket in DB with AI predictions.

## 3. Auto-Routing Logic
- **Users:** We need a way to find users in the DB to assign tickets to.
- **Mapping:** A simple dictionary or a new `RoutingRule` table. For Phase 3, a configurable dictionary in `core/config.py` is sufficient.
- **Update:** The background task will update `assigned_to` and `status` (e.g., from `new` to `triaged`).

## 4. UI Updates
- **Inbox:** Add columns for "AI Prediction" (badge style) and "Confidence" (progress bar or text).
- **Role-based view:** (Deferred) but ensure the table can filter by `assigned_to`.

---
*Phase: 03-ai-classification-routing*
*Research completed: 2026-05-05*
