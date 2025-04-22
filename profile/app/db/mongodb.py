# mongodb.py
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import get_settings

settings = get_settings()

class Database:
    client: AsyncIOMotorClient = None
    db = None  # Add this to hold the database instance

db = Database()

async def connect_db():
    db.client = AsyncIOMotorClient(settings.mongo_url)
    db.db = db.client[settings.mongo_db_name]  # Initialize the database instance
    await db.client.admin.command('ping')
    print("Connected to MongoDB", "✅")

async def close_db():
    db.client.close()
    print("Disconnected from MongoDB", "❌")

def get_db():
    if db.db is None:
        raise RuntimeError("Database not connected!")
    return db.db