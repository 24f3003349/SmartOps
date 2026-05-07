# Phase 3: AI Classification & Routing - Context

**Gathered:** 2026-05-05
**Status:** Ready for planning
**Source:** PRD (docs/PRD.md)

<domain>
## Phase Boundary
This phase implements the "AI Brain" for ticket triage. It focuses on:
- **Classification Service:** Analyzing ticket title/description to predict category and priority.
- **Confidence Scoring:** Calculating a confidence score for AI predictions.
- **Auto-Routing:** Logic to assign tickets to users/teams based on predicted category.
- **Human-in-the-Loop:** Flagging low-confidence tickets for manual review.

</domain>

<decisions>
## Implementation Decisions

### AI Logic
- **Provider:** Use LlamaIndex with the configured provider (Ollama/OpenAI).
- **Prompt Engineering:** Use structured output (Pydantic) for classification results.
- **Metadata:** Store AI predictions (confidence, category, priority) in the `metadata_info` JSON field of the `Ticket` model.

### Routing
- **Assignment:** Update the `assigned_to` field in the `Ticket` model.
- **Rules Engine:** Initial implementation will be a simple mapping of `category -> user_id`.

### the agent's Discretion
- **Trigger:** Classification should trigger immediately after ticket ingestion (async background task).
- **UI:** Update the Tickets table to show "Predicted Category" and "AI Confidence".

</decisions>

<canonical_refs>
## Canonical References
- `backend/app/models/ticket.py` — Ticket schema.
- `backend/app/services/knowledge.py` — Existing AI service pattern.
- `backend/app/api/v1/endpoints/tickets.py` — Ingestion point.
</canonical_refs>

<deferred>
## Deferred Ideas
- Complex skill-based routing (Phase 4).
- LLM-based reply drafting (Phase 4).
- Advanced analytics on classification accuracy (Phase 5).
</deferred>

---
*Phase: 03-ai-classification-routing*
*Context gathered: 2026-05-05*
