# Phase 4 UAT: Suggestion & Approval Workflow

**Tester:** Antigravity
**Date:** 2026-05-07
**Environment:** Local Dev (Ollama + nomic-embed-text)

## Test Cases

### 1. Knowledge-Aware Drafting
expected: Submit a ticket that overlaps with uploaded SOPs (e.g., "Password Reset"). Click "Generate AI Draft". Verify the draft contains specific instructions from the SOP.
result: [pending]

### 2. Manual Response Editing
expected: Edit the generated draft in the textarea. Click "Send & Resolve". Verify that the EDITED text is saved to the database, not the original draft.
result: [pending]

### 3. State Transition (Active -> Resolved)
expected: After resolving a ticket, verify it no longer appears in the "Active Workstream" list in the UI.
result: [pending]

### 4. Search & Filter Stability
expected: Use the search bar to filter tickets by email or title. Verify the list updates instantly and correctly.
result: [pending]

## Summary

total: 4
passed: 0
issues: 0
pending: 4
skipped: 0
