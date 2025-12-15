import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Code, Menu, X, Sun, Moon } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { authApi } from "../../services/firebase";
import { LogIn, LogOut } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state, dispatch } = useApp();
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/", current: location.pathname === "/" },
    {
      name: "Compare",
      href: "/compare",
      current: location.pathname === "/compare",
    },
    {
      name: "Analytics",
      href: "/analytics",
      current: location.pathname === "/analytics",
    },
    {
      name: "Leaderboard",
      href: "/leaderboard",
      current: location.pathname === "/leaderboard",
    },
    { name: "About", href: "/about", current: location.pathname === "/about" },
  ];

  const toggleTheme = () => {
    dispatch({ type: "TOGGLE_THEME" });
  };

  const handleLogout = async () => {
    await authApi.signOut();
  };

  return (
    <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg fixed w-full z-50 top-0 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                LeetMetric
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.current
                    ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/50 dark:text-indigo-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Auth area */}
            {state.currentUser ? (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-300 max-w-[140px] truncate">
                  {state.currentUser.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-sm rounded-md bg-red-500 text-white flex items-center gap-1 hover:bg-red-600"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-sm rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1"
                >
                  <LogIn size={16} />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1.5 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {state.theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              aria-label="Toggle theme"
            >
              {state.theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    item.current
                      ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/50 dark:text-indigo-400"
                      : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Auth area - mobile */}
              <div className="mt-2 border-t border-gray-200 dark:border-gray-800 pt-2">
                {state.currentUser ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Logged in as
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                        {state.currentUser.email}
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        await handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full mt-1 inline-flex items-center justify-center px-3 py-2 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600"
                    >
                      <LogOut size={16} className="mr-1" />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 mt-1">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <LogIn size={16} className="mr-1" />
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
