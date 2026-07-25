import asyncio
import json
from typing import Set, Dict, Any

class EventBroadcaster:
    """Manages active SSE listener client queues and broadcasts real-time events in a thread-safe manner."""
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
            except (asyncio.QueueFull, Exception):
                dead_queues.add(queue)
                
        for q in dead_queues:
            self.unsubscribe(q)

    def publish_sync(self, event_name: str, payload: Dict[str, Any]):
        """Thread-safe synchronous publish helper for background tasks."""
        try:
            loop = asyncio.get_running_loop()
            if loop.is_running():
                loop.create_task(self.publish(event_name, payload))
                return
        except RuntimeError:
            pass

        try:
            asyncio.run(self.publish(event_name, payload))
        except Exception:
            pass

event_broadcaster = EventBroadcaster()
