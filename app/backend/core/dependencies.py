import jwt
from fastapi import Cookie, Depends , HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.backend.core.security import decode_token
from app.backend.db import get_db
from app.backend.models.user import User
from collections.abc import Callable
from sqlalchemy  import select
from app.backend.models.project import ProjectMember, ProjectRole

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

async def get_project_member(
        project_id: int,
        user: User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db),
) -> ProjectMember:
    member = await db.scalar(
        select(ProjectMember).where(
            ProjectMember.project_id == project_id,
            ProjectMember.user_id == user.id,
        )
    )
    if member is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Проект не найден")
    return member

def require_project_role(*roles: ProjectRole) -> Callable:
    async def checker(member: ProjectMember = Depends(get_project_member)) -> ProjectMember:
        if member.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Недостаточно прав")
        return member
    return checker
