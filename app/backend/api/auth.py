from fastapi import APIRouter, HTTPException, Depends, status, Response, Cookie
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select
import jwt


from app.backend.models.user import User
from app.backend.schemas.auth import RegisterRequest, UserOut, LoginRequest
from app.backend.db import get_db

from app.backend.core.config import settings
from app.backend.core.security import (create_access_token, create_refresh_token, decode_token, hash_password,
                                       hash_token, verify_password)
from app.backend.core.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

def set_auth_cookies(response: Response, access_token: str, refresh_token: str) -> None:
    response.set_cookie(
        key="access_token",
        value=access_token,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        httponly=True,
        samesite="lax",
        secure=False,
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        httponly=True,
        samesite="lax",
        secure=False,
        path="/api/v1/auth",
    )

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    user = User(
        email=data.email.lower(),
        name=data.name,
        hashed_password=hash_password(data.password)
    )
    db.add(user)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Пользователь с такой почтой уже существует",
        )
    await db.refresh(user)
    return user

@router.post("/login", response_model=UserOut)
async def login(data: LoginRequest, response: Response, db: AsyncSession = Depends(get_db)) -> User:
    user = await db.scalar(select(User).where(User.email == data.email.lower()))
    if user is None or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверная почта или пароль"
        )

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    user.refresh_token_hash = hash_token(refresh_token)
    await db.commit()

    set_auth_cookies(response, access_token, refresh_token);

    return user

@router.get("/me", response_model=UserOut)
async def me(user: User = Depends(get_current_user)) -> User:
    return user

@router.post("/refresh", response_model=UserOut)
async def refresh(response: Response,
                  refresh_token: str | None = Cookie(default=None),
                  db: AsyncSession = Depends(get_db),) -> User:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Нужно войти заново",
    )

    if refresh_token is None:
        raise unauthorized
    try:
        payload = decode_token(refresh_token, "refresh")
    except jwt.InvalidTokenError:
        raise unauthorized

    user = await db.get(User, int(payload["sub"]))
    if user is None or user.refresh_token_hash != hash_token(refresh_token):
        raise unauthorized

    new_access = create_access_token(user.id)
    new_refresh = create_refresh_token(user.id)
    user.refresh_token_hash = hash_token(new_refresh)
    await db.commit()

    set_auth_cookies(response, new_access, new_refresh)
    return user

@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
        response: Response,
        user: User = Depends(get_current_user),
        db: AsyncSession= Depends(get_db)
) -> None:
    user.refresh_token_hash = None
    await db.commit()
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token", path="/api/v1/auth")