import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Medal, TrendingUp, GitCommit } from 'lucide-react';
import { ApiService } from '../services/api';
import GlassCard from '../components/ui/GlassCard';

// Helper to generate the heatmap blocks
const Heatmap = ({ calendarData }) => {
  if (!calendarData || !calendarData.submissionCalendar) return null;
  
  const parsed = JSON.parse(calendarData.submissionCalendar);
  const timestamps = Object.keys(parsed).sort((a, b) => Number(a) - Number(b));
  
  if (timestamps.length === 0) {
    return <div className="text-lavender">No activity found for this year.</div>;
  }

  // Generate an array of 365 days (simplified for display purposes)
  // We'll map the parsed timestamp keys into a grid
  const days = [];
  const maxVal = Math.max(...Object.values(parsed), 1);
  
  // Just show the most recent 180 active timestamp blocks for a clean layout
  const recentStamps = timestamps.slice(-180);
  
  return (
    <div>
      <div className="flex gap-4 mb-4 text-sm text-lavender">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-surface-dark border border-white/5"></span>
          <span>0</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-cyan-electric/30"></span>
          <span>1-3</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-cyan-electric/70"></span>
          <span>4-6</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-cyan-electric shadow-glow"></span>
          <span>7+</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1">
        {recentStamps.map(ts => {
          const count = parsed[ts];
          let bgClass = "bg-surface-dark border border-white/5";
          if (count > 0 && count <= 3) bgClass = "bg-cyan-electric/30";
          else if (count > 3 && count <= 6) bgClass = "bg-cyan-electric/70";
          else if (count > 6) bgClass = "bg-cyan-electric shadow-glow";
          
          return (
            <div 
              key={ts} 
              className={`w-4 h-4 rounded-sm ${bgClass}`}
              title={`${new Date(Number(ts) * 1000).toLocaleDateString()}: ${count} submissions`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default function Profile() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch everything required for the new features
        const [profile, contests, calendar] = await Promise.all([
          ApiService.fetchUser(username),
          ApiService.getUserContests(username).catch(() => ({ history: [] })),
          ApiService.getUserCalendar(username).catch(() => null)
        ]);
        
        setData({ 
          profile: profile.data, 
          contests,
          calendar 
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchData();
  }, [username]);

  if (loading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-cyan-electric/20 border-t-cyan-electric rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 w-full flex items-center justify-center">
        <GlassCard className="text-center p-12 max-w-lg">
          <h2 className="text-2xl font-bold text-coral mb-4">User Not Found</h2>
          <p className="text-lavender mb-6">{error}</p>
          <a href="/" className="text-cyan-electric hover:underline">Go back home</a>
        </GlassCard>
      </div>
    );
  }

  if (!data) return null;

  const { matchedUser } = data.profile;
  const { profile, submitStats } = matchedUser;
  
  const acData = submitStats.acSubmissionNum;
  const totalSolved = acData[0].count;
  const easySolved = acData[1].count;
  const mediumSolved = acData[2].count;
  const hardSolved = acData[3].count;

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-phi-md sm:px-phi-lg py-phi-xl space-y-8">
      {/* ── Top Banner / User Info ── */}
      <GlassCard className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-electric/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <img 
            src={profile.userAvatar} 
            alt={username} 
            className="w-32 h-32 rounded-2xl border border-white/10 shadow-glow object-cover"
          />
          <div className="text-center md:text-left flex-1">
            <h1 className="text-display-md font-bold text-offwhite mb-2">{matchedUser.username}</h1>
            {profile.realName && <p className="text-lavender text-lg mb-4">{profile.realName}</p>}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="px-4 py-2 rounded-full bg-surface-dark border border-white/5 font-mono text-sm flex items-center gap-2">
                <Medal className="w-4 h-4 text-amber-solar" />
                Rank: <span className="text-amber-solar">{profile.ranking?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="px-4 py-2 rounded-full bg-surface-dark border border-white/5 font-mono text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-phosphor" />
                Contest Rating: <span className="text-phosphor">{data.contests?.current_rating ? Math.round(data.contests.current_rating) : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── Left Column: Problem Solving ── */}
        <div className="col-span-1 space-y-8">
          <GlassCard raised className="text-center">
            <h3 className="text-lg font-bold text-lavender mb-6">Problems Solved</h3>
            <div className="relative w-48 h-48 mx-auto mb-6 flex items-center justify-center rounded-full border-[8px] border-surface-dark">
              <div>
                <div className="text-4xl font-display font-bold text-offwhite text-glow">{totalSolved}</div>
                <div className="text-sm text-lavender mt-1">Total</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-surface-dark rounded-xl p-4 flex justify-between items-center border border-white/5">
                <span className="text-[#00b8a3] font-medium">Easy</span>
                <span className="font-mono text-offwhite">{easySolved}</span>
              </div>
              <div className="bg-surface-dark rounded-xl p-4 flex justify-between items-center border border-white/5">
                <span className="text-[#ffc01e] font-medium">Medium</span>
                <span className="font-mono text-offwhite">{mediumSolved}</span>
              </div>
              <div className="bg-surface-dark rounded-xl p-4 flex justify-between items-center border border-white/5">
                <span className="text-[#ff375f] font-medium">Hard</span>
                <span className="font-mono text-offwhite">{hardSolved}</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* ── Right Column: New Features (Heatmap + Contests) ── */}
        <div className="col-span-1 lg:col-span-2 space-y-8">
          
          {/* Heatmap / Activity Calendar */}
          <GlassCard className="min-h-[200px]">
            <h3 className="text-lg font-bold text-lavender mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-electric" />
              Submission Heatmap
            </h3>
            
            {data.calendar ? (
               <div className="w-full overflow-x-auto pb-4">
                 <Heatmap calendarData={data.calendar} />
               </div>
            ) : (
               <div className="text-center py-10 text-lavender/50 italic">
                 No heatmap data available.
               </div>
            )}
          </GlassCard>

          {/* Contest History */}
          <GlassCard className="min-h-[300px]">
             <h3 className="text-lg font-bold text-lavender mb-6 flex items-center gap-2">
               <GitCommit className="w-5 h-5 text-coral" />
               Recent Contests
             </h3>
             
             {data.contests?.history && data.contests.history.length > 0 ? (
               <div className="space-y-4">
                 {data.contests.history.slice(0, 5).map((contest, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                     className="bg-surface-dark border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/20 transition-colors"
                   >
                     <div>
                       <h4 className="text-offwhite font-medium">{contest.contest_name}</h4>
                       <p className="text-sm text-lavender mt-1">
                         {new Date(contest.attended_at).toLocaleDateString()} • Ranked {contest.ranking}
                       </p>
                     </div>
                     <div className="flex gap-4 text-center">
                       <div>
                         <div className="text-xs text-lavender uppercase">Solved</div>
                         <div className="font-mono text-offwhite">{contest.problems_solved} / {contest.total_problems}</div>
                       </div>
                       <div>
                         <div className="text-xs text-lavender uppercase">Rating</div>
                         <div className="font-mono text-phosphor">{Math.round(contest.rating)}</div>
                       </div>
                     </div>
                   </motion.div>
                 ))}
               </div>
             ) : (
               <div className="text-center py-20 text-lavender/50 italic">
                 Has not participated in any recent contests.
               </div>
             )}
          </GlassCard>

        </div>
      </div>
    </div>
  );
}
