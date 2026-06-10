import asyncio
import logging
from collections import defaultdict
from typing import Dict, Set

logger = logging.getLogger(__name__)

class ChatPubSub:
    """
    An in-memory Pub/Sub broker to handle real-time message notification events
    across separate FastAPI request contexts (webhooks vs SSE streams) without polling.
    """
    def __init__(self):
        # Maps business_id (string) to a set of active asyncio.Queues
        self._listeners: Dict[str, Set[asyncio.Queue]] = defaultdict(set)

    def subscribe(self, business_id: str) -> asyncio.Queue:
        """Register a new connection queue for a business workspace."""
        queue = asyncio.Queue()
        self._listeners[business_id].add(queue)
        logger.info(f"[PUBSUB] Subscribed listener to business: {business_id}. Active listeners for this biz: {len(self._listeners[business_id])}")
        return queue

    def unsubscribe(self, business_id: str, queue: asyncio.Queue):
        """Remove a connection queue when the client disconnects."""
        if business_id in self._listeners:
            self._listeners[business_id].discard(queue)
            if not self._listeners[business_id]:
                del self._listeners[business_id]
            logger.info(f"[PUBSUB] Unsubscribed listener from business: {business_id}. Remaining listeners: {len(self._listeners.get(business_id, set()))}")

    def publish(self, business_id: str, message: str = "refresh"):
        """Distribute a notification message to all active listening queues of a business."""
        listeners = self._listeners.get(business_id, set())
        if not listeners:
            return
            
        logger.info(f"[PUBSUB] Publishing '{message}' to {len(listeners)} listeners for business: {business_id}")
        for queue in list(listeners):
            try:
                queue.put_nowait(message)
            except Exception as e:
                logger.error(f"[PUBSUB] Error putting message into queue: {e}")

# Global singleton instance
chat_pubsub = ChatPubSub()
