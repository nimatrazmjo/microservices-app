import aio_pika
import logging
from aio_pika.abc import AbstractConnection, AbstractChannel
from app.core.config import get_settings

settings = get_settings()

logger = logging.getLogger(__name__)

class RabbitMQ:
    def __init__(self):
        self.connection: AbstractConnection = None
        self.channel: AbstractChannel = None

    async def connect(self) -> AbstractChannel:
        """✅ Establish RabbitMQ connection with retry logic"""
        try:
            if self.connection and not self.connection.is_closed:
                return self.channel

            self.connection = await aio_pika.connect_robust(
                settings.rabbitmq_url,
                timeout=5
            )
            self.channel = await self.connection.channel()
            await self.channel.set_qos(prefetch_count=1)
            logger.info("RabbitMQ connection established ")
            return self.channel

        except Exception as e:
            logger.error(f"RabbitMQ connection failed : {e} ❌")
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