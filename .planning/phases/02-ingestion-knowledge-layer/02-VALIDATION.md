# Phase 2 Validation Strategy: Ingestion & Knowledge Layer

## Goal
Verify that tickets can be ingested and company knowledge can be uploaded and indexed for retrieval.

## Validation Requirements

### Dimension 1: Functional Correctness
- [ ] `POST /api/v1/tickets` creates a new ticket in the database.
- [ ] Ticket Inbox UI displays the created ticket with correct metadata.
- [ ] `POST /api/v1/knowledge/upload` accepts a PDF/Text file and saves it locally.
- [ ] Uploaded documents are processed by LlamaIndex and searchable via a test query.

### Dimension 2: Observability
- [ ] OTel traces show the full path of a ticket ingestion request.
- [ ] OTel traces capture the embedding generation process in LlamaIndex.

### Dimension 3: UI/UX (shadcn)
- [ ] Ticket Inbox uses the shadcn DataTable with sortable headers.
- [ ] Document Upload UI shows a success toast upon completion.

## Verification Plan

### Automated Tests
- `pytest backend/tests/test_ingestion.py`: Test API endpoints for tickets and uploads.
- `npm test frontend/tests/inbox.test.tsx`: Verify the DataTable renders correctly.

### Manual Verification
- Upload an SOP PDF via the UI and verify it appears in the list.
- Submit a ticket via Postman/Curl and verify it appears in the Inbox.
