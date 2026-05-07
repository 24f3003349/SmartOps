# Phase 5 Research: Analytics & Deployment

## 1. Analytics Aggregation (FastAPI + SQLModel)
To provide dashboard stats, we need a new router `analytics.py`:
- `Total Tickets`: `select count(Ticket.id)`
- `Resolved Tickets`: `select count(Ticket.id) where status == 'resolved'`
- `Avg Confidence`: `select avg(Ticket.ai_confidence)`
- `Category Mix`: Group by `category`.

## 2. Visualizing Data (Frontend)
- shadcn dashboards typically use `recharts`.
- We can implement a simple "Bar Chart" for Category Distribution and "Metric Cards" for the top-level numbers.
- Location: The root `/dashboard` page (currently just placeholders).

## 3. Production Deployment (Docker)
- **Backend:** Python 3.12-slim, install `uv`, `uv sync`, expose 8000.
- **Frontend:** Node.js 20-alpine, `npm install`, `npm run build`, `npm start` on 3000.
- **Compose:** Map ports, set `NEXT_PUBLIC_API_BASE`.

---
*Phase: 05-analytics-deployment*
*Research completed: 2026-05-07*
