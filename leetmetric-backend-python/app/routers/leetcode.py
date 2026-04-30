"""
/api/leetcode  – fetch a single user's profile from LeetCode
/api/compare   – fetch and compare two users
"""

from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import DailySnapshot, User
from app.schemas import CompareRequest, CompareResponse, LeetCodeProfileResponse, UsernameRequest
from app.services.leetcode_client import leetcode_client

router = APIRouter(prefix="/api", tags=["leetcode"])


async def _upsert_user(db: AsyncSession, summary: dict) -> None:
    """Insert or update a user row and create today's daily snapshot."""
    stmt = (
        pg_insert(User)
        .values(**summary)
        .on_conflict_do_update(
            index_elements=["username"],
            set_={
                "total_solved": summary["total_solved"],
                "easy_solved": summary["easy_solved"],
                "medium_solved": summary["medium_solved"],
                "hard_solved": summary["hard_solved"],
                "ranking": summary["ranking"],
                "avatar_url": summary["avatar_url"],
                "real_name": summary["real_name"],
                "acceptance_rate": summary["acceptance_rate"],
            },
        )
    )
    await db.execute(stmt)

    # Daily snapshot (one per user per day)
    snap_stmt = (
        pg_insert(DailySnapshot)
        .values(
            username=summary["username"],
            total_solved=summary["total_solved"],
            easy_solved=summary["easy_solved"],
            medium_solved=summary["medium_solved"],
            hard_solved=summary["hard_solved"],
            ranking=summary["ranking"],
            snapshot_date=date.today(),
        )
        .on_conflict_do_update(
            constraint="uq_user_snapshot_date",
            set_={
                "total_solved": summary["total_solved"],
                "easy_solved": summary["easy_solved"],
                "medium_solved": summary["medium_solved"],
                "hard_solved": summary["hard_solved"],
                "ranking": summary["ranking"],
            },
        )
    )
    await db.execute(snap_stmt)


@router.post("/leetcode", response_model=LeetCodeProfileResponse)
async def fetch_user(body: UsernameRequest, db: AsyncSession = Depends(get_db)):
    """
    Fetch a LeetCode user's profile and cache it in PostgreSQL.
    Returns the raw LeetCode GraphQL response so the frontend
    can use it exactly like before.
    """
    try:
        raw = await leetcode_client.fetch_user_profile(body.username)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"LeetCode API error: {exc}")

    # Persist to our database
    summary = leetcode_client.extract_user_summary(raw)
    await _upsert_user(db, summary)

    return LeetCodeProfileResponse(data=raw["data"])


@router.post("/compare", response_model=CompareResponse)
async def compare_users(body: CompareRequest, db: AsyncSession = Depends(get_db)):
    """Fetch two users from LeetCode and return side-by-side data."""
    if body.user1.lower() == body.user2.lower():
        raise HTTPException(status_code=400, detail="Please enter different usernames")

    errors = []
    results = {}

    for label, username in [("user1", body.user1), ("user2", body.user2)]:
        try:
            raw = await leetcode_client.fetch_user_profile(username)
            results[label] = raw["data"]
            summary = leetcode_client.extract_user_summary(raw)
            await _upsert_user(db, summary)
        except ValueError:
            errors.append(f"User '{username}' not found")
        except Exception as exc:
            errors.append(f"Error fetching '{username}': {exc}")

    if errors:
        raise HTTPException(status_code=404, detail="; ".join(errors))

    return CompareResponse(
        user1=results["user1"],
        user2=results["user2"],
        allQuestionsCount=results["user1"].get("allQuestionsCount", []),
    )
