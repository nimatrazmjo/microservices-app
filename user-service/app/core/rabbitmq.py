# app/core/rabbitmq.py
import aio_pika
from aio_pika.abc import AbstractRobustConnection
from app.core.config import get_settings

class RabbitMQManager:
    """Manages RabbitMQ connections and channels"""
    _connection: AbstractRobustConnection = None

    @classmethod
    async def get_connection(cls) -> AbstractRobustConnection:
        if cls._connection is None or cls._connection.is_closed:
            cls._connection = await aio_pika.connect_robust(
                get_settings().rabbitmq_url
            )
            print("✅ RabbitMQ connection established")
        return cls._connection