import json
import logging
from aio_pika import IncomingMessage
from app.db.mongodb import get_db
from app.core.rabbitmq import rabbitmq

logger = logging.getLogger(__name__)

async def handle_user_created(message: IncomingMessage):
    try:
        async with message.process():
            # Parse the message body
            body = json.loads(message.body.decode())

            # Extract the routing key components
            event_type = message.routing_key.split('.')[0]  # "user_created"
            user_id = message.routing_key.split('.')[1]     # user._id

            # The actual data is in the body
            user_data = body

            logger.info(f"Processing {event_type} for user {user_id}")

            # Create/update profile in MongoDB
            db = await get_db()
            await db.profiles.update_one(
                {"user_id": user_id},
                {
                    "$set": {
                        "name": user_data.get("name"),
                        "email": user_data.get("email"),
                        "profile_complete": False
                    }
                },
                upsert=True
            )

            logger.info(f"Updated profile for user {user_id}")

    except json.JSONDecodeError:
        logger.error("Invalid message format")
        await message.reject(requeue=False)
    except Exception as e:
        logger.error(f"Failed to process message: {e}")
        await message.reject(requeue=True)

async def consume_user_events():
    while True:
        try:
            channel = await rabbitmq.connect()

            # Match the exchange type with publisher
            exchange = await channel.declare_exchange(
                "events",  # Match publisher exchange name
                type="topic",
                durable=True
            )

            # Queue with binding pattern matching publisher
            queue = await channel.declare_queue(
                "user_events",
                durable=True,
                arguments={
                    "x-dead-letter-exchange": "dlx.events",
                    "x-message-ttl": 60000
                }
            )

            # Bind to user_created events with wildcard
            await queue.bind(exchange, routing_key="user_created.*")

            logger.info("Waiting for user_created events...")

            async with queue.iterator() as queue_iter:
                async for message in queue_iter:
                    await handle_user_created(message)

        except Exception as e:
            logger.error(f"Consumer error: {e}")
            await asyncio.sleep(5)  # Wait before reconnecting