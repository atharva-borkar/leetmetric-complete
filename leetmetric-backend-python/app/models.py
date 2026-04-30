from datetime import date, datetime
from typing import Optional

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Float,
    Integer,
    String,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class User(Base):
    """Cached LeetCode user profile data — also powers the leaderboard."""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    total_solved: Mapped[int] = mapped_column(Integer, default=0)
    easy_solved: Mapped[int] = mapped_column(Integer, default=0)
    medium_solved: Mapped[int] = mapped_column(Integer, default=0)
    hard_solved: Mapped[int] = mapped_column(Integer, default=0)
    ranking: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    real_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    acceptance_rate: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    last_fetched: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class SearchHistory(Base):
    """Tracks which usernames have been searched, optionally tied to a Firebase user."""

    __tablename__ = "search_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    firebase_uid: Mapped[Optional[str]] = mapped_column(String(128), nullable=True, index=True)
    searched_username: Mapped[str] = mapped_column(String(50), nullable=False)
    searched_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class DailySnapshot(Base):
    """One row per user per day — stores a historical record for trend charts."""

    __tablename__ = "daily_snapshots"
    __table_args__ = (
        UniqueConstraint("username", "snapshot_date", name="uq_user_snapshot_date"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    total_solved: Mapped[int] = mapped_column(Integer, default=0)
    easy_solved: Mapped[int] = mapped_column(Integer, default=0)
    medium_solved: Mapped[int] = mapped_column(Integer, default=0)
    hard_solved: Mapped[int] = mapped_column(Integer, default=0)
    ranking: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    snapshot_date: Mapped[date] = mapped_column(Date, nullable=False)


class UserGoal(Base):
    """Daily or weekly problem-solving target set by a logged-in user."""

    __tablename__ = "user_goals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    firebase_uid: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    goal_type: Mapped[str] = mapped_column(String(20), nullable=False)  # 'daily' | 'weekly'
    target_count: Mapped[int] = mapped_column(Integer, nullable=False)
    difficulty: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)  # NULL = any
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class ContestRecord(Base):
    """Cached contest participation record from LeetCode."""

    __tablename__ = "contest_history"
    __table_args__ = (
        UniqueConstraint("username", "contest_slug", name="uq_user_contest"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    contest_name: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    contest_slug: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    ranking: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    rating: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    problems_solved: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    total_problems: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    finish_time_seconds: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    attended_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
