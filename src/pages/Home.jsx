import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Users, Award, Code, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '../services/api';
import { validateUsername } from '../utils/helpers';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Home() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    const validation = validateUsername(username);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    setIsLoading(true);
    
    try {
      await api.fetchUser(username.trim());
      dispatch({ type: 'ADD_TO_HISTORY', payload: username.trim() });
      navigate(`/profile/${username.trim()}`);
      toast.success('User found!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <TrendingUp className="h-8 w-8 text-indigo-600" />,
      title: 'Progress Tracking',
      description: 'Monitor your solving patterns with beautiful visualizations and detailed analytics to understand your growth over time.'
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: 'User Comparison',
      description: 'Compare your performance with other developers and see where you stand in the global programming community.'
    },
    {
      icon: <Award className="h-8 w-8 text-cyan-600" />,
      title: 'Global Leaderboards',
      description: 'Compete with thousands of developers worldwide and climb the ranks in our comprehensive leaderboards.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-600">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/20">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='rgba(255,255,255,0.1)' strokeWidth='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' /%3E%3C/svg%3E")`,
            }}></div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                <Code className="h-16 w-16 text-cyan-300" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Track Your{' '}
              <span className="bg-gradient-to-r from-cyan-300 to-yellow-300 bg-clip-text text-transparent">
                LeetCode
              </span>{' '}
              Journey
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-indigo-100 max-w-3xl mx-auto leading-relaxed">
              Visualize your progress, compare with others, and get insights to improve your coding skills with our comprehensive analytics platform.
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter LeetCode username..."
                  className="w-full px-6 py-4 pr-32 text-lg rounded-full text-gray-900 bg-white/95 backdrop-blur-sm border-0 focus:ring-4 focus:ring-white/50 outline-none placeholder-gray-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-2 top-2 bottom-2 px-8 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 transition-all duration-200 flex items-center justify-center font-semibold"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" className="text-white" />
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Analyze
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Recent Searches */}
            {state.searchHistory.length > 0 && (
              <div className="max-w-2xl mx-auto">
                <p className="text-indigo-200 mb-4">Recent searches:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {state.searchHistory.slice(0, 5).map((user, index) => (
                    <button
                      key={index}
                      onClick={() => navigate(`/profile/${user}`)}
                      className="px-4 py-2 bg-white/10 rounded-full text-sm text-white hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20"
                    >
                      {user}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-cyan-300/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-yellow-300/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive analytics and insights to accelerate your coding journey and help you reach your goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gray-50 rounded-2xl p-8 hover:shadow-xl hover:bg-white transition-all duration-300 border border-gray-100"
              >
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{feature.description}</p>
                <div className="flex items-center text-indigo-600 font-medium group-hover:text-indigo-700">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Join Thousands of Developers
            </h2>
            <p className="text-xl text-gray-600">
              Already tracking their progress with LeetMetric
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { label: 'Users Tracked', value: '10,000+' },
              { label: 'Problems Analyzed', value: '2.5M+' },
              { label: 'Comparisons Made', value: '50,000+' },
              { label: 'Success Stories', value: '1,200+' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Level Up Your Coding?</h2>
          <p className="text-xl mb-8 text-indigo-100">
            Join thousands of developers who are already using LeetMetric to track their progress and achieve their coding goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.querySelector('input').focus()}
              className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-50 transition-colors duration-200"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate('/about')}
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-colors duration-200"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
