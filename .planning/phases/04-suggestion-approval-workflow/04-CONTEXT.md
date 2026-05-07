# Phase 4: Suggestion & Approval Workflow - Context

**Gathered:** 2026-05-06
**Status:** Ready for planning
**Source:** PRD (docs/PRD.md)

<domain>
## Phase Boundary
This phase transitions from "Categorization" to "Action". It implements:
- **RAG Drafting Service:** Generating a response draft based on the Knowledge Base (Phase 2) and Ticket context (Phase 3).
- **Approval UI:** A detailed view for each ticket where an agent can see the AI's logic, edit the draft, and "Send" it.
- **State Transition:** Tickets moving from `triaged` to `resolved`.

</domain>

<decisions>
## Implementation Decisions

### AI Drafting
- **Integration:** Combine `KnowledgeService` (Phase 2) and `TriageService` (Phase 3).
- **Process:** Search vector store for relevant snippets -> Feed to LLM with the ticket content -> Produce a professional draft.
- **Trigger:** Add a "Generate Draft" button in the UI or auto-generate on triage.

### UI / UX
- **Ticket Detail View:** A slide-over (Sheet) or a dedicated page for ticket processing.
- **Rich Text Editor:** (Optional) but a clean `<textarea>` with "Apply AI Draft" is the priority.
- **Badges:** Show "Draft Ready" indicator in the main inbox.

### Connectivity
- **Dispatch:** For now, a simulated "Send" (POST to `/tickets/{id}/resolve`) that logs the action.

</decisions>

<canonical_refs>
## Canonical References
- `backend/app/services/knowledge.py` — Vector search logic.
- `backend/app/services/triage.py` — AI service pattern.
- `frontend/src/app/dashboard/tickets/page.tsx` — Inbox UI.
</canonical_refs>

---
*Phase: 04-suggestion-approval-workflow*
*Context gathered: 2026-05-06*
