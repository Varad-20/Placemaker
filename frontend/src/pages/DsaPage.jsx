import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import {
  Code, Flame, Award, CheckCircle2, Circle, Search, PlusCircle,
  ExternalLink, BarChart2, TrendingUp, RefreshCw, X
} from 'lucide-react';

const initialProblems = [
  { id: 1, title: 'Two Sum', category: 'Arrays', difficulty: 'Easy', link: 'https://leetcode.com/problems/two-sum/', completed: false },
  { id: 2, title: 'Best Time to Buy and Sell Stock', category: 'Arrays', difficulty: 'Easy', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', completed: false },
  { id: 3, title: 'Longest Substring Without Repeating Characters', category: 'Strings', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', completed: false },
  { id: 4, title: 'Valid Parentheses', category: 'Strings', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-parentheses/', completed: false },
  { id: 5, title: 'Merge Two Sorted Lists', category: 'Linked Lists', difficulty: 'Easy', link: 'https://leetcode.com/problems/merge-two-sorted-lists/', completed: false },
  { id: 6, title: 'Reverse Linked List', category: 'Linked Lists', difficulty: 'Easy', link: 'https://leetcode.com/problems/reverse-linked-list/', completed: false },
  { id: 7, title: 'Binary Tree Inorder Traversal', category: 'Trees', difficulty: 'Easy', link: 'https://leetcode.com/problems/binary-tree-inorder-traversal/', completed: false },
  { id: 8, title: 'Maximum Depth of Binary Tree', category: 'Trees', difficulty: 'Easy', link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', completed: false },
  { id: 9, title: 'Longest Palindromic Substring', category: 'Strings', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-palindromic-substring/', completed: false },
  { id: 10, title: 'Container With Most Water', category: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/container-with-most-water/', completed: false },
  { id: 11, title: 'Edit Distance', category: 'Dynamic Programming', difficulty: 'Hard', link: 'https://leetcode.com/problems/edit-distance/', completed: false },
  { id: 12, title: 'Longest Common Subsequence', category: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-common-subsequence/', completed: false },
  { id: 13, title: 'Clone Graph', category: 'Graphs', difficulty: 'Medium', link: 'https://leetcode.com/problems/clone-graph/', completed: false },
  { id: 14, title: 'Course Schedule', category: 'Graphs', difficulty: 'Medium', link: 'https://leetcode.com/problems/course-schedule/', completed: false }
];

const DsaPage = () => {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Arrays');
  const [newDifficulty, setNewDifficulty] = useState('Easy');
  const [newLink, setNewLink] = useState('');

  // Cache handler
  useEffect(() => {
    const cached = localStorage.getItem('dsa_tracker_problems');
    if (cached) {
      setProblems(JSON.parse(cached));
    } else {
      setProblems(initialProblems);
    }
  }, []);

  const toggleProblem = (id) => {
    const updated = problems.map(p => {
      if (p.id === id) return { ...p, completed: !p.completed };
      return p;
    });
    setProblems(updated);
    localStorage.setItem('dsa_tracker_problems', JSON.stringify(updated));
  };

  const handleAddProblem = (e) => {
    e.preventDefault();
    if (!newTitle) return;

    const newProb = {
      id: Date.now(),
      title: newTitle,
      category: newCategory,
      difficulty: newDifficulty,
      link: newLink || 'https://leetcode.com',
      completed: false
    };

    const updated = [...problems, newProb];
    setProblems(updated);
    localStorage.setItem('dsa_tracker_problems', JSON.stringify(updated));

    // Reset fields
    setNewTitle('');
    setNewLink('');
    setShowAddModal(false);
  };

  const resetTracker = () => {
    if (window.confirm("Are you sure you want to reset all progress metrics?")) {
      setProblems(initialProblems);
      localStorage.removeItem('dsa_tracker_problems');
    }
  };

  // Categories extraction
  const categories = ['All', ...new Set(problems.map(p => p.category))];

  // Filters logic
  const filteredProblems = problems.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  // Score metrics
  const total = problems.length;
  const completed = problems.filter(p => p.completed).length;
  const completedPercent = Math.round((completed / (total || 1)) * 100);

  const easyCompleted = problems.filter(p => p.difficulty === 'Easy' && p.completed).length;
  const easyTotal = problems.filter(p => p.difficulty === 'Easy').length;

  const mediumCompleted = problems.filter(p => p.difficulty === 'Medium' && p.completed).length;
  const mediumTotal = problems.filter(p => p.difficulty === 'Medium').length;

  const hardCompleted = problems.filter(p => p.difficulty === 'Hard' && p.completed).length;
  const hardTotal = problems.filter(p => p.difficulty === 'Hard').length;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <Code className="h-6 w-6 text-brand-500" /> DSA Progress Tracker
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Keep momentum by tracking curated algorithmic patterns and placement sheets.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 text-white font-bold px-4 py-2.5 shadow-md shadow-brand-500/20 transition-all text-xs"
            >
              <PlusCircle className="h-4 w-4" /> Add Problem
            </button>
            <button
              onClick={resetTracker}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-rose-500 transition border border-slate-200 bg-white rounded-xl px-4 py-2.5"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* HUD Analytics Grids */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Progress Tracker Circle */}
          <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm flex items-center justify-between gap-6">
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Completed Tasks</span>
              <h3 className="text-2xl font-black text-slate-800">{completed} / {total}</h3>
              <div className="flex items-center gap-1 text-[10px] font-bold text-brand-600">
                <TrendingUp className="h-3.5 w-3.5" /> Verified Progress
              </div>
            </div>
            <div className="relative h-20 w-20 shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" className="stroke-slate-100" strokeWidth="8" fill="transparent" />
                <circle cx="50" cy="50" r="42" className="stroke-brand-500" strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 42} strokeDashoffset={(2 * Math.PI * 42) * (1 - completedPercent / 100)}
                  strokeLinecap="round" fill="transparent" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-brand-600">
                {completedPercent}%
              </div>
            </div>
          </div>

          {/* Difficulty breakdown */}
          <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm flex flex-col justify-between gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Difficulty metrics</span>
            <div className="space-y-2">
              {[
                { label: 'Easy', completed: easyCompleted, total: easyTotal, color: 'bg-emerald-500' },
                { label: 'Medium', completed: mediumCompleted, total: mediumTotal, color: 'bg-amber-400' },
                { label: 'Hard', completed: hardCompleted, total: hardTotal, color: 'bg-rose-500' }
              ].map((diff, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                    <span>{diff.label}</span>
                    <span>{diff.completed}/{diff.total} Solved</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div style={{ width: `${(diff.completed / (diff.total || 1)) * 100}%` }} className={`h-full ${diff.color}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Streaks */}
          <div className="rounded-2xl border border-brand-100 bg-slate-900 text-white p-6 shadow-sm flex items-center justify-between gap-6">
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-brand-300 uppercase tracking-widest">Active Momentum</span>
              <h3 className="text-2xl font-black">5 Days Streak</h3>
              <p className="text-[10px] text-slate-400 leading-normal">Solve at least 1 algorithm problem daily to lock streak bonus rewards.</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 shadow-lg shadow-orange-500/20 shrink-0 animate-pulse-subtle">
              <Flame className="h-8 w-8 text-white fill-current" />
            </div>
          </div>
        </div>

        {/* Filter Controls & Sheet problems */}
        <div className="rounded-2xl border border-brand-100 bg-white shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition
                    ${activeCategory === cat
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-white hover:border-slate-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search problem title..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-brand-500 transition"
              />
            </div>
          </div>

          {/* Problem List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProblems.map((prob) => (
              <div
                key={prob.id}
                onClick={() => toggleProblem(prob.id)}
                className={`cursor-pointer p-4 rounded-xl border transition flex items-center justify-between gap-4
                  ${prob.completed
                    ? 'bg-brand-50/20 border-brand-200'
                    : 'bg-slate-50/50 border-slate-100 hover:border-brand-200 hover:bg-white'}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0">
                    {prob.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-brand-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-300" />
                    )}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <h4 className={`text-xs font-bold transition truncate ${prob.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {prob.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{prob.category}</span>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                        prob.difficulty === 'Easy' ? 'text-emerald-600 bg-emerald-50' :
                        prob.difficulty === 'Medium' ? 'text-amber-600 bg-amber-50' :
                        'text-rose-600 bg-rose-50'}`}>
                        {prob.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <a
                  href={prob.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0 p-2 text-slate-400 hover:text-brand-500 transition"
                >
                  <ExternalLink className="h-4.5 w-4.5" />
                </a>
              </div>
            ))}

            {filteredProblems.length === 0 && (
              <div className="sm:col-span-2 text-center py-12 text-slate-400 text-xs">
                No matching algorithmic patterns detected. Clear search filters or click "Add Problem" to expand.
              </div>
            )}
          </div>
        </div>

        {/* Modal form for adding problem */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-100 max-w-md w-full shadow-2xl overflow-hidden animate-slide-up">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h4 className="text-sm font-black text-slate-800">Add Custom DSA Problem</h4>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleAddProblem} className="p-6 space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-extrabold text-slate-600">Problem Title</label>
                  <input
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Reverse a String"
                    className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-brand-500 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-600">Category Tag</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-brand-500 transition"
                    >
                      {['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-600">Difficulty Grade</label>
                    <select
                      value={newDifficulty}
                      onChange={(e) => setNewDifficulty(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-brand-500 transition"
                    >
                      {['Easy', 'Medium', 'Hard'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-600">LeetCode/Coding Challenge URL</label>
                  <input
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    placeholder="https://leetcode.com/problems/..."
                    className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-brand-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 text-white font-bold p-3.5 shadow-lg shadow-brand-500/25 transition-all"
                >
                  Create solved target problem
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DsaPage;
