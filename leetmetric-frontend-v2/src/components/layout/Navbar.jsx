import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Menu, X, BarChart2, Users, Trophy, LogOut, Target } from 'lucide-react';
import GlowButton from '../ui/GlowButton';
import { useApp } from '../../context/AppContext';
import { authApi } from '../../services/firebase';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { state } = useApp();
  const { currentUser, authLoading } = state;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignIn = async () => {
    try {
      await authApi.signInWithGoogle();
      toast.success('Successfully signed in!');
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to sign in: ' + error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await authApi.signOut();
      toast.success('Signed out');
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const navLinks = [
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Compare', path: '/compare', icon: Users },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  ];

  if (currentUser) {
    navLinks.push({ name: 'My Goals', path: '/goals', icon: Target });
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-3 bg-abyss/80 backdrop-blur-md border-b border-white/5 shadow-lg' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-phi-md sm:px-phi-lg flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-electric to-cyan-deep shadow-glow transition-transform group-hover:scale-105">
            <Code2 className="w-5 h-5 text-abyss" />
            <div className="absolute inset-0 rounded-xl border border-white/20" />
          </div>
          <span className="font-display font-bold text-xl tracking-wide text-offwhite group-hover:text-glow transition-all">
            LeetMetric
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2 bg-surface-dark/50 backdrop-blur-md border border-white/5 rounded-full px-4 py-1.5">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className="relative px-4 py-2 text-sm font-medium transition-colors"
              >
                {isActive ? (
                  <span className="text-cyan-electric">{link.name}</span>
                ) : (
                  <span className="text-lavender hover:text-offwhite">{link.name}</span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-cyan-electric/10 rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Auth / Actions */}
        <div className="hidden md:flex items-center gap-3">
          {!authLoading && (
            currentUser ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <img src={currentUser.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-white/10" />
                  <span className="text-sm font-medium text-offwhite hidden lg:block">{currentUser.displayName}</span>
                </div>
                <button onClick={handleSignOut} className="text-lavender hover:text-coral transition-colors" title="Sign Out">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <GlowButton variant="primary" onClick={handleSignIn} className="text-sm">Sign In with Google</GlowButton>
            )
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-lavender hover:text-cyan-electric transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-surface-dark/95 backdrop-blur-xl border-b border-white/10 shadow-2xl p-4 md:hidden flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-offwhite"
              >
                <link.icon className="w-5 h-5 text-cyan-electric" />
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
            <div className="h-px w-full bg-white/5 my-2" />
            
            {!authLoading && (
              currentUser ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <img src={currentUser.photoURL} alt="Avatar" className="w-10 h-10 rounded-full border border-white/10" />
                    <span className="text-sm font-medium text-offwhite">{currentUser.displayName}</span>
                  </div>
                  <GlowButton variant="secondary" onClick={handleSignOut} className="w-full justify-center text-coral border-coral/30 hover:bg-coral/10 hover:border-coral">
                    Sign Out
                  </GlowButton>
                </div>
              ) : (
                <GlowButton variant="primary" onClick={handleSignIn} className="w-full justify-center">Sign In with Google</GlowButton>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
