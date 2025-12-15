import React from "react";
import {
  Code,
  Heart,
  Users,
  Target,
  Zap,
  Shield,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import Button from "../components/ui/Button";

export default function About() {
  const features = [
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Lightning Fast",
      description:
        "Built with modern React and optimized for speed. Get insights in seconds, not minutes.",
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Privacy First",
      description:
        "We only use publicly available LeetCode data. Your personal information stays private.",
    },
    {
      icon: <Target className="h-8 w-8 text-red-600" />,
      title: "Accurate Data",
      description:
        "Real-time synchronization with LeetCode ensures you always get the most current statistics.",
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Community Driven",
      description:
        "Built by developers, for developers. Open source and constantly improving.",
    },
  ];

  const stats = [
    { label: "Users Served", value: "10,000+" },
    { label: "Profiles Analyzed", value: "50,000+" },
    { label: "Comparisons Made", value: "25,000+" },
    { label: "Uptime", value: "99.9%" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Code className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6">About LeetMetric</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              We're on a mission to help developers track their coding progress,
              understand their strengths, and achieve their programming goals
              through comprehensive LeetCode analytics.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
              Our Story
            </h2>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="text-xl leading-relaxed mb-6">
                LeetMetric was born out of a simple frustration: the lack of
                comprehensive analytics for LeetCode progress. As developers
                ourselves, we found it difficult to track our growth, identify
                weaknesses, and compare our progress with peers.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                We believe that data-driven insights can accelerate learning and
                help developers make informed decisions about their coding
                journey. That's why we built LeetMetric – to transform raw
                LeetCode data into actionable insights.
              </p>
              <p className="text-lg leading-relaxed">
                Today, thousands of developers use LeetMetric to track their
                progress, compare with others, and stay motivated on their
                coding journey. We're just getting started.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solo Developer Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Built by a Solo Developer
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              LeetMetric is a personal passion project designed, developed, and
              maintained entirely by a single developer. From UI/UX design and
              frontend engineering to backend architecture and API integration,
              every part of this platform was implemented from scratch to
              practice full‑stack development and solve a real problem faced by
              LeetCode users.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              The project showcases end‑to‑end ownership: planning the product,
              designing the user experience, integrating LeetCode&apos;s GraphQL
              API through a custom Node.js/Express backend, and building a
              modern React + TailwindCSS frontend with rich data visualizations.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              As the sole developer, responsibility spans everything from
              handling CORS issues and performance optimizations to implementing
              features like comparisons, leaderboards, dark mode, and analytics
              — mirroring the kind of ownership expected in real‑world
              engineering teams.
            </p>
          </div>
        </div>
      </section>

      {/* Optional mini “About the Developer” card */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 p-[1px] shadow-2xl">
            {/* Inner card */}
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row items-center gap-8">
              {/* Soft glow */}
              <div className="pointer-events-none absolute -inset-20 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.22),transparent_60%),_radial-gradient(circle_at_bottom,_rgba(56,189,248,0.15),transparent_55%)] opacity-70" />

              {/* Avatar */}
              <div className="relative z-10">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 opacity-80 blur-sm" />
                  {/* Replace src with your actual photo later */}
                  <img
                    src="/images/atharva-avatar.png"
                    alt="Atharva Borkar"
                    className="relative w-full h-full object-cover rounded-full border-2 border-white/70 dark:border-gray-800"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 w-full">
                <p className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-900/40 px-3 py-1 rounded-full mb-3">
                  Solo Developer
                </p>

                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Atharva Borkar
                </h3>

                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                  Final‑year CSE student • Full‑Stack Web Developer
                </p>

                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                  LeetMetric is a solo, end‑to‑end project built to deepen
                  full‑stack skills. From React + TailwindCSS on the frontend to
                  a Node.js/Express backend that integrates LeetCode&apos;s
                  GraphQL API, every part of the platform is designed and
                  implemented by Atharva — including UI, data visualizations,
                  API handling, and overall architecture.
                </p>

                {/* Social + Tags */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                  {/* Social icons */}
                  <div className="flex items-center gap-4">
                    <a
                      href="https://github.com/your-github-username"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700 shadow-sm transition-colors"
                    >
                      <Github size={18} />
                    </a>
                    <a
                      href="https://twitter.com/your-twitter-handle"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700 shadow-sm transition-colors"
                    >
                      <Twitter size={18} />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/your-linkedin-id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700 shadow-sm transition-colors"
                    >
                      <Linkedin size={18} />
                    </a>
                  </div>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                      React &amp; TailwindCSS
                    </span>
                    <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                      Node.js &amp; Express
                    </span>
                    <span className="px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300">
                      GraphQL &amp; APIs
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose LeetMetric?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've built the most comprehensive LeetCode analytics platform
              with features that matter to developers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              LeetMetric by the Numbers
            </h2>
            <p className="text-xl text-gray-600">
              Growing every day with our amazing community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-lg text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Heart className="h-16 w-16 text-red-500 mx-auto mb-8" />
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              To empower every developer with the insights they need to grow,
              improve, and achieve their coding goals. We believe that with the
              right data and tools, anyone can become a better programmer.
            </p>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8">
              <p className="text-lg text-gray-700 italic">
                "Code is poetry, data is the rhythm, and insights are the melody
                that helps developers create their masterpiece."
              </p>
              <p className="text-sm text-gray-500 mt-4">
                — The LeetMetric Team
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Track Your Progress?
          </h2>
          <p className="text-xl mb-8 text-indigo-100">
            Join thousands of developers who are already using LeetMetric to
            improve their coding skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => (window.location.href = "/")}
              className="bg-white text-indigo-600 hover:bg-indigo-50"
            >
              Get Started Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => (window.location.href = "/analytics")}
              className="border-white text-white hover:bg-white/10"
            >
              View Analytics
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
