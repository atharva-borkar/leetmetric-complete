import { API_BASE_URL } from '../utils/constants';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async fetchUser(username) {
    return this.request('/leetcode', {
      method: 'POST',
      body: JSON.stringify({ username }),
    });
  }

  async compareUsers(user1, user2) {
    return this.request('/compare', {
      method: 'POST',
      body: JSON.stringify({ user1, user2 }),
    });
  }

  async getLeaderboard() {
    return this.request('/leaderboard');
  }

  async getUserStats(username) {
    // Additional endpoint for detailed stats
    return this.request('/user-stats', {
      method: 'POST',
      body: JSON.stringify({ username }),
    });
  }
}

export const api = new ApiService();

