---
wave: 2
depends_on: [03-01-triage-service-PLAN.md]
files_modified: [
  "backend/app/api/v1/endpoints/tickets.py",
  "backend/app/main.py"
]
requirements_addressed: [REQ-04, REQ-06]
autonomous: true
---

# Plan 03-02: Background Triage Integration

## Objective
Connect the Triage Service to the Ticket Ingestion endpoint using FastAPI BackgroundTasks.

## Tasks

<task>
<read_first>
- backend/app/api/v1/endpoints/tickets.py
</read_first>
<action>
1. Update `create_ticket` in `tickets.py` to accept `BackgroundTasks`.
2. Define a background function `process_ticket_triage(ticket_id, session)`.
3. Inside the task: fetch ticket, run `TriageService.classify_ticket`, update ticket fields (`category`, `priority`, `assigned_to`, `ai_confidence`, `ai_suggestion`).
4. Save the updated ticket back to the DB.
</action>
<acceptance_criteria>
- Creating a ticket via API returns 201 immediately.
- A few seconds later, the ticket in the database is updated with AI metadata.
</acceptance_criteria>
</task>

## Verification
- Use `Invoke-RestMethod` to create a ticket and then `GET` it after 10 seconds to check for AI fields.
