# Phase 3 Validation Strategy: AI Classification & Routing

## Goal
Verify that incoming tickets are automatically categorized, prioritized, and routed to the correct agent with a confidence score.

## Validation Requirements

### Dimension 1: AI Accuracy & Structure
- [ ] AI correctly extracts category and priority from a sample "Technical issue" ticket.
- [ ] The output is a structured JSON object stored in `metadata_info`.
- [ ] A confidence score between 0 and 1 is present.

### Dimension 2: Routing & Background Processing
- [ ] Tickets are updated asynchronously (original request returns quickly).
- [ ] The `assigned_to` field is populated based on the predicted category.
- [ ] Tickets with low confidence (< 0.6) are flagged with a specific status or metadata flag for human review.

### Dimension 3: UI Visibility
- [ ] Ticket Inbox shows the AI-predicted category and confidence score.
- [ ] Priority is visually distinct (e.g., color-coded based on AI prediction).

## Verification Plan

### Automated Tests
- `pytest backend/tests/test_triage.py`: Mock LLM response and verify DB update logic.
- `python backend/scripts/test_classification.py`: Run a real LLM classification on a test string.

### Manual Verification
- Post a "Billing" ticket and verify it gets assigned to the Billing user (or a placeholder ID).
- Observe the "AI Confidence" column in the Inbox.
