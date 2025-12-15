import React, { useState } from 'react';
import { Users, ArrowRight, Trophy, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '../services/api';
import { validateUsername, getStatByDifficulty } from '../utils/helpers';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { StatCard } from '../components/ui/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProgressCircle from '../components/charts/ProgressCircle';
import SkillChart from '../components/charts/SkillChart';

export default function Compare() {
  const [user1, setUser1] = useState('');
  const [user2, setUser2] = useState('');
  const [compareData, setCompareData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useApp();

  const handleCompare = async (e) => {
    e.preventDefault();
    
    const validation1 = validateUsername(user1);
    const validation2 = validateUsername(user2);

    if (!validation1.isValid) {
      toast.error(`User 1: ${validation1.error}`);
      return;
    }

    if (!validation2.isValid) {
      toast.error(`User 2: ${validation2.error}`);
      return;
    }

    if (user1.trim().toLowerCase() === user2.trim().toLowerCase()) {
      toast.error('Please enter different usernames');
      return;
    }

    setIsLoading(true);
    
    try {
      const data = await api.compareUsers(user1.trim(), user2.trim());
      setCompareData(data);
      toast.success('Comparison completed!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fillFromHistory = (index) => {
    if (state.searchHistory.length > index) {
      if (index === 0) {
        setUser1(state.searchHistory[index]);
      } else {
        setUser2(state.searchHistory[index]);
      }
    }
  };

  const renderUserComparison = () => {
    if (!compareData) return null;

    const userData1 = compareData.user1.matchedUser;
    const userData2 = compareData.user2.matchedUser;
    const allQuestions = compareData.allQuestionsCount;

    const getComparisonData = (user) => {
      const stats = user.submitStats;
      const easy = getStatByDifficulty(stats.acSubmissionNum, "easy");
      const medium = getStatByDifficulty(stats.acSubmissionNum, "medium");
      const hard = getStatByDifficulty(stats.acSubmissionNum, "hard");
      const total = getStatByDifficulty(stats.acSubmissionNum, "all");
      
      return { easy, medium, hard, total, stats };
    };

    const user1Data = getComparisonData(userData1);
    const user2Data = getComparisonData(userData2);

    const easyTotal = getStatByDifficulty(allQuestions, "easy").count;
    const mediumTotal = getStatByDifficulty(allQuestions, "medium").count;
    const hardTotal = getStatByDifficulty(allQuestions, "hard").count;

    return (
      <div className="space-y-8">
        {/* User Headers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[userData1, userData2].map((user, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={user.profile.userAvatar || '/api/placeholder/80/80'}
                  alt={user.username}
                  className="w-20 h-20 rounded-full border-4 border-indigo-200"
                />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{user.username}</h3>
                  {user.profile.realName && (
                    <p className="text-gray-600">{user.profile.realName}</p>
                  )}
                  {user.profile.ranking && (
                    <p className="text-sm text-gray-500">
                      Rank #{user.profile.ranking.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Quick Comparison</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Total Solved</div>
              <div className="flex justify-between items-center">
                <span className={`text-xl font-bold ${user1Data.total.count > user2Data.total.count ? 'text-green-600' : 'text-gray-600'}`}>
                  {user1Data.total.count}
                </span>
                <span className="text-gray-400">vs</span>
                <span className={`text-xl font-bold ${user2Data.total.count > user1Data.total.count ? 'text-green-600' : 'text-gray-600'}`}>
                  {user2Data.total.count}
                </span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Global Ranking</div>
              <div className="flex justify-between items-center">
                <span className={`text-xl font-bold ${(userData1.profile.ranking || Infinity) < (userData2.profile.ranking || Infinity) ? 'text-green-600' : 'text-gray-600'}`}>
                  {userData1.profile.ranking ? `#${userData1.profile.ranking.toLocaleString()}` : 'N/A'}
                </span>
                <span className="text-gray-400">vs</span>
                <span className={`text-xl font-bold ${(userData2.profile.ranking || Infinity) < (userData1.profile.ranking || Infinity) ? 'text-green-600' : 'text-gray-600'}`}>
                  {userData2.profile.ranking ? `#${userData2.profile.ranking.toLocaleString()}` : 'N/A'}
                </span>
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Hard Problems</div>
              <div className="flex justify-between items-center">
                <span className={`text-xl font-bold ${user1Data.hard.count > user2Data.hard.count ? 'text-green-600' : 'text-gray-600'}`}>
                  {user1Data.hard.count}
                </span>
                <span className="text-gray-400">vs</span>
                <span className={`text-xl font-bold ${user2Data.hard.count > user1Data.hard.count ? 'text-green-600' : 'text-gray-600'}`}>
                  {user2Data.hard.count}
                </span>
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Acceptance Rate</div>
              <div className="flex justify-between items-center">
                {(() => {
                  const rate1 = Math.round((user1Data.total.count / getStatByDifficulty(user1Data.stats.totalSubmissionNum, "all").submissions) * 100);
                  const rate2 = Math.round((user2Data.total.count / getStatByDifficulty(user2Data.stats.totalSubmissionNum, "all").submissions) * 100);
                  return (
                    <>
                      <span className={`text-xl font-bold ${rate1 > rate2 ? 'text-green-600' : 'text-gray-600'}`}>
                        {rate1}%
                      </span>
                      <span className="text-gray-400">vs</span>
                      <span className={`text-xl font-bold ${rate2 > rate1 ? 'text-green-600' : 'text-gray-600'}`}>
                        {rate2}%
                      </span>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Circles Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Problem Difficulty Breakdown</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User 1 */}
            <div>
              <h4 className="text-lg font-semibold text-center mb-6 text-indigo-600">{userData1.username}</h4>
              <div className="grid grid-cols-3 gap-4">
                <ProgressCircle
                  solved={user1Data.easy.count}
                  total={easyTotal}
                  difficulty="easy"
                  size={100}
                />
                <ProgressCircle
                  solved={user1Data.medium.count}
                  total={mediumTotal}
                  difficulty="medium"
                  size={100}
                />
                <ProgressCircle
                  solved={user1Data.hard.count}
                  total={hardTotal}
                  difficulty="hard"
                  size={100}
                />
              </div>
            </div>

            {/* User 2 */}
            <div>
              <h4 className="text-lg font-semibold text-center mb-6 text-purple-600">{userData2.username}</h4>
              <div className="grid grid-cols-3 gap-4">
                <ProgressCircle
                  solved={user2Data.easy.count}
                  total={easyTotal}
                  difficulty="easy"
                  size={100}
                />
                <ProgressCircle
                  solved={user2Data.medium.count}
                  total={mediumTotal}
                  difficulty="medium"
                  size={100}
                />
                <ProgressCircle
                  solved={user2Data.hard.count}
                  total={hardTotal}
                  difficulty="hard"
                  size={100}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Skills Comparison */}
        {userData1.tagProblemCounts?.advanced && userData2.tagProblemCounts?.advanced && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Skills Comparison</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <SkillChart 
                data={userData1.tagProblemCounts.advanced.slice(0, 8)} 
                title={`${userData1.username}'s Top Skills`}
              />
              <SkillChart 
                data={userData2.tagProblemCounts.advanced.slice(0, 8)} 
                title={`${userData2.username}'s Top Skills`}
              />
            </div>
          </div>
        )}

        {/* Winner Declaration */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg p-8 text-center">
          <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
          <h3 className="text-2xl font-bold mb-4">Comparison Summary</h3>
          {(() => {
            const score1 = user1Data.total.count + (userData1.profile.ranking ? (100000 - userData1.profile.ranking) / 1000 : 0);
            const score2 = user2Data.total.count + (userData2.profile.ranking ? (100000 - userData2.profile.ranking) / 1000 : 0);
            
            if (score1 > score2) {
              return <p className="text-xl">{userData1.username} has the edge with more problems solved!</p>;
            } else if (score2 > score1) {
              return <p className="text-xl">{userData2.username} has the edge with more problems solved!</p>;
            } else {
              return <p className="text-xl">It's a close match! Both users are performing excellently!</p>;
            }
          })()}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-indigo-100 rounded-full">
            <Users className="h-12 w-12 text-indigo-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Compare LeetCode Users</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          See how two users stack up against each other with detailed side-by-side comparisons
        </p>
      </div>

      {/* Comparison Form */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <form onSubmit={handleCompare} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <Input
                label="First User"
                value={user1}
                onChange={(e) => setUser1(e.target.value)}
                placeholder="Enter first username"
                disabled={isLoading}
              />
              {state.searchHistory.length > 0 && (
                <button
                  type="button"
                  onClick={() => fillFromHistory(0)}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Use: {state.searchHistory[0]}
                </button>
              )}
            </div>

            <div>
              <Input
                label="Second User"
                value={user2}
                onChange={(e) => setUser2(e.target.value)}
                placeholder="Enter second username"
                disabled={isLoading}
              />
              {state.searchHistory.length > 1 && (
                <button
                  type="button"
                  onClick={() => fillFromHistory(1)}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Use: {state.searchHistory[1]}
                </button>
              )}
            </div>
          </div>

          <div className="text-center">
            <Button
              type="submit"
              disabled={isLoading}
              loading={isLoading}
              size="lg"
              className="w-full md:w-auto"
            >
              {!isLoading && <TrendingUp className="h-5 w-5 mr-2" />}
              Compare Users
            </Button>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-16">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-600">Comparing users...</p>
        </div>
      )}

      {/* Comparison Results */}
      {renderUserComparison()}

      {/* Quick Tips */}
      {!compareData && !isLoading && (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div>
              <div className="font-medium mb-2">📊 Detailed Analysis</div>
              <p>Compare problem-solving patterns, difficulty preferences, and skill distributions</p>
            </div>
            <div>
              <div className="font-medium mb-2">🏆 Fair Comparison</div>
              <p>Rankings, acceptance rates, and problem counts are all considered in the analysis</p>
            </div>
            <div>
              <div className="font-medium mb-2">📈 Visual Insights</div>
              <p>Beautiful charts and graphs make it easy to understand the differences</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
