"use client";

import { useEffect } from "react";

export function useTicketEvents(onEvent: (eventType: string, data: any) => void) {
  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const eventSource = new EventSource(`${backendUrl}/api/v1/events/stream`);

    eventSource.addEventListener("triage_completed", (e: MessageEvent) => {
      try {
        const payload = JSON.parse(e.data);
        onEvent("triage_completed", payload);
      } catch (err) {
        console.error("Failed to parse triage_completed event", err);
      }
    });

    eventSource.addEventListener("ticket_created", (e: MessageEvent) => {
      try {
        const payload = JSON.parse(e.data);
        onEvent("ticket_created", payload);
      } catch (err) {
        console.error("Failed to parse ticket_created event", err);
      }
    });

    return () => {
      eventSource.close();
    };
  }, [onEvent]);
}
