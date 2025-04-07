from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    mongo_url: str = "mongodb://root:example@mongodb:27017"
    mongo_db_name: str = "users"
    mongo_user: str = "root"
    mongo_pass: str = "example"

    # RabbitMQ credentials
    rabbitmq_url: str = "amqp://guest:guest@host.docker.internal:5672"
    rabbitmq_exchange: str = "user_events"
    rabbitmq_user: str = "guest"
    rabbitmq_pass: str = "guest"

    secret_key: str = "rqwerwqerwqr"  # Should be a long, random string

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

@lru_cache()
def get_settings():
    return Settings()
