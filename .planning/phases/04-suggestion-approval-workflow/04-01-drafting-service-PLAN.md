---
wave: 1
depends_on: []
files_modified: [
  "backend/app/services/drafting.py",
  "backend/app/services/knowledge.py"
]
requirements_addressed: [REQ-07]
autonomous: true
---

# Plan 04-01: RAG Drafting Service

## Objective
Implement the logic to generate a ticket response draft using retrieved knowledge base context.

## Tasks

<task>
<read_first>
- backend/app/services/knowledge.py
- backend/app/models/ticket.py
</read_first>
<action>
1. Create `backend/app/services/drafting.py`.
2. Implement `DraftingService` that takes a `Ticket` object.
3. Inside, use `knowledge_service.get_query_engine()` to search for relevant info.
4. Craft a prompt that combines ticket context + retrieved context.
5. Return the generated draft string.
</action>
<acceptance_criteria>
- `DraftingService.generate_draft(ticket)` returns a professional reply based on indexed docs.
- The service handles cases where no relevant docs are found (generic helpful response).
</acceptance_criteria>
</task>

## Verification
- Run a CLI script to generate a draft for a sample ticket and print it.
