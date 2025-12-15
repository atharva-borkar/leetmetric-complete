import { USERNAME_REGEX, DIFFICULTY_COLORS } from './constants';

export const validateUsername = (username) => {
  if (!username || username.trim() === '') {
    return { isValid: false, error: 'Username cannot be empty' };
  }
  
  if (!USERNAME_REGEX.test(username.trim())) {
    return { 
      isValid: false, 
      error: 'Username can only contain letters, numbers, hyphens, and underscores (max 15 chars)' 
    };
  }
  
  return { isValid: true, error: null };
};

export const getStatByDifficulty = (stats, difficulty) => {
  return stats.find(stat => stat.difficulty.toLowerCase() === difficulty.toLowerCase()) || 
         { count: 0, submissions: 0 };
};

export const calculatePercentage = (solved, total) => {
  return total > 0 ? Math.round((solved / total) * 100) : 0;
};

export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const getDifficultyColor = (difficulty) => {
  return DIFFICULTY_COLORS[difficulty.toLowerCase()] || '#6b7280';
};

export const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    return 'Invalid date';
  }
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const generateLeetCodeUrl = (username) => {
  return `https://leetcode.com/${username}/`;
};

export const sortUsersByRank = (users) => {
  return users.sort((a, b) => (a.ranking || Infinity) - (b.ranking || Infinity));
};

export const getProgressColor = (percentage) => {
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 50) return 'text-yellow-600';
  return 'text-red-600';
};
