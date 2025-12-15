import React from 'react';
import { Code, Heart, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Code className="h-8 w-8 text-indigo-400" />
              <span className="text-2xl font-bold">LeetMetric</span>
            </div>
            <p className="text-gray-400 text-sm mb-4 max-w-md">
              Track your LeetCode progress, compare with others, and get insights 
              to improve your coding skills. Built for developers, by developers.
            </p>
            <div className="flex items-center text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 mx-1 text-red-400" />
              <span>for the coding community</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="/compare" className="text-gray-400 hover:text-white transition-colors">Compare Users</a></li>
              <li><a href="/leaderboard" className="text-gray-400 hover:text-white transition-colors">Leaderboard</a></li>
              <li><a href="/analytics" className="text-gray-400 hover:text-white transition-colors">Analytics</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-400">
                <a href="https://leetcode.com" target="_blank" rel="noopener noreferrer" 
                   className="hover:text-white transition-colors">
                  Data powered by LeetCode
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {currentYear} LeetMetric. All rights reserved. 
            <span className="mx-2">|</span>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <span className="mx-2">|</span>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
