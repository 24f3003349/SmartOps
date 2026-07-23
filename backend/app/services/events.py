import asyncio
import json
from typing import Set, Dict, Any

class EventBroadcaster:
    """Manages active SSE listener client queues and broadcasts real-time events."""
    def __init__(self):
        self.listeners: Set[asyncio.Queue] = set()

    async def subscribe(self) -> asyncio.Queue:
        queue = asyncio.Queue()
        self.listeners.add(queue)
        return queue

    def unsubscribe(self, queue: asyncio.Queue):
        self.listeners.discard(queue)

    async def publish(self, event_name: str, payload: Dict[str, Any]):
        message = json.dumps({"event": event_name, "data": payload})
        formatted = f"event: {event_name}\ndata: {message}\n\n"
        
        dead_queues = set()
        for queue in self.listeners:
            try:
                queue.put_nowait(formatted)
            except asyncio.QueueFull:
                dead_queues.add(queue)
                
        for q in dead_queues:
            self.unsubscribe(q)

event_broadcaster = EventBroadcaster()
