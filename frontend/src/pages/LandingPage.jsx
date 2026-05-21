import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import {
  GraduationCap,
  Award,
  Video,
  FileText,
  Map,
  Code,
  Building2,
  FolderGit,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';

const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#EEEEEE] dark:bg-brand-950 text-slate-800 dark:text-slate-100 selection:bg-brand-400 selection:text-white relative overflow-hidden font-sans transition-colors duration-300">
      {/* Soft gradient blobs */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-brand-300/30 dark:bg-brand-500/20 blur-[120px] animate-pulse-subtle" />
      <div className="absolute top-1/3 left-0 -ml-20 h-96 w-96 rounded-full bg-brand-200/40 dark:bg-brand-400/10 blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-brand-400/20 dark:bg-brand-600/10 blur-[100px]" />

      {/* Header */}
      <header className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between border-b border-brand-200/60 dark:border-brand-900/40 bg-white/60 dark:bg-brand-950/60 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-500 to-brand-300 shadow-lg shadow-brand-500/20">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
            PlaceMentor <span className="text-brand-500">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Toggle Theme Control */}
          <button
            onClick={toggleTheme}
            className="rounded-xl p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-brand-900/30 transition-all border border-slate-200/30 dark:border-brand-900/30"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400 animate-pulse-subtle" /> : <Moon className="h-5 w-5 text-brand-600" />}
          </button>

          <Link
            to="/login"
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition px-4 py-2"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-sm font-semibold text-white px-5 py-2.5 shadow-md shadow-brand-500/25 hover:shadow-brand-600/30 transition-all"
          >
            <span>Get Started Free</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
        <div className="space-y-6 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 dark:bg-brand-500/20 px-3.5 py-1 text-xs font-semibold tracking-wider text-brand-700 dark:text-brand-300 ring-1 ring-inset ring-brand-500/25 dark:ring-brand-400/25 uppercase">
            <BrainCircuit className="h-3.5 w-3.5" /> Next-Gen Career Development Platform
          </span>

          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-6xl leading-[1.1]">
            Fast-Track Your <br />
            <span className="bg-gradient-to-r from-brand-600 via-brand-400 to-brand-300 bg-clip-text text-transparent">
              Placement Readiness
            </span>{' '}
            With AI
          </h1>

          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Upload your resume for real-time ATS optimization guidelines, participate in realistic AI-graded simulated mock interviews, and access daily customized schedules.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 text-base font-bold text-white px-8 py-4 shadow-lg shadow-brand-500/25 hover:shadow-brand-600/30 transition-all hover:-translate-y-0.5"
            >
              <span>Build Readiness Index</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-brand-900/30 hover:bg-brand-50 dark:hover:bg-brand-900/50 border border-brand-200 dark:border-brand-800 text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-700 dark:hover:text-white px-8 py-4 transition shadow-sm"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Dashboard Preview mockup */}
        <div className="mt-16 relative rounded-2xl border border-brand-200/60 dark:border-brand-900/40 bg-white/80 dark:bg-brand-950/60 p-4 md:p-6 shadow-xl shadow-brand-500/10 dark:shadow-brand-950/50 backdrop-blur-md max-w-5xl mx-auto">
          {/* Window dots */}
          <div className="flex items-center gap-1.5 pb-4 border-b border-brand-100 dark:border-brand-900/30">
            <div className="h-3 w-3 rounded-full bg-rose-400" />
            <div className="h-3 w-3 rounded-full bg-amber-400" />
            <div className="h-3 w-3 rounded-full bg-brand-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {/* Circle readiness index mock */}
            <div className="rounded-xl border border-brand-100 dark:border-brand-900/30 bg-brand-50/60 dark:bg-brand-950/40 p-5 flex flex-col items-center">
              <div className="relative h-32 w-32 flex items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" className="stroke-brand-100 dark:stroke-brand-900/50" strokeWidth="8" fill="transparent" />
                  <circle cx="50" cy="50" r="42" className="stroke-brand-500" strokeWidth="8" strokeDasharray="263" strokeDashoffset="65" strokeLinecap="round" fill="transparent" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-800 dark:text-white">76%</span>
                  <span className="text-[8px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">Readiness</span>
                </div>
              </div>
              <h4 className="mt-4 text-sm font-bold text-slate-800 dark:text-slate-200">Placement Readiness Level</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Excellent DSA, Needs communication polish</p>
            </div>

            {/* ATS Keywords mock */}
            <div className="rounded-xl border border-brand-100 dark:border-brand-900/30 bg-brand-50/60 dark:bg-brand-950/40 p-5 text-left space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">ATS Keyword Check</h4>
                <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 dark:bg-brand-500/20 px-2 py-0.5 rounded-full">Score: 84/100</span>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'Redux State Management', match: true },
                  { name: 'Node.js MVC Pattern', match: true },
                  { name: 'Kubernetes Containerization', match: false },
                  { name: 'Database Query Optimization', match: true },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                    <span className={`font-semibold ${item.match ? 'text-brand-600 dark:text-brand-400' : 'text-rose-500'}`}>
                      {item.match ? 'Matched' : 'Missing'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Roadmap Tasks mock */}
            <div className="rounded-xl border border-brand-100 dark:border-brand-900/30 bg-brand-50/60 dark:bg-brand-950/40 p-5 text-left space-y-3">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Active Roadmap Tasks</h4>
              <div className="space-y-2.5">
                {[
                  { title: 'Re-balance Red-Black Binary Tree', cat: 'DSA', completed: true },
                  { title: 'Incorporate Action Words in Project Descriptions', cat: 'Resume', completed: false },
                  { title: 'Complete 15m Technical Mock Session', cat: 'Interview', completed: false },
                ].map((task, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      readOnly
                      className="rounded border-brand-200 dark:border-brand-800 text-brand-500 bg-white dark:bg-brand-900"
                    />
                    <span className={`truncate flex-1 ${task.completed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-600 dark:text-slate-300'}`}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-24 bg-white/50 dark:bg-brand-950/30 border-t border-brand-100 dark:border-brand-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900 dark:text-white">
              End-to-End Placement Suite
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Stop guessing if you are placement ready. Use detailed metrics designed to pinpoint exact skill shortfalls.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {[
              { title: 'ATS Resume Evaluator', desc: 'Instantly evaluate layout parsing indices, keyword levels, and vocabulary action metrics.', icon: FileText },
              { title: 'AI Mock Interviews', desc: 'Engage with context-aware HR and technical questions complete with detailed grading benchmarks.', icon: Video },
              { title: 'Dynamic Roadmap Builder', desc: 'Generate curated daily exercises and learning materials suited to fill in specific profile gaps.', icon: Map },
              { title: 'DSA Streak Tracker', desc: 'Track core topics including dynamic programming, recursion structures, and graph traversals.', icon: Code },
              { title: 'Company Matrix Analyzer', desc: 'Compare target profile statistics to actual recruitment thresholds, backlogs, and branch parameters.', icon: Building2 },
              { title: 'Project Ideas Engine', desc: 'Generate role-based architectural scopes suited to fit resume levels and highlight coding skills.', icon: FolderGit },
            ].map((feat, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-brand-100 dark:border-brand-900/30 bg-white dark:bg-brand-900/20 p-6 hover:bg-brand-50 dark:hover:bg-brand-900/40 hover:border-brand-300 dark:hover:border-brand-800 transition-all hover:-translate-y-1 group shadow-sm hover:shadow-brand-200/50 dark:hover:shadow-none hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-all">
                  <feat.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-800 dark:text-slate-200">{feat.title}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 text-center border-t border-brand-100 dark:border-brand-900/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
            Are You Ready for Next Week's Drive?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
            Gain immediate validation on career indices, optimize resume profiles, and test simulated technical screens.
          </p>
          <div className="pt-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 text-base font-bold text-white px-8 py-3.5 shadow-lg shadow-brand-500/25 hover:shadow-brand-600/30 transition-all"
            >
              <span>Build Profile Index</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white dark:bg-brand-950/40 border-t border-brand-100 dark:border-brand-900/30 py-8 text-center text-xs text-slate-400 dark:text-slate-500">
        <p>© 2026 PlaceMentor AI. Crafted for university placement excellency.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
