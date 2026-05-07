---
wave: 1
depends_on: []
files_modified: [
  "backend/app/api/v1/endpoints/analytics.py",
  "backend/app/api/v1/api.py"
]
requirements_addressed: [REQ-10]
autonomous: true
---

# Plan 05-01: Analytics Backend

## Objective
Implement an aggregation API to provide dashboard statistics.

## Tasks

<task>
<read_first>
- backend/app/models/ticket.py
- backend/app/api/v1/endpoints/tickets.py
</read_first>
<action>
1. Create `backend/app/api/v1/endpoints/analytics.py`.
2. Implement `GET /overview` that returns:
   - `total_tickets`
   - `resolved_tickets`
   - `avg_confidence` (excluding nulls)
   - `category_distribution` (dict of category -> count)
3. Register the router in `backend/app/api/v1/api.py`.
</action>
<acceptance_criteria>
- `/api/v1/analytics/overview` returns correct JSON based on DB state.
</acceptance_criteria>
</task>

## Verification
- Resolve a ticket via API and verify the `/analytics/overview` response updates.
