import pytest
import asyncio

from app.services.events import event_broadcaster

@pytest.mark.asyncio
async def test_event_broadcaster_subscribe_and_publish():
    queue = await event_broadcaster.subscribe()
    assert queue in event_broadcaster.listeners
    
    test_data = {"event": "ticket_created", "ticket_id": 99}
    await event_broadcaster.publish("ticket_created", test_data)
    
    # Wait for message in queue
    data = await asyncio.wait_for(queue.get(), timeout=2.0)
    assert "ticket_created" in data
    assert "99" in data
    
    event_broadcaster.unsubscribe(queue)
    assert queue not in event_broadcaster.listeners
