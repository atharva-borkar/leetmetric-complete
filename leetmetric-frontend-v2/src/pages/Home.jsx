import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Activity, Users, Shield, Zap, Target, ArrowRight } from 'lucide-react';
import GlowButton from '../components/ui/GlowButton';
import GlassCard from '../components/ui/GlassCard';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    // GSAP Scroll Animations
    const ctx = gsap.context(() => {
      // Feature cards stagger in
      gsap.fromTo('.feature-card', 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.1, 
          duration: 0.8, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
          }
        }
      );

      // Stat numbers count up
      gsap.fromTo('.stat-value',
        { textContent: 0 },
        {
          textContent: (i, target) => target.getAttribute('data-value'),
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: '.stats-section',
            start: "top 75%",
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    // In actual implementation, we will validate and hit API here
    setIsLoading(true);
    setTimeout(() => {
      navigate(`/profile/${username}`);
    }, 800);
  };

  const features = [
    { icon: <Activity />, title: "Real-time Heatmaps", desc: "Visualize your submission history with dynamic, customizable grid maps." },
    { icon: <Target />, title: "Daily Goals", desc: "Set problem-solving targets and build unbreakable coding streaks." },
    { icon: <Users />, title: "Head-to-head Compare", desc: "Analyze skills, speed, and accuracy against other developers." },
    { icon: <Zap />, title: "Contest History", desc: "Track your rating changes and global rankings over time." },
  ];

  return (
    <div className="flex-1 w-full relative">
      
      {/* ── Asymmetric Hero Section ── */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <div className="absolute top-[20%] right-[10%] w-96 h-96 bg-cyan-electric/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[10%] left-[20%] w-64 h-64 bg-phosphor/10 rounded-full blur-[80px]" />
          
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgwem0yMCAyMGMtMS4xIDAtMi0uOS0yLTJzLjktMiAyLTIgMiAuOSAyIDItLjkgMi0yIDJ6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')] opacity-50" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-phi-md sm:px-phi-lg w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-phi-xl items-center">
            
            {/* Left Content (61.8% / col-span-7) */}
            <div className="lg:col-span-7 space-y-phi-md">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-electric/10 border border-cyan-electric/20 text-cyan-electric text-sm font-mono mb-6">
                  <span className="w-2 h-2 rounded-full bg-cyan-electric animate-pulse" />
                  LeetMetric v2 is Live
                </div>
                
                <h1 className="text-display-lg font-bold mb-6 text-balance">
                  Decode Your <br />
                  <span className="text-glow">Engineering</span> DNA.
                </h1>
                
                <p className="text-xl text-lavender max-w-2xl font-light leading-relaxed">
                  Move beyond basic stats. LeetMetric transforms your raw LeetCode data into 
                  beautiful, actionable insights. Track habits, analyze gaps, and dominate interviews.
                </p>
              </motion.div>

              {/* Search Bar */}
              <motion.form 
                onSubmit={handleSearch}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative max-w-xl mt-12"
              >
                <div className="gradient-border p-[1px] rounded-full">
                  <div className="relative flex items-center bg-surface-dark/80 backdrop-blur-xl rounded-full">
                    <div className="pl-6 text-lavender">
                      <Search size={20} />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter LeetCode username..."
                      className="w-full bg-transparent border-none text-offwhite placeholder-lavender/50 px-4 py-4 focus:outline-none focus:ring-0 text-lg"
                    />
                    <div className="pr-2">
                      <GlowButton type="submit" loading={isLoading} className="py-2.5">
                        Analyze
                      </GlowButton>
                    </div>
                  </div>
                </div>
              </motion.form>
            </div>

            {/* Right Content / Visuals (38.2% / col-span-5) */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative w-full aspect-square"
              >
                {/* Decorative floating elements simulating data vis */}
                <GlassCard raised className="absolute top-10 -left-12 p-6 w-64 animate-float" style={{ animationDelay: '0s' }}>
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-sm text-lavender">Daily Goal</span>
                    <span className="text-phosphor font-mono">85%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-phosphor rounded-full shadow-glow-green" />
                  </div>
                </GlassCard>

                <GlassCard raised className="absolute top-1/2 right-0 translate-x-1/4 -translate-y-1/2 p-6 w-56 animate-float" style={{ animationDelay: '2s' }}>
                  <div className="text-4xl font-display font-bold text-offwhite mb-1">1,248</div>
                  <div className="text-sm text-lavender">Total Solved</div>
                  <div className="mt-4 flex gap-1 items-end h-12">
                    {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                      <div key={i} className="flex-1 bg-cyan-electric/30 rounded-sm" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </GlassCard>

                <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full border border-dashed border-white/20 animate-[spin_20s_linear_infinite]" />
                <div className="absolute bottom-14 left-14 w-40 h-40 rounded-full border border-cyan-electric/30 shadow-glow" />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section ref={featuresRef} className="py-phi-3xl relative z-10 border-t border-white/5 bg-gradient-to-b from-transparent to-surface-dark/50">
        <div className="max-w-7xl mx-auto px-phi-md sm:px-phi-lg">
          <div className="mb-phi-xl">
            <h2 className="text-display-md font-bold mb-4">Engineered for <br/>Consistency</h2>
            <p className="text-lavender text-lg max-w-xl">
              Everything you need to map your progress, identify weak points, and build a competitive profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-phi-md">
            {features.map((feature, idx) => (
              <GlassCard key={idx} className="feature-card h-full flex flex-col group hover:border-cyan-electric/30 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-surface-raised flex items-center justify-center text-cyan-electric mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-lavender text-sm leading-relaxed flex-1">
                  {feature.desc}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Editorial Stats Section ── */}
      <section className="stats-section py-phi-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-cyan-electric/5" />
        <div className="max-w-7xl mx-auto px-phi-md sm:px-phi-lg relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-6 text-center">
            <div>
              <div className="text-5xl font-display font-bold text-offwhite mb-2">
                <span className="stat-value" data-value="10">0</span>k+
              </div>
              <div className="text-lavender uppercase tracking-widest text-xs font-bold">Tracked Users</div>
            </div>
            <div>
              <div className="text-5xl font-display font-bold text-cyan-electric mb-2 text-glow">
                <span className="stat-value" data-value="2.5">0</span>M
              </div>
              <div className="text-lavender uppercase tracking-widest text-xs font-bold">Problems Analyzed</div>
            </div>
            <div>
              <div className="text-5xl font-display font-bold text-phosphor mb-2 text-glow-phosphor">
                <span className="stat-value" data-value="99">0</span>%
              </div>
              <div className="text-lavender uppercase tracking-widest text-xs font-bold">Uptime Accuracy</div>
            </div>
            <div>
              <div className="text-5xl font-display font-bold text-amber-solar mb-2 text-glow-amber">
                <span className="stat-value" data-value="500">0</span>+
              </div>
              <div className="text-lavender uppercase tracking-widest text-xs font-bold">Top Performers</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-phi-4xl relative">
        <div className="max-w-4xl mx-auto px-phi-md text-center">
          <h2 className="text-display-md font-bold mb-6">Ready to elevate your game?</h2>
          <p className="text-xl text-lavender mb-10 font-light">
            Stop guessing your proficiency. Start measuring it.
          </p>
          <GlowButton onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-lg px-8 py-4">
            Search Your Profile <ArrowRight className="ml-2 w-5 h-5" />
          </GlowButton>
        </div>
      </section>

    </div>
  );
}
