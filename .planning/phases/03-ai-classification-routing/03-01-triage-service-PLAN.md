---
wave: 1
depends_on: []
files_modified: [
  "backend/app/services/triage.py",
  "backend/app/core/config.py"
]
requirements_addressed: [REQ-04, REQ-05]
autonomous: true
---

# Plan 03-01: AI Triage Service

## Objective
Implement the logic to classify tickets using LlamaIndex and Pydantic structured output.

## Tasks

<task>
<read_first>
- backend/app/models/ticket.py
- backend/app/services/knowledge.py
</read_first>
<action>
1. Define a `TriageResult` Pydantic model in `backend/app/services/triage.py`.
2. Implement `TriageService` with a `classify_ticket(title, description)` method.
3. Use `llama_index.core.program.LLMTextCompletionProgram` or similar to get structured output.
4. Add `DEFAULT_ROUTING` config in `backend/app/core/config.py` (mapping category names to user IDs).
</action>
<acceptance_criteria>
- `TriageService.classify_ticket` returns a `TriageResult` object with category, priority, and confidence.
- The service can handle empty or short descriptions gracefully.
</acceptance_criteria>
</task>

## Verification
- Run a standalone script to classify a hardcoded ticket string and print the result.
