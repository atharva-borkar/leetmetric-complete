import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { ApiService } from '../services/api';
import GlassCard from '../components/ui/GlassCard';
import { Activity, Zap, Users, BrainCircuit } from 'lucide-react';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const stats = await ApiService.getPlatformAnalytics();
        setData(stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-electric/20 border-t-cyan-electric rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const difficultyData = [
    { name: 'Easy', value: data.difficulty_distribution.easy, color: '#00b8a3' },
    { name: 'Medium', value: data.difficulty_distribution.medium, color: '#ffc01e' },
    { name: 'Hard', value: data.difficulty_distribution.hard, color: '#ff375f' }
  ];

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-phi-md sm:px-phi-lg py-phi-xl">
      <div className="mb-phi-xl">
        <h1 className="text-display-md font-bold mb-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-electric/10 text-cyan-electric flex items-center justify-center shadow-glow">
            <Activity />
          </div>
          Platform Analytics
        </h1>
        <p className="text-lavender text-lg max-w-2xl">
          Real-time aggregated metrics from all developers tracked by LeetMetric.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Tracked Users', value: data.total_users_tracked, icon: <Users className="text-cyan-electric" /> },
          { title: 'Total Problems Solved', value: data.total_problems_solved.toLocaleString(), icon: <BrainCircuit className="text-phosphor" /> },
          { title: 'Average Solved / User', value: data.average_solved, icon: <Activity className="text-amber-solar" /> },
          { title: 'Top Performers (500+)', value: data.top_performers_count, icon: <Zap className="text-coral" /> }
        ].map((stat, i) => (
          <GlassCard key={i} animated delay={i * 0.1} className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              {stat.icon}
            </div>
            <div>
              <div className="text-sm text-lavender font-medium">{stat.title}</div>
              <div className="text-2xl font-display font-bold text-offwhite mt-1">{stat.value}</div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard animated delay={0.4} className="h-96 flex flex-col">
          <h3 className="text-lg font-bold mb-6 text-lavender">Difficulty Distribution</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={difficultyData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#8b95b0', fontSize: 14 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={32}>
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard animated delay={0.5} className="h-96 flex flex-col">
           <h3 className="text-lg font-bold mb-6 text-lavender">Proportion of Solved Problems</h3>
           <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={difficultyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-offwhite">{data.total_problems_solved}</div>
                <div className="text-xs text-lavender uppercase tracking-widest mt-1">Total</div>
              </div>
            </div>
           </div>
        </GlassCard>
      </div>
    </div>
  );
}
