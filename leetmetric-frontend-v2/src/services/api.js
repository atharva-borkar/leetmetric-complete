// Use the environment variable for production, or fallback to local proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const ApiService = {
  /**
   * Fetch user profile data from LeetCode
   */
  async fetchUser(username) {
    try {
      const response = await fetch(`${API_BASE_URL}/leetcode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch user');
      }
      return await response.json();
    } catch (error) {
      console.error('ApiService.fetchUser Error:', error);
      throw error;
    }
  },

  /**
   * Compare two users
   */
  async compareUsers(user1, user2) {
    try {
      const response = await fetch(`${API_BASE_URL}/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user1, user2 }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to compare users');
      }
      return await response.json();
    } catch (error) {
      console.error('ApiService.compareUsers Error:', error);
      throw error;
    }
  },

  /**
   * Get leaderboard from our PostgreSQL DB
   */
  async getLeaderboard(limit = 100) {
    try {
      const response = await fetch(`${API_BASE_URL}/leaderboard?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      return await response.json();
    } catch (error) {
      console.error('ApiService.getLeaderboard Error:', error);
      throw error;
    }
  },

  /**
   * Get user's daily snapshot history
   */
  async getUserHistory(username, days = 90) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${username}/history?days=${days}`);
      if (!response.ok) throw new Error('Failed to fetch user history');
      return await response.json();
    } catch (error) {
      console.error('ApiService.getUserHistory Error:', error);
      throw error;
    }
  },

  /**
   * Get user's contest history
   */
  async getUserContests(username) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${username}/contests`);
      if (!response.ok) throw new Error('Failed to fetch user contests');
      return await response.json();
    } catch (error) {
      console.error('ApiService.getUserContests Error:', error);
      throw error;
    }
  },

  /**
   * Get user's submission calendar (heatmap data)
   */
  async getUserCalendar(username, year = null) {
    try {
      let url = `${API_BASE_URL}/user/${username}/calendar`;
      if (year) url += `?year=${year}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch user calendar');
      return await response.json();
    } catch (error) {
      console.error('ApiService.getUserCalendar Error:', error);
      throw error;
    }
  },

  /**
   * Get real platform analytics
   */
  /**
   * Get platform analytics
   */
  async getPlatformAnalytics() {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/platform`);
      if (!response.ok) throw new Error('Failed to fetch platform analytics');
      return await response.json();
    } catch (error) {
      console.error('ApiService.getPlatformAnalytics Error:', error);
      throw error;
    }
  },

  /**
   * Get User Goals
   */
  async getGoals(firebaseUid) {
    const response = await fetch(`${API_BASE_URL}/goals/${firebaseUid}`);
    if (!response.ok) throw new Error('Failed to load goals');
    return await response.json();
  },

  /**
   * Create User Goal
   */
  async createGoal(payload) {
    const response = await fetch(`${API_BASE_URL}/goals/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Failed to create goal');
    return await response.json();
  },

  /**
   * Complete (soft-delete) Goal
   */
  async completeGoal(goalId) {
    const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to complete goal');
    return true;
  }
};
