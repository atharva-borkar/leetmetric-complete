import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';

// We will create these pages next
import Home from './pages/Home';
import Profile from './pages/Profile';
import Compare from './pages/Compare';
import Analytics from './pages/Analytics';
import Leaderboard from './pages/Leaderboard';
import Goals from './pages/Goals';

import Navbar from './components/layout/Navbar';

function App() {
  return (
    <AppProvider>
      <Router>
        {/* The global background is applied to the body via index.css */}
        <div className="relative min-h-screen flex flex-col">
          {/* Subtle background glow effects */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-electric/5 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-phosphor/5 blur-[120px]" />
          </div>

          <Navbar />
          
          <main className="flex-1 flex flex-col pt-phi-xl">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/goals" element={<Goals />} />
            </Routes>
          </main>
          
          {/* <Footer /> */}
          <Toaster 
            position="top-right" 
            toastOptions={{
              className: '!bg-surface-raised !text-offwhite !border !border-white/10 !shadow-glow',
              style: {
                background: '#1a2236',
                color: '#e8edf5',
                border: '1px solid rgba(255,255,255,0.1)'
              }
            }} 
          />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
