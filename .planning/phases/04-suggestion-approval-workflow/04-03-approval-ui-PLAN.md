---
wave: 2
depends_on: [04-01-drafting-service-PLAN.md, 04-02-resolution-api-PLAN.md]
files_modified: [
  "frontend/src/app/dashboard/tickets/page.tsx",
  "frontend/src/components/tickets/ticket-detail-sheet.tsx"
]
requirements_addressed: [REQ-01, REQ-08]
autonomous: true
---

# Plan 04-03: Approval & Resolution UI

## Objective
Build the interactive interface for agents to review, edit, and resolve tickets.

## Tasks

<task>
<read_first>
- frontend/src/app/dashboard/tickets/page.tsx
</read_first>
<action>
1. Create `frontend/src/components/tickets/ticket-detail-sheet.tsx` using shadcn `Sheet`.
2. Display ticket title, description, and AI metadata in the sheet.
3. Add a "Generate Draft" button and a `Textarea` for the response.
4. Add a "Send & Resolve" button.
5. Integrate the sheet into the `TicketsPage` (opens when a row is clicked).
</action>
<acceptance_criteria>
- Clicking a ticket row opens the detail sheet.
- Draft is generated and loaded into the textarea.
- Clicking "Resolve" updates the inbox and shows a success toast.
</acceptance_criteria>
</task>

## Verification
- Manual walkthrough in the browser: Create ticket -> Open Detail -> Generate Draft -> Edit -> Resolve.
