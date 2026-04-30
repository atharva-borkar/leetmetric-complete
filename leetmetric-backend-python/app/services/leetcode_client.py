"""
Async client for LeetCode's GraphQL API.

All LeetCode interaction is isolated here so the routers stay clean.
"""

from datetime import datetime, timezone
from typing import Any, Dict, Optional

import httpx

LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql/"

COMMON_HEADERS = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (compatible; LeetMetric/2.0)",
    "Referer": "https://leetcode.com",
    "Origin": "https://leetcode.com",
}

# ── GraphQL Queries ──────────────────────────────────────────────────────────

USER_PROFILE_QUERY = """
query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    username
    profile {
      userAvatar
      ranking
      realName
    }
    languageProblemCount {
      languageName
      problemsSolved
    }
    tagProblemCounts {
      advanced {
        tagName
        tagSlug
        problemsSolved
      }
    }
    submitStats {
      acSubmissionNum {
        difficulty
        count
        submissions
      }
      totalSubmissionNum {
        difficulty
        count
        submissions
      }
    }
  }
  allQuestionsCount {
    difficulty
    count
  }
}
"""

CONTEST_RANKING_QUERY = """
query userContestRankingInfo($username: String!) {
  userContestRanking(username: $username) {
    attendedContestsCount
    rating
    globalRanking
    totalParticipants
    topPercentage
  }
  userContestRankingHistory(username: $username) {
    attended
    trendDirection
    problemsSolved
    totalProblems
    finishTimeInSeconds
    rating
    ranking
    contest {
      title
      startTime
    }
  }
}
"""

SUBMISSION_CALENDAR_QUERY = """
query userProfileCalendar($username: String!, $year: Int) {
  matchedUser(username: $username) {
    userCalendar(year: $year) {
      activeYears
      streak
      totalActiveDays
      submissionCalendar
    }
  }
}
"""


class LeetCodeClient:
    """Async HTTP client for LeetCode's GraphQL endpoint."""

    def __init__(self):
        self._client: Optional[httpx.AsyncClient] = None

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                timeout=httpx.Timeout(30.0, connect=10.0),
                headers=COMMON_HEADERS,
            )
        return self._client

    async def close(self):
        if self._client and not self._client.is_closed:
            await self._client.aclose()

    async def _query(self, query: str, variables: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a GraphQL query against LeetCode."""
        client = await self._get_client()
        response = await client.post(
            LEETCODE_GRAPHQL_URL,
            json={"query": query, "variables": variables},
        )
        response.raise_for_status()
        return response.json()

    # ── Public methods ───────────────────────────────────────────────────────

    async def fetch_user_profile(self, username: str) -> Dict[str, Any]:
        """Fetch a user's full profile (stats, languages, tags, etc.)."""
        data = await self._query(USER_PROFILE_QUERY, {"username": username})

        if not data.get("data", {}).get("matchedUser"):
            raise ValueError(f"User '{username}' not found on LeetCode")

        return data

    async def fetch_contest_history(self, username: str) -> Dict[str, Any]:
        """Fetch a user's contest ranking and history."""
        data = await self._query(CONTEST_RANKING_QUERY, {"username": username})
        return data.get("data", {})

    async def fetch_submission_calendar(
        self, username: str, year: Optional[int] = None
    ) -> Dict[str, Any]:
        """Fetch the submission heatmap calendar for a user."""
        variables: Dict[str, Any] = {"username": username}
        if year is not None:
            variables["year"] = year

        data = await self._query(SUBMISSION_CALENDAR_QUERY, variables)
        matched = data.get("data", {}).get("matchedUser")
        if not matched:
            raise ValueError(f"User '{username}' not found on LeetCode")
        return matched.get("userCalendar", {})

    def extract_user_summary(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Pull the key fields we persist in our database from the raw
        LeetCode response.
        """
        user = raw_data["data"]["matchedUser"]
        ac_stats = user["submitStats"]["acSubmissionNum"]
        total_sub = user["submitStats"]["totalSubmissionNum"]

        def by_difficulty(stats, diff):
            return next(
                (s for s in stats if s["difficulty"].lower() == diff.lower()),
                {"count": 0, "submissions": 0},
            )

        all_ac = by_difficulty(ac_stats, "All")
        all_sub = by_difficulty(total_sub, "All")
        submissions_count = all_sub.get("submissions", 0)
        acceptance = (
            round(all_ac["count"] / submissions_count * 100, 2)
            if submissions_count > 0
            else 0.0
        )

        return {
            "username": user["username"],
            "total_solved": all_ac["count"],
            "easy_solved": by_difficulty(ac_stats, "Easy")["count"],
            "medium_solved": by_difficulty(ac_stats, "Medium")["count"],
            "hard_solved": by_difficulty(ac_stats, "Hard")["count"],
            "ranking": user["profile"].get("ranking"),
            "avatar_url": user["profile"].get("userAvatar"),
            "real_name": user["profile"].get("realName"),
            "acceptance_rate": acceptance,
        }


# Module-level singleton so we can share the httpx connection pool.
leetcode_client = LeetCodeClient()
