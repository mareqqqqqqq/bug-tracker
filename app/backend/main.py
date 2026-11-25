from fastapi import FastAPI
from app.backend.api.auth import router as auth_router
from app.backend.api.projects import router as project_router
from app.backend.api.members import router as member_router

app = FastAPI()
app.include_router(auth_router, prefix="/api/v1")
app.include_router(project_router, prefix="/api/v1")
app.include_router(member_router, prefix="/api/v1")


@app.get("/health")
def health():
    return {"status": "ok"}

