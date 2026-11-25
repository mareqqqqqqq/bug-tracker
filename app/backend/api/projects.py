from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.backend.core.dependencies import get_current_user
from app.backend.db import get_db
from app.backend.models.project import Project, ProjectMember, ProjectRole
from app.backend.models.user import User
from app.backend.schemas.project import ProjectCreate, ProjectOut
from app.backend.schemas.project import ProjectListItem
from sqlalchemy.orm import aliased
from app.backend.core.dependencies import get_current_user, get_project_member
from app.backend.schemas.project import ProjectDetail
from app.backend.schemas.member import MemberOut
router = APIRouter(prefix="/projects", tags=['projects'])

@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
async def create_project(data: ProjectCreate, user: User = Depends(get_current_user),
                         db: AsyncSession = Depends(get_db)) -> Project:
    project = Project(
        name=data.name,
        description=data.description,
        repo_url=data.repo_url,
    )
    db.add(project)
    await db.flush()

    db.add(ProjectMember(project_id=project.id, user_id=user.id, role=ProjectRole.lead))
    await db.commit()
    await db.refresh(project)
    return project

@router.get("", response_model=list[ProjectListItem])
async def list_projects(user: User = Depends(get_current_user),
                        db: AsyncSession = Depends(get_db), ) -> list[ProjectListItem]:
    other_members = aliased(ProjectMember)
    members_count = (
        select(func.count(other_members.id))
        .where(other_members.project_id == Project.id)
        .scalar_subquery()
    )

    stmt = (
        select (
        Project.id,
        Project.name,
        ProjectMember.role.label("my_role"),
        members_count.label("members_count"),
    )
        .join(ProjectMember, ProjectMember.project_id == Project.id)
        .where(ProjectMember.user_id == user.id)
        .order_by(Project.created_at.desc())
    )
    rows = (await db.execute(stmt)).all()
    return [
        ProjectListItem(id=row.id, name=row.name, my_role=row.my_role, members_count=row.members_count)
        for row in rows
    ]

@router.get("/{project_id}", response_model=ProjectDetail)
async def get_project(project_id: int, member: ProjectMember = Depends(get_project_member),
                      db: AsyncSession = Depends(get_db),
                      ) -> ProjectDetail:
    project = await db.get(Project, member.project_id)
    return ProjectDetail(
        id=project.id,
        name=project.name,
        description=project.description,
        repo_url=project.repo_url,
        my_role=member.role,
    )

