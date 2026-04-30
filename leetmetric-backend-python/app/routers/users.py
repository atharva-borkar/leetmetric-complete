"""
/api/user/{username}/history   – daily progress snapshots
/api/user/{username}/contests  – contest participation history
/api/user/{username}/calendar  – submission heatmap data
"""

from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import ContestRecord, DailySnapshot
from app.schemas import ContestRecordResponse, ContestSummary, DailySnapshotResponse
from app.services.leetcode_client import leetcode_client

router = APIRouter(prefix="/api/user", tags=["users"])


@router.get("/{username}/history", response_model=List[DailySnapshotResponse])
async def get_user_history(
    username: str,
    days: int = Query(90, ge=1, le=365),
    db: AsyncSession = Depends(get_db),
):
    """
    Return daily snapshots for a user — powers the historical progress chart.
    """
    stmt = (
        select(DailySnapshot)
        .where(DailySnapshot.username == username)
        .order_by(DailySnapshot.snapshot_date.desc())
        .limit(days)
    )
    result = await db.execute(stmt)
    snapshots = result.scalars().all()

    if not snapshots:
        raise HTTPException(
            status_code=404,
            detail=f"No history found for '{username}'. Search for this user first.",
        )

    # Return in chronological order (oldest first)
    return list(reversed(snapshots))


@router.get("/{username}/contests", response_model=ContestSummary)
async def get_user_contests(
    username: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Fetch contest history from LeetCode, cache in PostgreSQL, and return.
    """
    try:
        data = await leetcode_client.fetch_contest_history(username)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"LeetCode API error: {exc}")

    ranking_info = data.get("userContestRanking") or {}
    history_raw = data.get("userContestRankingHistory") or []

    # Cache contest records
    for entry in history_raw:
        if not entry.get("attended"):
            continue

        contest = entry.get("contest", {})
        start_time = contest.get("startTime")
        attended_at = (
            datetime.fromtimestamp(int(start_time), tz=timezone.utc)
            if start_time
            else None
        )

        contest_slug = (
            contest.get("title", "").lower().replace(" ", "-")
            if contest.get("title")
            else None
        )

        stmt = (
            pg_insert(ContestRecord)
            .values(
                username=username,
                contest_name=contest.get("title"),
                contest_slug=contest_slug,
                ranking=entry.get("ranking"),
                rating=entry.get("rating"),
                problems_solved=entry.get("problemsSolved"),
                total_problems=entry.get("totalProblems"),
                finish_time_seconds=entry.get("finishTimeInSeconds"),
                attended_at=attended_at,
            )
            .on_conflict_do_update(
                constraint="uq_user_contest",
                set_={
                    "ranking": entry.get("ranking"),
                    "rating": entry.get("rating"),
                    "problems_solved": entry.get("problemsSolved"),
                },
            )
        )
        await db.execute(stmt)

    # Read back from DB (ensures consistency)
    stmt = (
        select(ContestRecord)
        .where(ContestRecord.username == username)
        .order_by(ContestRecord.attended_at.desc())
    )
    result = await db.execute(stmt)
    records = result.scalars().all()

    return ContestSummary(
        attended_contests_count=ranking_info.get("attendedContestsCount", 0),
        current_rating=ranking_info.get("rating"),
        global_ranking=ranking_info.get("globalRanking"),
        top_percentage=ranking_info.get("topPercentage"),
        history=records,
    )


@router.get("/{username}/calendar")
async def get_user_calendar(
    username: str,
    year: Optional[int] = Query(None, ge=2015, le=2030),
):
    """
    Fetch the submission heatmap calendar directly from LeetCode.
    Returns the raw calendar JSON (a dict of unix timestamps → submission counts).
    """
    try:
        calendar = await leetcode_client.fetch_submission_calendar(username, year)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"LeetCode API error: {exc}")

    return calendar
