import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Award, Clock } from 'lucide-react';
import { ApiService } from '../services/api';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await ApiService.getLeaderboard(100);
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-phi-md sm:px-phi-lg py-phi-xl">
      <div className="mb-phi-xl">
        <h1 className="text-display-md font-bold mb-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-solar/10 text-amber-solar flex items-center justify-center shadow-glow-amber">
            <Trophy />
          </div>
          Global Leaderboard
        </h1>
        <p className="text-lavender text-lg max-w-2xl">
          Top performers tracked across the LeetMetric platform. Rankings are based on total problems solved.
        </p>
      </div>

      <GlassCard className="overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-cyan-electric/20 border-t-cyan-electric rounded-full animate-spin" />
            <p className="mt-4 text-lavender animate-pulse">Fetching latest rankings...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center text-coral">
            <p className="mb-4">Error loading leaderboard: {error}</p>
            <GlowButton onClick={() => window.location.reload()} variant="secondary">
              Try Again
            </GlowButton>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-lavender font-mono text-sm">
                  <th className="py-4 px-6 font-medium">Rank</th>
                  <th className="py-4 px-6 font-medium">User</th>
                  <th className="py-4 px-6 font-medium text-right">Total Solved</th>
                  <th className="py-4 px-6 font-medium text-right">Global Rank</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <motion.tr 
                    key={user.username}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <span className={`font-display font-bold text-lg ${
                        idx === 0 ? 'text-amber-solar text-glow-amber' : 
                        idx === 1 ? 'text-gray-300' : 
                        idx === 2 ? 'text-amber-700' : 'text-lavender'
                      }`}>
                        #{idx + 1}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatar_url || 'https://assets.leetcode.com/users/default_avatar.jpg'} 
                          alt={user.username}
                          className="w-10 h-10 rounded-full border border-white/10 group-hover:border-cyan-electric/50 transition-colors"
                        />
                        <a href={`/profile/${user.username}`} className="font-medium text-offwhite hover:text-cyan-electric transition-colors">
                          {user.username}
                        </a>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-mono text-phosphor">{user.total_solved}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-mono text-lavender">
                        {user.ranking ? user.ranking.toLocaleString() : '-'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
