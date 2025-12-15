import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Award, Target, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { StatCard } from '../components/ui/Card';
import Button from '../components/ui/Button';
import TrendChart from '../components/charts/TrendChart';
import SkillChart from '../components/charts/SkillChart';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('all');
  const { state } = useApp();

  useEffect(() => {
    if (state.searchHistory.length > 0) {
      generateAnalytics();
    }
  }, [state.searchHistory, timeRange]);

  const generateAnalytics = async () => {
    setIsLoading(true);
    try {
      // Simulate analytics data generation
      // In a real app, this would fetch from your backend
      const mockAnalytics = generateMockAnalytics();
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error generating analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockAnalytics = () => {
    // Generate mock trend data
    const trendData = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
      problems: Math.floor(Math.random() * 50) + 100 + i * 2,
      users: Math.floor(Math.random() * 20) + 50 + i,
    }));

    // Generate popular skills data
    const skillsData = [
      { tagName: 'Array', problemsSolved: 245 },
      { tagName: 'String', problemsSolved: 198 },
      { tagName: 'Hash Table', problemsSolved: 167 },
      { tagName: 'Dynamic Programming', problemsSolved: 145 },
      { tagName: 'Tree', problemsSolved: 134 },
      { tagName: 'Depth-First Search', problemsSolved: 123 },
      { tagName: 'Binary Search', problemsSolved: 112 },
      { tagName: 'Greedy', problemsSolved: 98 },
      { tagName: 'Two Pointers', problemsSolved: 87 },
      { tagName: 'Sliding Window', problemsSolved: 76 },
    ];

    // Generate difficulty distribution
    const difficultyData = [
      { difficulty: 'Easy', count: 1245, percentage: 45 },
      { difficulty: 'Medium', count: 1098, percentage: 40 },
      { difficulty: 'Hard', count: 412, percentage: 15 },
    ];

    return {
      totalUsers: state.searchHistory.length * 157,
      totalProblems: 234567,
      avgSolved: 187,
      topPerformers: 1234,
      trendData,
      skillsData,
      difficultyData,
      monthlyGrowth: 23.5,
      weeklyActive: 5687,
    };
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-600">Generating analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-indigo-100 rounded-full">
            <BarChart3 className="h-12 w-12 text-indigo-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">LeetCode Analytics</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Comprehensive insights and trends from the LeetCode community
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
          {[
            { key: 'week', label: '7 Days' },
            { key: 'month', label: '30 Days' },
            { key: 'quarter', label: '3 Months' },
            { key: 'all', label: 'All Time' },
          ].map((range) => (
            <button
              key={range.key}
              onClick={() => setTimeRange(range.key)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                timeRange === range.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {analytics ? (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users Tracked"
              value={analytics.totalUsers.toLocaleString()}
              subtitle={`+${analytics.monthlyGrowth}% this month`}
              icon={Users}
              gradient="from-blue-500 to-indigo-600"
            />
            <StatCard
              title="Problems in Database"
              value={analytics.totalProblems.toLocaleString()}
              subtitle="Across all difficulties"
              icon={Target}
              gradient="from-green-500 to-teal-600"
            />
            <StatCard
              title="Average Problems Solved"
              value={analytics.avgSolved}
              subtitle="Per active user"
              icon={TrendingUp}
              gradient="from-yellow-500 to-orange-600"
            />
            <StatCard
              title="Top Performers"
              value={analytics.topPerformers.toLocaleString()}
              subtitle="500+ problems solved"
              icon={Award}
              gradient="from-purple-500 to-pink-600"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Usage Trend */}
            <TrendChart
              data={analytics.trendData}
              title="Platform Usage Trend"
              xKey="date"
              yKey="users"
              color="#6366f1"
            />

            {/* Problem Solving Trend */}
            <TrendChart
              data={analytics.trendData}
              title="Problems Solved Trend"
              xKey="date"
              yKey="problems"
              color="#059669"
            />
          </div>

          {/* Skills Analysis */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <SkillChart
              data={analytics.skillsData}
              title="Most Popular Problem Categories"
            />

            {/* Difficulty Distribution */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Difficulty Distribution</h3>
              <div className="space-y-4">
                {analytics.difficultyData.map((item, index) => {
                  const colors = ['bg-green-500', 'bg-yellow-500', 'bg-red-500'];
                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-16 text-sm font-medium text-gray-700">
                        {item.difficulty}
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-200 rounded-full h-6">
                          <div
                            className={`${colors[index]} h-6 rounded-full flex items-center justify-end pr-3 text-white text-sm font-medium transition-all duration-1000`}
                            style={{ width: `${item.percentage}%` }}
                          >
                            {item.percentage}%
                          </div>
                        </div>
                      </div>
                      <div className="w-20 text-sm text-gray-600 text-right">
                        {item.count.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Additional Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Calendar className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Daily Active Users</h3>
              <p className="text-3xl font-bold text-indigo-600 mb-2">{analytics.weeklyActive.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Average weekly activity</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Growth Rate</h3>
              <p className="text-3xl font-bold text-green-600 mb-2">+{analytics.monthlyGrowth}%</p>
              <p className="text-sm text-gray-600">Monthly user growth</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Award className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Success Rate</h3>
              <p className="text-3xl font-bold text-yellow-600 mb-2">67%</p>
              <p className="text-sm text-gray-600">Average acceptance rate</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Want More Detailed Analytics?</h3>
            <p className="text-xl mb-6 text-indigo-100">
              Get personalized insights for your coding journey
            </p>
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-indigo-600 hover:bg-indigo-50"
            >
              Get Premium Analytics
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <BarChart3 className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-4">No Data Available</h3>
          <p className="text-gray-600 mb-8">
            Search for some users first to generate analytics insights
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Start Searching Users
          </Button>
        </div>
      )}
    </div>
  );
}
