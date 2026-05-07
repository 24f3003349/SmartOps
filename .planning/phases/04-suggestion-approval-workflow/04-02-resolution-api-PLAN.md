---
wave: 1
depends_on: []
files_modified: [
  "backend/app/api/v1/endpoints/tickets.py"
]
requirements_addressed: [REQ-08, REQ-09]
autonomous: true
---

# Plan 04-02: Resolution API

## Objective
Implement endpoints to generate drafts and resolve tickets.

## Tasks

<task>
<read_first>
- backend/app/api/v1/endpoints/tickets.py
</read_first>
<action>
1. Add `POST /tickets/{id}/draft` to trigger the `DraftingService` and return the draft.
2. Add `POST /tickets/{id}/resolve` that accepts `resolution_text`.
3. Update ticket: `status = "resolved"`, save `resolution_text` to `metadata_info`.
4. (Optional) Log the simulated email dispatch.
</action>
<acceptance_criteria>
- `/draft` returns a draft string.
- `/resolve` updates the DB and returns the resolved ticket.
</acceptance_criteria>
</task>

## Verification
- Test endpoints with `Invoke-RestMethod`.
