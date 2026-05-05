# SmartOps AI

SmartOps AI is a powerful, agentic AI platform designed to automate ticket triage, knowledge management, and customer operations.

## Features

### Phase 1: Foundation & Observability (Completed)
- **FastAPI Backend:** SQLModel-powered REST API.
- **Next.js Frontend:** shadcn/ui dashboard with modern aesthetics.
- **Observability:** OpenTelemetry (OTel) instrumentation for tracing and monitoring.

### Phase 2: Ingestion & Knowledge Layer (Completed)
- **Ticket Ingestion:** CRUD endpoints for support tickets.
- **Knowledge Base:** LlamaIndex-powered document ingestion (PDF, TXT) with persistent vector indexing.
- **UI Inbox:** Dynamic dashboard for managing incoming tickets and company knowledge.

### Phase 3: AI Classification & Routing (Completed)
- **AI Triage:** Automatic category and priority prediction using LlamaIndex.
- **Background Tasks:** Async classification via FastAPI to ensure zero ingestion delay.
- **Routing:** Auto-assignment based on predicted category.

## 🛠️ Technical Challenges & Solutions
- **LLM Output Formatting:** Local models like `llama3.2:1b` often add conversational noise. We hardened the system prompt to force strict JSON and added a fallback triage mode to ensure the pipeline never breaks.
- **DB Foreign Keys:** Resolved `NoReferencedTableError` by centralizing model imports in the database initialization lifecycle.
- **Sidebar Integration:** Fixed React hydration warnings by correctly implementing the Next.js `Link` component within the shadcn sidebar.

## Setup & Running

### Backend
1. `cd backend`
2. `uv sync`
3. `uv run python -m uvicorn app.main:app --port 8000 --reload`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Roadmap
- [x] Phase 1-3: Core Triage & Knowledge
- [ ] Phase 4: Suggestion & Approval Workflow (Next)
- [ ] Phase 5: Analytics & Deployment
