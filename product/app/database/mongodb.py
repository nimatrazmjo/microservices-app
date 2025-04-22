from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING, TEXT
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME")

print(MONGODB_URL)

client = AsyncIOMotorClient(MONGODB_URL)
db = client[MONGODB_DB_NAME]

async def get_db():
    return db


async def create_indexes():
    # Indexes for products
    await db.products.create_index([("name", TEXT), ("description", TEXT)])
    await db.products.create_index([("category_id", ASCENDING)])
    await db.products.create_index([("price", ASCENDING)])

    # Indexes for categories
    await db.categories.create_index([("name", ASCENDING)], unique=True)

async def connect_to_mongo():
    try:
        await client.admin.command('ping')
        await create_indexes()
        print("Connected to MongoDB successfully", "✅")
    except Exception as e:
        print(f"Could not connect to MongoDB : {e}", "❌")

async def close_mongo_connection():
    client.close()