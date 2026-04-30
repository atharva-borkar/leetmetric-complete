"""
/api/analytics/platform – real, aggregated platform-wide analytics
                          (replaces the old mock data on the frontend).
"""

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import DailySnapshot, User
from app.schemas import PlatformAnalytics

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/platform", response_model=PlatformAnalytics)
async def get_platform_analytics(db: AsyncSession = Depends(get_db)):
    """
    Compute real platform analytics from PostgreSQL.
    No more mock data — every number comes from the actual tracked users.
    """
    # Total users
    total_users_result = await db.execute(select(func.count(User.id)))
    total_users = total_users_result.scalar() or 0

    # Aggregate stats
    agg_result = await db.execute(
        select(
            func.coalesce(func.sum(User.total_solved), 0).label("total_solved"),
            func.coalesce(func.avg(User.total_solved), 0).label("avg_solved"),
            func.coalesce(func.sum(User.easy_solved), 0).label("total_easy"),
            func.coalesce(func.sum(User.medium_solved), 0).label("total_medium"),
            func.coalesce(func.sum(User.hard_solved), 0).label("total_hard"),
        )
    )
    agg = agg_result.one()

    # Top performers (500+ solved)
    top_result = await db.execute(
        select(func.count(User.id)).where(User.total_solved >= 500)
    )
    top_performers = top_result.scalar() or 0

    # Users active today (have a snapshot for today)
    from datetime import date

    today_result = await db.execute(
        select(func.count(func.distinct(DailySnapshot.username))).where(
            DailySnapshot.snapshot_date == date.today()
        )
    )
    active_today = today_result.scalar() or 0

    return PlatformAnalytics(
        total_users_tracked=total_users,
        total_problems_solved=int(agg.total_solved),
        average_solved=round(float(agg.avg_solved), 1),
        top_performers_count=top_performers,
        difficulty_distribution={
            "easy": int(agg.total_easy),
            "medium": int(agg.total_medium),
            "hard": int(agg.total_hard),
        },
        most_active_today=active_today,
    )
