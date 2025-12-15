import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Award, Calendar, ExternalLink, Heart, Share2, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { getStatByDifficulty, generateLeetCodeUrl } from '../utils/helpers';
import { PageLoadingSpinner } from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ProgressCircle from '../components/charts/ProgressCircle';
import SkillChart, { HorizontalSkillChart } from '../components/charts/SkillChart';
import { StatCard } from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Profile() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { state, dispatch } = useApp();

  useEffect(() => {
    fetchUserData();
  }, [username]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.fetchUser(username);
      setUserData(data.data);
      dispatch({ type: 'SET_CURRENT_USER', payload: data.data.matchedUser });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToFavorites = () => {
    dispatch({ type: 'ADD_TO_FAVORITES', payload: username });
    toast.success(`${username} added to favorites!`);
  };

  const handleRemoveFromFavorites = () => {
    dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: username });
    toast.success(`${username} removed from favorites!`);
  };

  const isFavorited = state.favorites.includes(username);

  if (isLoading) return <PageLoadingSpinner />;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <ErrorMessage 
          message={error} 
          onRetry={fetchUserData}
          className="max-w-md mx-auto"
        />
      </div>
    );
  }

  if (!userData || !userData.matchedUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">User not found</h2>
        <p className="text-gray-600 mb-8">Please check the username and try again.</p>
        <Link to="/">
          <Button>Search Another User</Button>
        </Link>
      </div>
    );
  }

  const user = userData.matchedUser;
  const stats = user.submitStats;
  const allQuestions = userData.allQuestionsCount;

  const easyStats = getStatByDifficulty(stats.acSubmissionNum, "easy");
  const mediumStats = getStatByDifficulty(stats.acSubmissionNum, "medium");
  const hardStats = getStatByDifficulty(stats.acSubmissionNum, "hard");
  const totalStats = getStatByDifficulty(stats.acSubmissionNum, "all");

  const easyTotal = getStatByDifficulty(allQuestions, "easy").count;
  const mediumTotal = getStatByDifficulty(allQuestions, "medium").count;
  const hardTotal = getStatByDifficulty(allQuestions, "hard").count;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16"></div>
        
        <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
          <div className="relative">
            <img
              src={user.profile.userAvatar || '/api/placeholder/120/120'}
              alt={`${user.username}'s avatar`}
              className="w-32 h-32 rounded-full border-4 border-indigo-200 shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
          
          <div className="flex-1 text-center lg:text-left">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{user.username}</h1>
                {user.profile.realName && (
                  <p className="text-xl text-gray-600 mb-2">{user.profile.realName}</p>
                )}
                {user.profile.ranking && (
                  <div className="flex items-center justify-center lg:justify-start mb-4">
                    <Award className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="text-lg text-gray-600">
                      Global Ranking: <span className="font-semibold text-indigo-600">#{user.profile.ranking.toLocaleString()}</span>
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant={isFavorited ? "danger" : "outline"}
                  onClick={isFavorited ? handleRemoveFromFavorites : handleAddToFavorites}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
                  {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>
                
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                
                <a
                  href={generateLeetCodeUrl(user.username)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on LeetCode
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-indigo-600">{totalStats.count}</div>
                <div className="text-sm text-gray-600">Problems Solved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{easyStats.count}</div>
                <div className="text-sm text-gray-600">Easy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{mediumStats.count}</div>
                <div className="text-sm text-gray-600">Medium</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{hardStats.count}</div>
                <div className="text-sm text-gray-600">Hard</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress and Stats Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        {/* Progress Circles */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Problem Solving Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ProgressCircle
              solved={easyStats.count}
              total={easyTotal}
              difficulty="easy"
              animated
            />
            <ProgressCircle
              solved={mediumStats.count}
              total={mediumTotal}
              difficulty="medium"
              animated
            />
            <ProgressCircle
              solved={hardStats.count}
              total={hardTotal}
              difficulty="hard"
              animated
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <StatCard
            title="Total Submissions"
            value={getStatByDifficulty(stats.totalSubmissionNum, "all").submissions.toLocaleString()}
            gradient="from-blue-500 to-purple-600"
          />
          <StatCard
            title="Acceptance Rate"
            value={`${Math.round((totalStats.count / getStatByDifficulty(stats.totalSubmissionNum, "all").submissions) * 100)}%`}
            gradient="from-green-500 to-teal-600"
          />
          <StatCard
            title="Easy Acceptance"
            value={`${Math.round((easyStats.count / getStatByDifficulty(stats.totalSubmissionNum, "easy").submissions) * 100)}%`}
            gradient="from-green-400 to-green-600"
          />
          <StatCard
            title="Hard Solved"
            value={`${hardStats.count}/${hardTotal}`}
            gradient="from-red-400 to-red-600"
          />
        </div>
      </div>

      {/* Skills Analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Programming Languages */}
        {user.languageProblemCount && user.languageProblemCount.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Programming Languages</h3>
            <div className="space-y-4">
              {user.languageProblemCount.slice(0, 8).map((lang, index) => {
                const maxProblems = Math.max(...user.languageProblemCount.map(l => l.problemsSolved));
                const percentage = (lang.problemsSolved / maxProblems) * 100;
                
                return (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-20 text-sm font-medium text-gray-700">
                      {lang.languageName}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-12 text-sm text-gray-600 text-right font-medium">
                      {lang.problemsSolved}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Problem Categories */}
        {user.tagProblemCounts && user.tagProblemCounts.advanced && (
          <HorizontalSkillChart 
            data={user.tagProblemCounts.advanced} 
            title="Problem Categories"
          />
        )}
      </div>

      {/* Detailed Skills Chart */}
      {user.tagProblemCounts && user.tagProblemCounts.advanced && (
        <div className="mb-8">
          <SkillChart 
            data={user.tagProblemCounts.advanced.slice(0, 15)} 
            title="Detailed Skills Analysis"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="text-center">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/compare">
            <Button size="lg" className="w-full sm:w-auto">
              Compare with Others
            </Button>
          </Link>
          <Link to="/analytics">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              View Analytics
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
