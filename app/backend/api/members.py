from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.backend.core.dependencies import require_project_role
from app.backend.db import get_db
from app.backend.models.project import ProjectMember, ProjectRole
from app.backend.models.user import User
from app.backend.schemas.member import MemberAdd, MemberOut
from app.backend.core.dependencies import get_project_member, require_project_role

router = APIRouter(prefix="/projects/{project_id}/members", tags=["members"])

@router.post("", response_model=MemberOut, status_code=status.HTTP_201_CREATED)
async def add_member(
        project_id: int,
        data: MemberAdd,
        lead: ProjectMember = Depends(require_project_role(ProjectRole.lead)),
        db: AsyncSession = Depends(get_db),
) -> MemberOut:
    new_user = await db.scalar(select(User).where(User.email == data.email.lower()))
    if new_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь с такой почтой не найден",
        )

    member = ProjectMember(project_id=project_id, user_id=new_user.id, role=data.role)
    db.add(member)

    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Пользователь уже участник проекта",

        )

    return MemberOut(user_id=new_user.id, email=new_user.email, name=new_user.name, role=member.role)


@router.get("", response_model=list[MemberOut])
async def list_members(
        project_id: int,
        member: ProjectMember = Depends(get_project_member),
        db: AsyncSession = Depends(get_db),
) -> list[MemberOut]:
    stmt= (
        select(User.id, User.email, User.name, ProjectMember.role)
        .join(ProjectMember, ProjectMember.user_id == User.id)
        .where(ProjectMember.project_id == project_id)
        .order_by(ProjectMember.role, User.name)
    )

    rows = (await db.execute(stmt)).all()
    return [
        MemberOut(user_id=row.id, email=row.email, name=row.name, role=row.role)
        for row in rows
    ]





