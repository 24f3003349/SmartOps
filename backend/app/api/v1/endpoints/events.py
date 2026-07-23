from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import asyncio
from ....services.events import event_broadcaster

router = APIRouter()

@router.get("/stream")
async def stream_events():
    """Stream real-time SSE ticket updates and triage events."""
    queue = await event_broadcaster.subscribe()

    async def event_generator():
        try:
            # Initial heartbeat
            yield "event: connected\ndata: {\"status\": \"connected\"}\n\n"
            while True:
                data = await queue.get()
                yield data
        except asyncio.CancelledError:
            event_broadcaster.unsubscribe(queue)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
