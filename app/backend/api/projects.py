from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.backend.core.dependencies import get_current_user
from app.backend.db import get_db
from app.backend.models.project import Project, ProjectMember, ProjectRole
from app.backend.models.user import User
from app.backend.schemas.project import ProjectCreate, ProjectOut

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