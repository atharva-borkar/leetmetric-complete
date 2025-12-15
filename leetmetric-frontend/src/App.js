import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Compare from "./pages/Compare";
import Analytics from "./pages/Analytics";
import Leaderboard from "./pages/Leaderboard";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
          <Navbar />
          <main className="pt-16 min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
