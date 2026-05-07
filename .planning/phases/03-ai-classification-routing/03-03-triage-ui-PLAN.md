---
wave: 3
depends_on: [03-02-background-tasks-PLAN.md]
files_modified: [
  "frontend/src/app/dashboard/tickets/page.tsx"
]
requirements_addressed: [REQ-01, REQ-04]
autonomous: true
---

# Plan 03-03: Triage Visibility UI

## Objective
Update the Ticket Inbox to display AI-driven triage data.

## Tasks

<task>
<read_first>
- frontend/src/app/dashboard/tickets/page.tsx
</read_first>
<action>
1. Add "Category" and "AI Confidence" columns to the Tickets table.
2. Implement a color-coded Badge for Priority (Red for Urgent/High, Yellow for Medium, Green for Low).
3. Display Confidence as a percentage (e.g., 85%).
4. Add a "Review Needed" flag/icon if confidence is below a certain threshold.
</action>
<acceptance_criteria>
- The Tickets table shows the new columns.
- Priority badges are colored correctly.
- Confidence is formatted as a percentage.
</acceptance_criteria>
</task>

## Verification
- Navigate to the Inbox and verify the new columns and badges are visible and styled correctly.
