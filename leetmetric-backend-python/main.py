"""
LeetMetric API — FastAPI backend with PostgreSQL (Neon).

Run locally:
    uvicorn main:app --reload --port 3001

API docs available at:
    http://localhost:3001/docs
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import create_tables
from app.routers import analytics, goals, leaderboard, leetcode, users
from app.schemas import HealthResponse
from app.services.leetcode_client import leetcode_client


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown logic."""
    # Startup: create tables if they don't exist
    await create_tables()
    yield
    # Shutdown: close the httpx client
    await leetcode_client.close()


app = FastAPI(
    title="LeetMetric API",
    description="Backend for LeetMetric — LeetCode analytics platform",
    version="2.0.0",
    lifespan=lifespan,
)

# ── CORS ─────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────────────────────────

app.include_router(leetcode.router)
app.include_router(leaderboard.router)
app.include_router(users.router)
app.include_router(goals.router)
app.include_router(analytics.router)


# ── Health check ─────────────────────────────────────────────────────────────

@app.get("/api/health", response_model=HealthResponse, tags=["health"])
async def health_check():
    return HealthResponse(status="ok", environment=settings.environment)
