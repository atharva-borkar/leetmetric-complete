"""
/api/goals – CRUD for daily/weekly problem-solving goals (per Firebase user).
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import UserGoal
from app.schemas import GoalCreate, GoalResponse, GoalUpdate

router = APIRouter(prefix="/api/goals", tags=["goals"])


@router.post("/", response_model=GoalResponse, status_code=201)
async def create_goal(body: GoalCreate, db: AsyncSession = Depends(get_db)):
    """Create a new daily or weekly goal for a logged-in user."""
    goal = UserGoal(
        firebase_uid=body.firebase_uid,
        goal_type=body.goal_type,
        target_count=body.target_count,
        difficulty=body.difficulty,
    )
    db.add(goal)
    await db.flush()
    await db.refresh(goal)
    return goal


@router.get("/{firebase_uid}", response_model=List[GoalResponse])
async def get_user_goals(
    firebase_uid: str,
    active_only: bool = True,
    db: AsyncSession = Depends(get_db),
):
    """Get all goals for a given Firebase user."""
    stmt = select(UserGoal).where(UserGoal.firebase_uid == firebase_uid)
    if active_only:
        stmt = stmt.where(UserGoal.is_active == True)
    stmt = stmt.order_by(UserGoal.created_at.desc())

    result = await db.execute(stmt)
    return result.scalars().all()


@router.put("/{goal_id}", response_model=GoalResponse)
async def update_goal(
    goal_id: int,
    body: GoalUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update a goal's target, difficulty, or active status."""
    stmt = select(UserGoal).where(UserGoal.id == goal_id)
    result = await db.execute(stmt)
    goal = result.scalar_one_or_none()

    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    update_data = body.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    for field, value in update_data.items():
        setattr(goal, field, value)

    await db.flush()
    await db.refresh(goal)
    return goal


@router.delete("/{goal_id}", status_code=204)
async def delete_goal(goal_id: int, db: AsyncSession = Depends(get_db)):
    """Soft-delete a goal by setting is_active to False."""
    stmt = select(UserGoal).where(UserGoal.id == goal_id)
    result = await db.execute(stmt)
    goal = result.scalar_one_or_none()

    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    goal.is_active = False
    await db.flush()
