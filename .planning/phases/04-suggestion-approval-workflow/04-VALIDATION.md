# Phase 4 Validation Strategy: Suggestion & Approval Workflow

## Goal
Verify that agents can generate, edit, and send AI-suggested responses to resolve tickets.

## Validation Requirements

### Dimension 1: RAG Accuracy
- [ ] AI generates a draft that includes specific information from uploaded Knowledge Base documents (SOPs/FAQs).
- [ ] The draft is professional and directly addresses the ticket's issue.

### Dimension 2: Approval Workflow
- [ ] The UI allows opening a ticket to see full details.
- [ ] The agent can click "Generate Draft" (or it auto-loads).
- [ ] The agent can edit the text before clicking "Resolve".
- [ ] Clicking "Resolve" updates the ticket status to `resolved` and saves the final response.

### Dimension 3: UX & Feedback
- [ ] Loading states are shown while AI is drafting.
- [ ] Success toasts appear upon resolution.

## Verification Plan

### Automated Tests
- `backend/tests/test_drafting.py`: Verify that the drafting service retrieves context and returns a string.

### Manual Verification
- Upload an SOP about "Password Reset".
- Create a ticket about "Forgot password".
- Open the ticket in the Dashboard, generate a draft, and verify it mentions the SOP steps.
- Resolve the ticket and check if it disappears from the "Active" list (or changes status).
