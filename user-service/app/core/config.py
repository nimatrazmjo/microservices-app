from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    mongo_url: str = "mongodb://root:example@mongodb:27017"
    mongo_db_name: str = "mongodb"
    mongo_user: str = "root"
    mongo_pass: str = "example"

    # RabbitMQ credentials
    rabbitmq_url: str = "amqp://admin:admin123@host.docker.internal:5672"
    rabbitmq_exchange: str = "user_events"
    rabbitmq_user: str = "admin"
    rabbitmq_pass: str = "admin123"

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

@lru_cache()
def get_settings():
    return Settings()
