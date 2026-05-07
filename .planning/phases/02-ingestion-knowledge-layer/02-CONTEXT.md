# Phase 2: Ingestion & Knowledge Layer - Context

**Gathered:** 2026-05-05
**Status:** Ready for planning
**Source:** PRD Express Path (docs/PRD.md)

<domain>
## Phase Boundary
This phase focuses on the intake of operational data and the establishment of the knowledge base. It delivers:
- The **Ticket Inbox UI** for viewing incoming requests.
- **Ingestion Endpoints** for ticket creation.
- **Document Management UI** for uploading company SOPs and FAQs.
- **LlamaIndex Integration** for processing knowledge base documents into a vector store.

</domain>

<decisions>
## Implementation Decisions

### Ingestion & UI
- **Unified Inbox:** Create a shadcn-based data table for tickets (REQ-01).
- **Manual/Webhook Ingestion:** Backend endpoints to receive ticket data (schema validation via Pydantic).

### Knowledge Layer
- **File Upload:** UI component for PDF/Text uploads (REQ-07).
- **Vector Storage:** Use SQLite (local) or PostgreSQL (if pgvector is ready) for storing embeddings.
- **LLM Provider:** Support Ollama (local) and OpenAI (deployment) as configured in Phase 1.
- **LlamaIndex:** Use `SimpleDirectoryReader` and `VectorStoreIndex` for initial RAG setup.

### the agent's Discretion
- **Folder Structure:** Store uploaded documents in a `data/knowledge` directory for now (MinIO integration deferred).
- **Triage UI:** Use a simple card-based or table-based layout for the inbox.

</decisions>

<canonical_refs>
## Canonical References
- `backend/app/models/ticket.py` — Ticket schema.
- `backend/app/core/llm.py` — LLM configuration.
- `docs/PRD.md` — Product requirements.
</canonical_refs>

<specifics>
## Specific Ideas
- Use **shadcn/ui** "Data Table" for the inbox.
- Use **shadcn/ui** "File Input" or a custom dropzone for uploads.
</specifics>

<deferred>
## Deferred Ideas
- AI Classification & Urgency prediction (Phase 3).
- Human-approval workflow details (Phase 4).
- MinIO integration (Phase 5 or late Phase 2 if time permits).
</deferred>

---

*Phase: 02-ingestion-knowledge-layer*
*Context gathered: 2026-05-05 via PRD Express Path*
