from datetime import date, datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


# ── Request schemas ──────────────────────────────────────────────────────────


class UsernameRequest(BaseModel):
    username: str = Field(..., min_length=1, max_length=50)


class CompareRequest(BaseModel):
    user1: str = Field(..., min_length=1, max_length=50)
    user2: str = Field(..., min_length=1, max_length=50)


class GoalCreate(BaseModel):
    firebase_uid: str
    goal_type: str = Field(..., pattern=r"^(daily|weekly)$")
    target_count: int = Field(..., gt=0, le=100)
    difficulty: Optional[str] = Field(None, pattern=r"^(easy|medium|hard)$")


class GoalUpdate(BaseModel):
    target_count: Optional[int] = Field(None, gt=0, le=100)
    difficulty: Optional[str] = Field(None, pattern=r"^(easy|medium|hard)$")
    is_active: Optional[bool] = None


# ── Response schemas ─────────────────────────────────────────────────────────


class UserResponse(BaseModel):
    username: str
    total_solved: int
    easy_solved: int
    medium_solved: int
    hard_solved: int
    ranking: Optional[int]
    avatar_url: Optional[str]
    real_name: Optional[str]
    acceptance_rate: Optional[float]
    last_fetched: datetime

    model_config = {"from_attributes": True}


class LeaderboardEntry(BaseModel):
    username: str
    total_solved: int
    ranking: Optional[int]
    avatar_url: Optional[str]
    last_fetched: datetime

    model_config = {"from_attributes": True}


class DailySnapshotResponse(BaseModel):
    total_solved: int
    easy_solved: int
    medium_solved: int
    hard_solved: int
    ranking: Optional[int]
    snapshot_date: date

    model_config = {"from_attributes": True}


class GoalResponse(BaseModel):
    id: int
    firebase_uid: str
    goal_type: str
    target_count: int
    difficulty: Optional[str]
    created_at: datetime
    is_active: bool

    model_config = {"from_attributes": True}


class ContestRecordResponse(BaseModel):
    contest_name: Optional[str]
    contest_slug: Optional[str]
    ranking: Optional[int]
    rating: Optional[float]
    problems_solved: Optional[int]
    total_problems: Optional[int]
    finish_time_seconds: Optional[int]
    attended_at: Optional[datetime]

    model_config = {"from_attributes": True}


class ContestSummary(BaseModel):
    attended_contests_count: int
    current_rating: Optional[float]
    global_ranking: Optional[int]
    top_percentage: Optional[float]
    history: List[ContestRecordResponse]


class PlatformAnalytics(BaseModel):
    total_users_tracked: int
    total_problems_solved: int
    average_solved: float
    top_performers_count: int  # users with 500+ solved
    difficulty_distribution: Dict[str, int]
    most_active_today: int


class LeetCodeProfileResponse(BaseModel):
    """Wraps the raw LeetCode GraphQL response — forwarded to the frontend."""
    data: Dict[str, Any]


class CompareResponse(BaseModel):
    user1: Dict[str, Any]
    user2: Dict[str, Any]
    allQuestionsCount: List[Dict[str, Any]]


class HealthResponse(BaseModel):
    status: str = "ok"
    environment: str
