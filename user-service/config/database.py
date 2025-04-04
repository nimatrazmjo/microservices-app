from logging import getLogger
from motor.motor_asyncio import AsyncIOMotorClient
import aio_pika
from aio_pika.abc import AbstractRobustConnection

logger = getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        self.mongo_client = None
        self.rabbit_connection = None
        self.is_connected = False

    async def connect(self, mongo_uri: str, rabbit_uri: str):
        try:
            # MongoDB Connection
            self.mongo_client = AsyncIOMotorClient(mongo_uri)
            await self.mongo_client.admin.command('ping')
            logger.info("✅ Successfully connected to MongoDB!")

            # RabbitMQ Connection
            self.rabbit_connection = await aio_pika.connect_robust(rabbit_uri)
            logger.info("✅ Successfully connected to RabbitMQ!")

            self.is_connected = True
        except Exception as e:
            logger.error(f"🔥 Connection failed: {str(e)}")
            raise

    async def close(self):
        if self.rabbit_connection:
            await self.rabbit_connection.close()
            logger.info("🛑 RabbitMQ connection closed")
        if self.mongo_client:
            self.mongo_client.close()
            logger.info("🛑 MongoDB connection closed")

manager = ConnectionManager()