---
wave: 2
depends_on: [05-01-analytics-backend-PLAN.md, 05-02-analytics-dashboard-PLAN.md]
files_modified: [
  "Dockerfile",
  "docker-compose.yml",
  "README.md",
  "ROADMAP.md"
]
requirements_addressed: [REQ-11, REQ-12]
autonomous: true
---

# Plan 05-03: Deployment & Project Wrap-up

## Objective
Finalize the project for production and mark the milestone as complete.

## Tasks

<task>
<action>
1. Create `backend/Dockerfile` (uv-based).
2. Create `frontend/Dockerfile` (next-build-based).
3. Create root `docker-compose.yml`.
4. Delete temporary test scripts (`test_triage_cli.py`, `test_drafting_cli.py`).
5. Final Update to `README.md` with Docker instructions.
6. Update `ROADMAP.md` status to Completed for v1.0.
</action>
<acceptance_criteria>
- `docker-compose build` succeeds.
- Repo is clean and fully documented.
</acceptance_criteria>
</task>

## Verification
- Run `docker-compose up -d` and verify site is reachable.
