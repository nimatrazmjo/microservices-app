import json
import logging
import asyncio
from aio_pika import IncomingMessage
from app.db.mongodb import get_db
from app.core.rabbitmq import rabbitmq

logger = logging.getLogger(__name__)

async def handle_user_created(message: IncomingMessage):
    try:
        async with message.process():
            body = json.loads(message.body.decode())
            logger.info(f"Received message: {body}")

            # Extract data from message body
            event_type = body.get("eventType")
            user_id = body.get("userId")
            user_data = body.get("data", {})

            if not all([event_type, user_id]):
                logger.error("Missing required fields in message")
                await message.reject(requeue=False)
                return

            logger.info(f"Processing {event_type} for user {user_id}")
            # Create/update profile in MongoDB
            db = get_db()
            result = await db.profiles.update_one(
                {"user_id": user_id},
                {
                    "$set": {
                        "name": user_data.get("name") or "",
                        "email": user_data.get("email"),
                        "profile_complete": False
                    }
                },
                upsert=True
            )

            logger.info(f"Update result: acknowledged={result.acknowledged}, "
                      f"matched_count={result.matched_count}, "
                      f"modified_count={result.modified_count}, "
                      f"upserted_id={result.upserted_id}")

            if result.upserted_id:
                logger.info(f"Created new profile for user {user_id}")
            else:
                logger.info(f"Updated existing profile for user {user_id}")

    except json.JSONDecodeError as e:
        logger.error(f"Invalid message format: {e}")
        await message.reject(requeue=False)
    except Exception as e:
        logger.error(f"Failed to process message: {e}", exc_info=True)
        await message.reject(requeue=True)

async def consume_user_events():
    while True:
        try:
            channel = await rabbitmq.connect()

            # Declare the same exchange as in Node.js publisher
            exchange = await channel.declare_exchange(
                "user_events",  # Must match publisher's exchange name
                type="topic",
                durable=True
            )

            # Declare queue with DLX support
            queue = await channel.declare_queue(
                "user_service_queue",  # Unique queue name for this service
                durable=True,
                arguments={
                    "x-dead-letter-exchange": "dlx.user_events",
                    "x-message-ttl": 60000  # 60 seconds
                }
            )

            # Bind to user_created events (no wildcard as publisher uses simple event type)
            await queue.bind(exchange, routing_key="user_created")

            logger.info("Waiting for user_created events... Press CTRL+C to exit")

            async with queue.iterator() as queue_iter:
                async for message in queue_iter:
                    await handle_user_created(message)

        except asyncio.CancelledError:
            logger.info("Consumer was cancelled, shutting down...")
            break
        except Exception as e:
            logger.error(f"Consumer error: {e}", exc_info=True)
            await asyncio.sleep(5)  # Wait before reconnecting
        finally:
            await rabbitmq.close()