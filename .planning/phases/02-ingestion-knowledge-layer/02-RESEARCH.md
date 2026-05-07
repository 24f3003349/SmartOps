# Phase 2 Research: Ingestion & Knowledge Layer

## 1. LlamaIndex Vector Storage
For local development and MVP, LlamaIndex's `SimpleVectorStore` is sufficient and stores data in a JSON file. However, for "production-grade" (as requested by USER), **PGVector** (PostgreSQL) is the target.
- **SQLite Fallback:** We can use `ChromaDB` with a local SQLite file as an intermediary if PostgreSQL is not immediately available.
- **LlamaIndex + SQLModel:** We need to ensure embeddings are linked to document metadata in the DB.

## 2. Ingestion Module (FastAPI)
- **Ticket Ingestion:** `POST /api/v1/tickets` using Pydantic models.
- **Document Upload:** `POST /api/v1/knowledge/upload` using `fastapi.UploadFile`.
- **Async Processing:** Background tasks can be used for embedding generation to avoid blocking the API response.

## 3. Knowledge Layer UI (Next.js)
- **File Upload:** Use `react-dropzone` or a simple `<input type="file">` styled with shadcn.
- **Server Actions:** Handle file uploads to the backend. Note: Next.js 15 Server Actions handle `FormData` well.
- **Data Table:** shadcn/ui provides a robust `DataTable` component built on TanStack Table. This is perfect for the Ticket Inbox.

## 4. Validation Architecture
- **Ticket Creation Test:** Verify `POST /api/v1/tickets` persists data to SQLite.
- **Upload Verification:** Verify file exists in `data/knowledge` and a corresponding entry is in the vector index.
- **RAG Smoke Test:** A simple query to LlamaIndex to retrieve content from a newly uploaded document.

## 5. Implementation Strategy
- **Wave 1:** Backend Ticket & Knowledge endpoints + DB migrations.
- **Wave 2:** Frontend Ticket Inbox & Upload UI.
- **Wave 3:** LlamaIndex integration & Vector index setup.

---
*Phase: 02-ingestion-knowledge-layer*
*Research completed: 2026-05-05*
