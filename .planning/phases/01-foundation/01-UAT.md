---
status: testing
phase: 01-foundation
source: [.planning/phases/01-foundation/01-SUMMARY.md]
started: 2026-05-05T11:34:00Z
updated: 2026-05-05T11:34:00Z
---

## Current Test

number: 1
name: Cold Start Smoke Test
expected: |
  Kill any running server/service. Start the application from scratch (backend: `uv run uvicorn app.main:app`, frontend: `npm run dev`). Server boots without errors, and the primary API call returns live data.
awaiting: user response

## Tests

### 1. Cold Start Smoke Test
expected: Kill any running server/service. Start the application from scratch (backend: `uv run uvicorn app.main:app`, frontend: `npm run dev`). Server boots without errors, and the primary API call returns live data.
result: [pending]

### 2. Access Login Page
expected: Navigate to `http://localhost:3000/login`. The shadcn-styled login page renders with Email and Password fields and a "Sign In" button.
result: [pending]

### 3. Login Workflow
expected: Enter `admin@smartops.ai` and `admin`. Clicking "Sign In" redirects to the home page (success).
result: [pending]

### 4. API Health Check
expected: Access `http://localhost:8000/`. Returns `{"message": "Welcome to SmartOps AI API"}`.
result: [pending]

### 5. Database Initialization
expected: Verify that `backend/sql_app.db` is created upon startup and contains the User and Ticket tables.
result: [pending]

### 6. OpenTelemetry Tracing
expected: Making a request to the backend API prints a ConsoleSpan (JSON trace data) to the backend terminal.
result: [pending]

## Summary

total: 6
passed: 0
issues: 0
pending: 6
skipped: 0

## Gaps

[none yet]
