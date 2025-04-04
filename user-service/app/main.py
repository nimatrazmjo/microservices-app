from fastapi import FastAPI
from app.db.mongodb import connect_db, close_db
from app.api.v1.endpoints import profiles
from app.core.rabbitmq import RabbitMQManager

app = FastAPI()

app.include_router(profiles.router)

@app.on_event("startup")
async def startup():
    await connect_db()
    await RabbitMQManager.get_connection()


@app.on_event("shutdown")
async def shutdown():
    await close_db()