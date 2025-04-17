from pydantic_settings import BaseSettings
from functools import lru_cache
from dotenv import load_dotenv
import os
import logging

logger = logging.getLogger(__name__)

# Manually load .env file
load_dotenv()

class Settings(BaseSettings):
    mongo_user: str = os.getenv("MONGO_USER", "root")
    mongo_pass: str = os.getenv("MONGO_PASS", "example")
    mongo_host: str = os.getenv("MONGO_HOST", "mongodb")
    mongo_port: str = os.getenv("MONGO_PORT", "27017")
    mongo_db_name: str = os.getenv("MONGO_DB_NAME", "mydb")

    rabbitmq_user: str = os.getenv("RABBITMQ_USER", "guest")
    rabbitmq_pass: str = os.getenv("RABBITMQ_PASS", "guest")
    rabbitmq_host: str = os.getenv("RABBITMQ_HOST", "host.docker.internal")
    rabbitmq_port: str = os.getenv("RABBITMQ_PORT", "5672")
    rabbitmq_exchange: str = os.getenv("RABBITMQ_EXCHANGE", "user_events")

    secret_key: str = os.getenv("SECRET_KEY", "rqwerwqerwqr")

    @property
    def mongo_url(self) -> str:
        url = f"mongodb://{self.mongo_user}:{self.mongo_pass}@{self.mongo_host}:{self.mongo_port}"
        logger.info(f"Mongo URL: {url}")
        return url

    @property
    def rabbitmq_url(self) -> str:
        url = f"amqp://{self.rabbitmq_user}:{self.rabbitmq_pass}@{self.rabbitmq_host}:{self.rabbitmq_port}"
        logger.info(f"RabbitMQ URL: {url}")
        return url

@lru_cache()
def get_settings():
    return Settings()
