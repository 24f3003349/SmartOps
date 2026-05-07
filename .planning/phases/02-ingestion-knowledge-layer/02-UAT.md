---
status: testing
phase: 02-ingestion-knowledge-layer
source: [
  .planning/phases/02-ingestion-knowledge-layer/02-01-ingestion-SUMMARY.md,
  .planning/phases/02-ingestion-knowledge-layer/02-02-knowledge-ui-SUMMARY.md,
  .planning/phases/02-ingestion-knowledge-layer/02-03-llamaindex-SUMMARY.md
]
started: 2026-05-05T12:13:00Z
updated: 2026-05-05T12:13:00Z
---

## Current Test

number: 1
name: Cold Start Smoke Test
expected: |
  Start the backend (`uv run python -m uvicorn app.main:app --port 8000`) and frontend (`npm run dev -- --port 3000`). Verify both boot without errors and frontend can communicate with backend.
awaiting: user response

## Tests

### 1. Cold Start Smoke Test
expected: Start the backend and frontend. Verify both boot without errors and frontend can communicate with backend.
result: [passed]

### 2. Access Ticket Inbox
expected: Navigate to `http://localhost:3000/dashboard/tickets`. The shadcn-styled Tickets page renders with a sidebar and an empty results message.
result: [passed]

### 3. Submit Test Ticket (API to UI)
expected: Use `curl -X POST http://localhost:8000/api/v1/tickets/ -H "Content-Type: application/json" -d '{"title": "Test Issue", "description": "UAT Test", "status": "new", "urgency": "high"}'`. Refresh the Tickets page; the ticket should appear in the table.
result: [passed]

### 4. Knowledge Base Upload
expected: Navigate to `http://localhost:3000/dashboard/knowledge`. Drag and drop or select a text file. Click "Upload". A success toast appears, and the file name appears in the "Managed Documents" list.
result: [passed]

### 5. LlamaIndex Indexing
expected: Verify that after the upload in Test 4, the `backend/storage` directory exists and contains index metadata files, and the `backend/data/knowledge` folder contains the uploaded file.
result: [passed]

## Summary

total: 5
passed: 5
issues: 0
pending: 0
skipped: 0

## Gaps

[none yet]
