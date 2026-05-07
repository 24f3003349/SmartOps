# Phase 4 Research: Suggestion & Approval Workflow

## 1. RAG-based Drafting (LlamaIndex)
To generate a high-quality draft, we need to:
- **Retrieve:** Search the vector index for chunks related to the ticket `title` + `description`.
- **Synthesize:** Use a `QueryEngine` with a custom `SummaryPrompt`.
  - *Draft Prompt:* "Based on the provided documentation, draft a professional and helpful response to this customer ticket. Ticket: {ticket_content}. Docs: {context_str}."
- **Output:** The drafted text is stored in `ai_suggestion`.

## 2. Interactive Approval UI (Next.js)
- **Component:** Use shadcn `Sheet` or a multi-pane layout.
- **State Management:** When "Generate Draft" is clicked, trigger a backend task and poll for completion or use a loading state.
- **Edit/Accept Flow:**
  1. Load ticket details.
  2. Display "AI Suggested Reply".
  3. Allow user to edit in a text area.
  4. "Resolve" button marks status as `resolved` and saves the final text.

## 3. simulated Dispatch
- Create a `POST /tickets/{id}/resolve` endpoint.
- It should record the `resolved_by` user and the final `resolution_text`.
- For now, it just prints "Sending email to {contact_email}..." in the logs.

---
*Phase: 04-suggestion-approval-workflow*
*Research completed: 2026-05-06*
