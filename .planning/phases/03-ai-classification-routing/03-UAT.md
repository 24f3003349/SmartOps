# Phase 3 UAT: AI Classification & Routing

**Tester:** Antigravity (Strict Mode)
**Date:** 2026-05-05
**Environment:** Local Dev (Ollama)

## Test Cases

### 1. Async Triage Trigger
expected: Submit a ticket via REST API. Verify the response is immediate (no LLM delay) and the ticket is initially saved with default fields.
result: [pending]

### 2. AI Classification Accuracy
expected: Check the ticket from Test 1 after 15 seconds. Verify `category`, `priority`, and `ai_confidence` are populated with non-null values.
result: [pending]

### 3. Auto-Routing Logic
expected: Verify `assigned_to` is set to `1` (or the configured ID) based on the `DEFAULT_ROUTING` map in `config.py`.
result: [pending]

### 4. Low Confidence Handling
expected: Submit a vague ticket (e.g. "something is broken"). Verify `ai_confidence` is low and the `status` is set to `waiting` (Human-in-the-loop flag).
result: [pending]

### 5. UI Triage Columns
expected: Navigate to `/dashboard/tickets`. Verify the "Category" and "AI Conf." columns show real data (Badges and percentages).
result: [pending]

## Summary

total: 5
passed: 0
issues: 0
pending: 5
skipped: 0
