import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Check, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ApiService } from '../services/api';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import toast from 'react-hot-toast';

export default function Goals() {
  const { state } = useApp();
  const { currentUser } = state;
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create Goal Form State
  const [isCreating, setIsCreating] = useState(false);
  const [goalType, setGoalType] = useState('daily');
  const [targetCount, setTargetCount] = useState(1);
  const [difficulty, setDifficulty] = useState('any');

  const fetchGoals = async () => {
    if (!currentUser) return;
    try {
      const data = await ApiService.getGoals(currentUser.uid);
      setGoals(data);
    } catch (err) {
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [currentUser]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await ApiService.createGoal({
        firebase_uid: currentUser.uid,
        goal_type: goalType,
        target_count: Number(targetCount),
        difficulty: difficulty === 'any' ? null : difficulty,
      });
      toast.success('Goal created!');
      setIsCreating(false);
      fetchGoals();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleComplete = async (goalId) => {
    try {
      await ApiService.completeGoal(goalId);
      toast.success('Goal Completed! Keep up the streak 🔥', { icon: '👏' });
      fetchGoals();
    } catch (err) {
      toast.error('Could not update goal');
    }
  };

  if (!currentUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <Target className="w-16 h-16 text-lavender mb-4" />
        <h2 className="text-2xl font-bold text-offwhite mb-2">Sign in to track goals</h2>
        <p className="text-lavender">Set daily and weekly problem-solving targets.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-phi-md sm:px-phi-lg py-phi-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-display-md font-bold flex items-center gap-4">
            <div className="p-3 bg-coral/10 text-coral rounded-xl shadow-[0_0_20px_rgba(255,77,106,0.15)]">
              <Flame className="w-6 h-6" />
            </div>
            Active Goals
          </h1>
          <p className="text-lavender mt-2">Build an unbreakable consistency streak.</p>
        </div>
        {!isCreating && (
          <GlowButton variant="accent" onClick={() => setIsCreating(true)}>
            <Plus className="w-5 h-5" /> New Target
          </GlowButton>
        )}
      </div>

      {isCreating && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <GlassCard raised>
            <h3 className="text-xl font-bold mb-6 text-offwhite">Set New Target</h3>
            <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="w-full sm:w-1/4">
                <label className="block text-sm text-lavender mb-2">Type</label>
                <select 
                  value={goalType} onChange={e => setGoalType(e.target.value)}
                  className="w-full bg-surface-dark border border-white/10 rounded-lg p-3 text-offwhite focus:outline-none focus:border-cyan-electric/50"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <div className="w-full sm:w-1/4">
                <label className="block text-sm text-lavender mb-2">Problems</label>
                <input 
                  type="number" min="1" max="100" 
                  value={targetCount} onChange={e => setTargetCount(e.target.value)}
                  className="w-full bg-surface-dark border border-white/10 rounded-lg p-3 text-offwhite focus:outline-none focus:border-cyan-electric/50"
                />
              </div>
              <div className="w-full sm:w-1/4">
                <label className="block text-sm text-lavender mb-2">Difficulty (Optional)</label>
                <select 
                  value={difficulty} onChange={e => setDifficulty(e.target.value)}
                  className="w-full bg-surface-dark border border-white/10 rounded-lg p-3 text-offwhite focus:outline-none focus:border-cyan-electric/50"
                >
                  <option value="any">Any Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="w-full sm:w-1/4 flex gap-2">
                <GlowButton type="button" variant="secondary" onClick={() => setIsCreating(false)} className="flex-1">
                  Cancel
                </GlowButton>
                <GlowButton type="submit" variant="primary" className="flex-1">
                  Save
                </GlowButton>
              </div>
            </form>
          </GlassCard>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-cyan-electric/20 border-t-cyan-electric rounded-full animate-spin" />
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
          <Target className="w-12 h-12 text-lavender mx-auto mb-4 opacity-50" />
          <p className="text-lavender text-lg">No active goals. Time to set a challenge.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal, idx) => (
            <GlassCard key={goal.id} animated delay={idx * 0.1} className="relative group">
              <div className="absolute top-4 right-4 px-2 py-1 bg-white/5 rounded text-xs text-lavender uppercase tracking-wider">
                {goal.goal_type}
              </div>
              <div className="text-4xl font-display font-bold text-offwhite mt-4 mb-2">
                {goal.target_count} <span className="text-lg text-lavender font-body font-normal">problems</span>
              </div>
              <div className="text-sm">
                {goal.difficulty ? (
                  <span className={`capitalize ${
                    goal.difficulty === 'easy' ? 'text-[#00b8a3]' :
                    goal.difficulty === 'medium' ? 'text-[#ffc01e]' : 'text-[#ff375f]'
                  }`}>
                    {goal.difficulty} Difficulty
                  </span>
                ) : (
                  <span className="text-lavender">Any Difficulty</span>
                )}
              </div>
              <div className="mt-8">
                <GlowButton 
                  onClick={() => handleComplete(goal.id)}
                  variant="ghost" 
                  className="w-full !bg-white/5 hover:!bg-phosphor/20 hover:!text-phosphor transition-colors group-hover:border-phosphor/30 border border-transparent"
                >
                  <Check className="w-4 h-4 mr-2" /> Mark Completed
                </GlowButton>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
