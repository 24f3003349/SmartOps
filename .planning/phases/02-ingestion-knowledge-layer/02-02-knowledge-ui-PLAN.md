---
wave: 2
depends_on: [02-01-ingestion-PLAN.md]
files_modified: [
  "frontend/src/app/dashboard/tickets/page.tsx",
  "frontend/src/app/dashboard/knowledge/page.tsx",
  "frontend/src/components/tickets/data-table.tsx",
  "frontend/src/components/knowledge/upload-form.tsx"
]
requirements_addressed: [REQ-01, REQ-07, REQ-08]
autonomous: true
---

# Plan 02-02: Ticket Inbox & Knowledge UI

## Objective
Build the user interface for managing tickets and uploading knowledge base documents.

## Tasks

<task>
<read_first>
- frontend/src/app/layout.tsx
- frontend/package.json
</read_first>
<action>
1. Install `lucide-react` and `date-fns` for UI icons and formatting.
2. Create a "Dashboard" layout with a sidebar (Tickets, Knowledge, Settings).
3. Implement the `Tickets` page using shadcn `DataTable`.
4. Implement the `Knowledge` page with a file upload form and a list of uploaded documents.
5. Connect UI to the backend API using Next.js Server Actions or `fetch`.
</action>
<acceptance_criteria>
- Navigation between Dashboard/Tickets and Dashboard/Knowledge works.
- Tickets table renders and shows "No results" when empty.
- Upload form shows file selection and "Upload" button.
</acceptance_criteria>
</task>

## Verification
- Run `npm run dev` and navigate to `/dashboard/tickets`.
- Verify the layout is responsive and styled with shadcn.
