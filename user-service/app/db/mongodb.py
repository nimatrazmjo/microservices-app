from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import get_settings

settings = get_settings()

class Database:
    client: AsyncIOMotorClient = None

db = Database()

async def connect_db():
    db.client = AsyncIOMotorClient(settings.mongo_url)
    await db.client.admin.command('ping')
    print("✅ Connected to MongoDB")

async def close_db():
    db.client.close()
    print("❌ Disconnected from MongoDB")

def get_db():
    return db.client[settings.mongo_db_name]