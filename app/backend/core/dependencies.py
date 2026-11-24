import jwt
from fastapi import Cookie, Depends , HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.backend.core.security import decode_token
from app.backend.db import get_db
from app.backend.models.user import User

async def get_current_user(access_token: str | None = Cookie(default=None),
                           db: AsyncSession = Depends(get_db), ) -> User:
    unauthorized = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                 detail='Не авторизован',)
    if access_token is None:
        raise unauthorized
    try:
        payload = decode_token(access_token, "access")
    except jwt.InvalidTokenError:
        raise unauthorized

    user = await db.get(User, int(payload["sub"]))
    if user is None:
        raise unauthorized
    return user
