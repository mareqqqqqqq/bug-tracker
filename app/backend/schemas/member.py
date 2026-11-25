from pydantic import BaseModel, EmailStr
from app.backend.models.project import ProjectRole

class MemberAdd(BaseModel):
    email: EmailStr
    role: ProjectRole

class MemberOut(BaseModel):
    user_id: int
    email: EmailStr
    name: str
    role: ProjectRole

