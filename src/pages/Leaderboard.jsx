import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Crown, TrendingUp, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { formatNumber } from '../utils/helpers';
import { UserCard } from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { state, dispatch } = useApp();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      const data = await api.getLeaderboard();
      setLeaderboard(data);
      dispatch({ type: 'SET_LEADERBOARD', payload: data });
    } catch (error) {
      toast.error('Failed to fetch leaderboard');
      console.error('Leaderboard error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default:
        return 'bg-gradient-to-r from-indigo-500 to-purple-600';
    }
  };

  const filteredLeaderboard = leaderboard.filter(user => {
    switch (filter) {
      case 'top10':
        return leaderboard.indexOf(user) < 10;
      case 'top50':
        return leaderboard.indexOf(user) < 50;
      case 'favorites':
        return state.favorites.includes(user.username);
      default:
        return true;
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-yellow-100 rounded-full">
            <Trophy className="h-12 w-12 text-yellow-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Global Leaderboard</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          See how you rank against other developers in the LeetMetric community
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
          {[
            { key: 'all', label: 'All Users', icon: Users },
            { key: 'top10', label: 'Top 10', icon: Crown },
            { key: 'top50', label: 'Top 50', icon: Trophy },
            { key: 'favorites', label: 'Favorites', icon: Award },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === tab.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-16">
          <Trophy className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-4">No Leaderboard Data</h3>
          <p className="text-gray-600 mb-8">
            The leaderboard will populate as users search for profiles
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Search Users to Build Leaderboard
          </Button>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {filter === 'all' && leaderboard.length >= 3 && (
            <div className="mb-12">
              <div className="flex justify-center items-end space-x-4 mb-8">
                {/* Second Place */}
                <div className="text-center">
                  <div className="bg-gradient-to-r from-gray-300 to-gray-500 text-white rounded-xl p-6 mb-4 relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Medal className="h-8 w-8 text-gray-400" />
                    </div>
                    <img
                      src={leaderboard[1]?.avatar || '/api/placeholder/80/80'}
                      alt={leaderboard[1]?.username}
                      className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
                    />
                    <h3 className="text-xl font-bold">{leaderboard[1]?.username}</h3>
                    <p className="text-lg">{formatNumber(leaderboard[1]?.totalSolved)} problems</p>
                  </div>
                  <div className="bg-gray-300 h-24 rounded-t-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-700">2</span>
                  </div>
                </div>

                {/* First Place */}
                <div className="text-center">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-xl p-8 mb-4 relative">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Crown className="h-10 w-10 text-yellow-300" />
                    </div>
                    <img
                      src={leaderboard[0]?.avatar || '/api/placeholder/90/90'}
                      alt={leaderboard?.username}
                      className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
                    />
                    <h3 className="text-2xl font-bold">{leaderboard[0]?.username}</h3>
                    <p className="text-xl">{formatNumber(leaderboard?.totalSolved)} problems</p>
                  </div>
                  <div className="bg-yellow-400 h-32 rounded-t-lg flex items-center justify-center">
                    <span className="text-3xl font-bold text-yellow-800">1</span>
                  </div>
                </div>

                {/* Third Place */}
                <div className="text-center">
                  <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-xl p-6 mb-4 relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Award className="h-8 w-8 text-amber-300" />
                    </div>
                    <img
                      src={leaderboard[2]?.avatar || '/api/placeholder/80/80'}
                      alt={leaderboard[2]?.username}
                      className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
                    />
                    <h3 className="text-xl font-bold">{leaderboard[2]?.username}</h3>
                    <p className="text-lg">{formatNumber(leaderboard[2]?.totalSolved)} problems</p>
                  </div>
                  <div className="bg-amber-400 h-20 rounded-t-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-amber-800">3</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard List */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Rankings ({filteredLeaderboard.length} users)
              </h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {filteredLeaderboard.map((user, index) => {
                const actualRank = leaderboard.indexOf(user) + 1;
                return (
                  <div
                    key={user.username}
                    className={`p-6 hover:bg-gray-50 transition-colors ${
                      actualRank <= 3 ? getRankColor(actualRank) + ' text-white hover:opacity-90' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getRankIcon(actualRank)}
                        </div>
                        
                        <img
                          src={user.avatar || '/api/placeholder/50/50'}
                          alt={user.username}
                          className="w-12 h-12 rounded-full border-2 border-gray-200"
                        />
                        
                        <div>
                          <h4 className={`text-lg font-semibold ${actualRank <= 3 ? 'text-white' : 'text-gray-900'}`}>
                            {user.username}
                          </h4>
                          <p className={`text-sm ${actualRank <= 3 ? 'text-white opacity-90' : 'text-gray-600'}`}>
                            Last updated: {new Date(user.lastUpdated).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${actualRank <= 3 ? 'text-white' : 'text-indigo-600'}`}>
                          {formatNumber(user.totalSolved)}
                        </div>
                        <div className={`text-sm ${actualRank <= 3 ? 'text-white opacity-90' : 'text-gray-600'}`}>
                          problems solved
                        </div>
                        {user.ranking && (
                          <div className={`text-xs ${actualRank <= 3 ? 'text-white opacity-80' : 'text-gray-500'}`}>
                            LeetCode Rank: #{user.ranking.toLocaleString()}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {state.favorites.includes(user.username) && (
                          <Award className={`h-5 w-5 ${actualRank <= 3 ? 'text-white' : 'text-yellow-500'}`} />
                        )}
                        <Button
                          variant={actualRank <= 3 ? 'secondary' : 'outline'}
                          size="sm"
                          onClick={() => window.location.href = `/profile/${user.username}`}
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Solved</h3>
              <p className="text-3xl font-bold text-green-600">
                {Math.round(leaderboard.reduce((sum, user) => sum + user.totalSolved, 0) / leaderboard.length)}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-blue-600">{leaderboard.length}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Trophy className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Top Score</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {leaderboard.length > 0 ? formatNumber(leaderboard[0].totalSolved) : '0'}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
