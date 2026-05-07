---
wave: 1
depends_on: []
files_modified: [
  "backend/app/api/v1/endpoints/tickets.py",
  "backend/app/api/v1/endpoints/knowledge.py",
  "backend/app/api/v1/api.py",
  "backend/app/models/ticket.py",
  "backend/app/core/db.py"
]
requirements_addressed: [REQ-01, REQ-07]
autonomous: true
---

# Plan 02-01: Ingestion API & Data Layer

## Objective
Establish the backend infrastructure for receiving tickets and uploading knowledge base documents.

## Tasks

<task>
<read_first>
- backend/app/models/ticket.py
- backend/app/main.py
</read_first>
<action>
1. Create `backend/app/api/v1/endpoints/tickets.py` with `GET /` (list) and `POST /` (create) endpoints.
2. Create `backend/app/api/v1/endpoints/knowledge.py` with `POST /upload` endpoint using `fastapi.UploadFile`.
3. Register these routers in `backend/app/api/v1/api.py`.
4. Update `init_db` to ensure `Ticket` table is created.
</action>
<acceptance_criteria>
- `GET /api/v1/tickets` returns a list (can be empty).
- `POST /api/v1/tickets` with valid JSON creates a record and returns 201.
- `POST /api/v1/knowledge/upload` accepts a file and returns 200.
</acceptance_criteria>
</task>

## Verification
- Run `uv run pytest` (after creating a basic test).
- Use `curl` to post a test ticket.
