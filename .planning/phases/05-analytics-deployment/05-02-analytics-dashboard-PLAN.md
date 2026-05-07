---
wave: 1
depends_on: []
files_modified: [
  "frontend/src/app/dashboard/page.tsx"
]
requirements_addressed: [REQ-10]
autonomous: true
---

# Plan 05-02: Analytics Dashboard

## Objective
Update the dashboard home page to show live metrics and charts.

## Tasks

<task>
<read_first>
- frontend/src/app/dashboard/page.tsx
</read_first>
<action>
1. Install `recharts` if not present.
2. Update `DashboardOverview` to fetch data from `/api/v1/analytics/overview`.
3. Implement 4 Stat Cards:
   - Total Volume.
   - Resolution Rate (%).
   - AI Accuracy (Avg Confidence).
   - Pending Triage.
4. Add a Bar Chart or Pie Chart for "Ticket Categories".
</action>
<acceptance_criteria>
- Dashboard shows real data, not placeholders.
- Charts update on page refresh.
</acceptance_criteria>
</task>

## Verification
- Manual verification in browser: verify numbers match the Tickets table state.
