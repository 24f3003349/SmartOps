---
wave: 3
depends_on: [02-01-ingestion-PLAN.md]
files_modified: [
  "backend/app/core/llm.py",
  "backend/app/services/knowledge.py",
  "backend/app/api/v1/endpoints/knowledge.py"
]
requirements_addressed: [REQ-08]
autonomous: true
---

# Plan 02-03: LlamaIndex Knowledge Ingestion

## Objective
Integrate LlamaIndex to process uploaded documents and create a searchable vector index.

## Tasks

<task>
<read_first>
- backend/app/core/llm.py
- backend/app/api/v1/endpoints/knowledge.py
</read_first>
<action>
1. Implement `backend/app/services/knowledge.py` to handle document ingestion.
2. Use LlamaIndex `SimpleDirectoryReader` to load files from `data/knowledge`.
3. Create a `VectorStoreIndex` from the documents.
4. Save the index to disk (or vector DB) for persistence.
5. Update `POST /upload` to trigger index update after file save.
</action>
<acceptance_criteria>
- Backend logs show LlamaIndex initializing and processing documents.
- A search utility or endpoint (deferred to Phase 4 for full RAG) can retrieve text from the index.
</acceptance_criteria>
</task>

## Verification
- Upload a file and check the `storage` directory for LlamaIndex artifacts.
