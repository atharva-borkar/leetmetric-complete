"""
/api/leaderboard – ranked list of all tracked users.
"""

from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import User
from app.schemas import LeaderboardEntry

router = APIRouter(prefix="/api", tags=["leaderboard"])


@router.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
):
    """
    Return the top users ordered by total problems solved.
    Replaces the old JSON file approach — now backed by PostgreSQL.
    """
    stmt = (
        select(User)
        .order_by(User.total_solved.desc())
        .limit(limit)
    )
    result = await db.execute(stmt)
    users = result.scalars().all()
    return users
