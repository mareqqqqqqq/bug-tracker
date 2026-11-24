from datetime import datetime
from pydantic import BaseModel, Field, field_validator, ConfigDict

class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=5000)
    repo_url: str = Field(min_length=1, max_length=500)

    @field_validator("name", "repo_url")
    @classmethod
    def strip_spaces(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Заполните поле")
        return value

    @field_validator("repo_url")
    @classmethod
    def check_repo_url(cls, value: str) -> str:
        if not value.startswith("https://"):
            raise ValueError("Ссылка должна начитнаться с https://")
        return value

class ProjectOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None
    repo_url: str
    created_at: datetime

