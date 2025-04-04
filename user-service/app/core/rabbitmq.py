import aio_pika
import logging
from aio_pika.abc import AbstractConnection, AbstractChannel

logger = logging.getLogger(__name__)

class RabbitMQ:
    def __init__(self):
        self.connection: AbstractConnection = None
        self.channel: AbstractChannel = None

    async def connect(self) -> AbstractChannel:
        """Establish RabbitMQ connection with retry logic"""
        try:
            if self.connection and not self.connection.is_closed:
                return self.channel

            self.connection = await aio_pika.connect_robust(
                'amqp://guest:guest@host.docker.internal:5672',
                timeout=5
            )
            self.channel = await self.connection.channel()
            logger.info("RabbitMQ connection established")
            return self.channel

        except Exception as e:
            logger.error(f"RabbitMQ connection failed: {e}")
            raise

    async def close(self):
        """Cleanly close connections"""
        if self.channel and not self.channel.is_closed:
            await self.channel.close()
        if self.connection and not self.connection.is_closed:
            await self.connection.close()
        logger.info("RabbitMQ connections closed")

# Singleton instance
rabbitmq = RabbitMQ()

# # app/core/rabbitmq.py
# import aio_pika
# from aio_pika.abc import AbstractRobustConnection
# from app.core.config import get_settings

# class RabbitMQManager:
#     """Manages RabbitMQ connections and channels"""
#     _connection: AbstractRobustConnection = None

#     @classmethod
#     async def get_connection(cls) -> AbstractRobustConnection:

#         print("🔌 ------------------------------------------------------------...")
#         print(get_settings().rabbitmq_url)

#         if cls._connection is None or cls._connection.is_closed:
#             cls._connection = await aio_pika.connect_robust('amqp://guest:guest@host.docker.internal:5672')
#             print("✅ RabbitMQ connection established")
#         return cls._connection
