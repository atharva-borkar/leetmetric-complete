import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Swords } from 'lucide-react';
import { ApiService } from '../services/api';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';

export default function Compare() {
  const [user1, setUser1] = useState('');
  const [user2, setUser2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!user1.trim() || !user2.trim()) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      const response = await ApiService.compareUsers(user1.trim(), user2.trim());
      setData(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const StatCompareRow = ({ label, val1, val2, invert = false }) => {
    const isTie = val1 === val2;
    const p1Wins = invert ? val1 < val2 : val1 > val2;

    return (
      <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
        <div className={`w-1/3 text-center font-mono text-lg ${!isTie && p1Wins ? 'text-phosphor text-glow-green font-bold' : 'text-lavender'}`}>
          {val1}
        </div>
        <div className="w-1/3 text-center text-sm font-medium text-offwhite uppercase tracking-wider">
          {label}
        </div>
        <div className={`w-1/3 text-center font-mono text-lg ${!isTie && !p1Wins ? 'text-phosphor text-glow-green font-bold' : 'text-lavender'}`}>
          {val2}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-phi-md sm:px-phi-lg py-phi-xl">
      <div className="text-center mb-16">
        <h1 className="text-display-md font-bold mb-4 flex items-center justify-center gap-4">
          <Swords className="w-10 h-10 text-coral" />
          Head-to-Head Compare
        </h1>
        <p className="text-lavender text-lg max-w-2xl mx-auto">
          Match up two LeetCode profiles and see who comes out on top across problem solving, consistency, and contest ratings.
        </p>
      </div>

      <GlassCard className="mb-12">
        <form onSubmit={handleCompare} className="flex flex-col md:flex-row gap-6 items-center justify-center">
          <div className="w-full md:w-1/3 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-lavender w-5 h-5" />
            <input
              type="text"
              value={user1}
              onChange={(e) => setUser1(e.target.value)}
              placeholder="Player 1 username"
              className="w-full bg-surface-dark border border-white/10 rounded-full py-3 pl-12 pr-4 text-offwhite focus:outline-none focus:border-cyan-electric/50 focus:shadow-glow transition-all"
            />
          </div>
          <div className="text-2xl font-display font-bold text-lavender italic">VS</div>
          <div className="w-full md:w-1/3 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-lavender w-5 h-5" />
            <input
              type="text"
              value={user2}
              onChange={(e) => setUser2(e.target.value)}
              placeholder="Player 2 username"
              className="w-full bg-surface-dark border border-white/10 rounded-full py-3 pl-12 pr-4 text-offwhite focus:outline-none focus:border-coral/50 focus:shadow-[0_0_20px_rgba(255,77,106,0.15)] transition-all"
            />
          </div>
          <GlowButton type="submit" loading={loading} className="w-full md:w-auto">
            Initialize Match
          </GlowButton>
        </form>
        {error && <p className="text-coral text-center mt-4">{error}</p>}
      </GlassCard>

      {data && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16"
        >
          {/* We create a full layout matching the previous Comparison aesthetic but with modern glass effects */}
          <div className="col-span-1 md:col-span-2">
            <GlassCard raised>
              {/* Profile Headers */}
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/10">
                {['user1', 'user2'].map((u, i) => {
                  const p = data[u].matchedUser.profile;
                  return (
                    <div key={u} className={`flex items-center gap-4 ${i === 1 ? 'flex-row-reverse text-right' : ''}`}>
                      <img src={p.userAvatar} alt="avatar" className="w-20 h-20 rounded-full border-2 border-white/10" />
                      <div>
                        <h3 className="text-2xl font-bold text-offwhite">{data[u].matchedUser.username}</h3>
                        <p className="text-lavender">Rank: {p.ranking?.toLocaleString() || 'N/A'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Stats Rows */}
              <div className="flex flex-col gap-2">
                <StatCompareRow 
                  label="Global Ranking" 
                  val1={data.user1.matchedUser.profile.ranking || Infinity} 
                  val2={data.user2.matchedUser.profile.ranking || Infinity} 
                  invert 
                />
                <StatCompareRow 
                  label="Total Solved" 
                  val1={data.user1.matchedUser.submitStats.acSubmissionNum[0].count} 
                  val2={data.user2.matchedUser.submitStats.acSubmissionNum[0].count} 
                />
                <StatCompareRow 
                  label="Easy Problems" 
                  val1={data.user1.matchedUser.submitStats.acSubmissionNum[1].count} 
                  val2={data.user2.matchedUser.submitStats.acSubmissionNum[1].count} 
                />
                <StatCompareRow 
                  label="Medium Problems" 
                  val1={data.user1.matchedUser.submitStats.acSubmissionNum[2].count} 
                  val2={data.user2.matchedUser.submitStats.acSubmissionNum[2].count} 
                />
                <StatCompareRow 
                  label="Hard Problems" 
                  val1={data.user1.matchedUser.submitStats.acSubmissionNum[3].count} 
                  val2={data.user2.matchedUser.submitStats.acSubmissionNum[3].count} 
                />
              </div>
            </GlassCard>
          </div>
        </motion.div>
      )}
    </div>
  );
}
