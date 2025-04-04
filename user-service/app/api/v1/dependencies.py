from fastapi import Header, HTTPException, Depends
from typing import Annotated

async def verify_token(authorization: Annotated[str, Header()]):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token format")
    return {"user_id": authorization.split(" ")[1]}