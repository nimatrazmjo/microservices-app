from fastapi import FastAPI
from contextlib import asynccontextmanager
import asyncio
import logging
from app.db.mongodb import connect_db, close_db
from app.api.v1.endpoints import profiles
from app.messaging.consumer import consume_user_events
from app.core.rabbitmq import rabbitmq

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Async context manager for application lifecycle"""
    # Startup logic
    logger.info("Starting application...")

    # Connect to MongoDB
    await connect_db()

    # Start RabbitMQ consumer (in background)
    consumer_task = asyncio.create_task(consume_user_events())
    logger.info("RabbitMQ consumer started")

    yield  # Application runs here

    # Shutdown logic
    logger.info("Shutting down application...")

    # Cancel and await consumer task
    consumer_task.cancel()
    try:
        await consumer_task
    except asyncio.CancelledError:
        logger.info("RabbitMQ consumer stopped")

    # Close RabbitMQ connection
    await rabbitmq.close()
    logger.info("RabbitMQ connection closed")

    # Close MongoDB connection
    await close_db()
    logger.info("MongoDB connection closed")

app = FastAPI(lifespan=lifespan)

# Include your API routers
app.include_router(profiles.router)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "mongo": True,  # Assuming connect_db() raises if connection fails
        "rabbitmq": not rabbitmq.connection.is_closed if hasattr(rabbitmq, 'connection') and rabbitmq.connection else False,
        "status": "healthy"
    }