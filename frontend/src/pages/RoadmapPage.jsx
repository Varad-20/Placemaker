import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import {
  Map, Award, Calendar, CheckSquare, ChevronRight,
  TrendingUp, Sparkles, BookOpen, Clock, DownloadCloud,
  Layers, BarChart2, RefreshCw, Zap
} from 'lucide-react';

const initialRoadmaps = {
  frontend: [
    { day: 1, title: 'HTML5 Semantic Layouts & CSS Grid/Flexbox design', category: 'HTML & CSS', desc: 'Build responsive grids, modern flex containers, and leverage screen reader semantics.', completed: false },
    { day: 2, title: 'JS Closures, Prototypes, & Event Loop execution models', category: 'JavaScript', desc: 'Dive into execution context, garbage collection triggers, and scope chain bubbles.', completed: false },
    { day: 3, title: 'Asynchronous flow using Promises & Async/Await wrappers', category: 'JavaScript', desc: 'Understand Promise.all, Promise.race, macro vs microtask queues.', completed: false },
    { day: 4, title: 'React component lifecycles, hooks deep dive, and state bounds', category: 'React Core', desc: 'Master useState, useEffect dependency array rules, and custom hooks structures.', completed: false },
    { day: 5, title: 'Global state architectures (Redux Toolkit vs Context API)', category: 'React State', desc: 'Set up slice stores, configure middleware, and compare performance trade-offs.', completed: false },
    { day: 6, title: 'Vite compiler bundles and module hot replacements', category: 'Build Tools', desc: 'Examine output dist sizes, asset chunking algorithms, and build scripts.', completed: false },
    { day: 7, title: 'CSS frameworks comparison (Tailwind utility sets vs Styled-components)', category: 'Styling', desc: 'Create adaptive, reusable theme interfaces using customized design files.', completed: false },
    { day: 8, title: 'Component unit validations with Jest & React Testing Library', category: 'Testing', desc: 'Assert user clicks, form text updates, and async element render waiting.', completed: false }
  ],
  backend: [
    { day: 1, title: 'Node.js event loop blocks and clustering threads', category: 'Node Core', desc: 'Analyze libuv internals, CPU thread pools, and non-blocking I/O routines.', completed: false },
    { day: 2, title: 'Express.js middleware layers, route params & body parser structures', category: 'Express', desc: 'Design centralized error handlers, validate request data pipelines.', completed: false },
    { day: 3, title: 'SQL joins, indices, and transactions execution scopes', category: 'Databases', desc: 'Write efficient query benchmarks, structure foreign keys, and examine query planners.', completed: false },
    { day: 4, title: 'NoSQL collection architecture and database aggregate pipelines', category: 'Databases', desc: 'Build MongoDB lookups, design schemas for write performance, indexing.', completed: false },
    { day: 5, title: 'RESTful API standard endpoints and status return matrices', category: 'API Design', desc: 'Map resource names to appropriate methods, implement filtering, pagination, and sorting.', completed: false },
    { day: 6, title: 'JWT token authentications and security hashes (bcrypt)', category: 'Security', desc: 'Implement token rotators, password salts, and route role validators.', completed: false },
    { day: 7, title: 'Redis key-value caching structures and cache-aside methods', category: 'Caching', desc: 'Configure cache evictions (TTL) and resolve cache-stampede issues.', completed: false },
    { day: 8, title: 'REST API validations and end-to-end integration tests using Supertest', category: 'Testing', desc: 'Verify API endpoints using test collections and assertions.', completed: false }
  ]
};

const RoadmapPage = () => {
  const [role, setRole] = useState('frontend');
  const [duration, setDuration] = useState('30');
  const [intensity, setIntensity] = useState('standard');
  const [tasks, setTasks] = useState([]);

  // Load custom tasks from localStorage or initial state
  useEffect(() => {
    const key = `roadmap_tasks_${role}_${duration}_${intensity}`;
    const cached = localStorage.getItem(key);
    if (cached) {
      setTasks(JSON.parse(cached));
    } else {
      // Map or expand initial roadmap based on duration/intensity
      const source = initialRoadmaps[role] || initialRoadmaps['frontend'];
      // Simply clone and adjust
      const loaded = source.map((t, idx) => ({
        ...t,
        day: idx + 1,
        completed: false
      }));
      setTasks(loaded);
    }
  }, [role, duration, intensity]);

  const toggleTask = (day) => {
    const updated = tasks.map(t => {
      if (t.day === day) return { ...t, completed: !t.completed };
      return t;
    });
    setTasks(updated);
    const key = `roadmap_tasks_${role}_${duration}_${intensity}`;
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const resetRoadmap = () => {
    if (window.confirm("Do you want to reset your checklist progress?")) {
      const source = initialRoadmaps[role] || initialRoadmaps['frontend'];
      const loaded = source.map((t, idx) => ({
        ...t,
        day: idx + 1,
        completed: false
      }));
      setTasks(loaded);
      const key = `roadmap_tasks_${role}_${duration}_${intensity}`;
      localStorage.removeItem(key);
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length || 1;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <Map className="h-6 w-6 text-brand-500" /> Personalized Roadmap Generator
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Generate customizable, targeted syllabus schedules to prepare for corporate placements.
            </p>
          </div>
          <button
            onClick={resetRoadmap}
            className="self-start md:self-auto inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-rose-500 transition border border-slate-200 bg-white rounded-xl px-4 py-2"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Reset Roadmap
          </button>
        </div>

        {/* Dynamic Controls Row */}
        <div className="rounded-2xl border border-brand-100 bg-white shadow-sm p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Target Domain Stream</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-700 focus:border-brand-500 outline-none transition"
            >
              <option value="frontend">Frontend Web Engineer</option>
              <option value="backend">Backend Systems Architect</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Duration Schedule</label>
            <div className="flex gap-2">
              {['30', '60'].map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition
                    ${duration === d
                      ? 'border-brand-500 bg-brand-50 text-brand-900'
                      : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-white'}`}
                >
                  {d} Days Track
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Intensity Drill Level</label>
            <div className="flex gap-2">
              {['standard', 'intensive'].map((l) => (
                <button
                  key={l}
                  onClick={() => setIntensity(l)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition uppercase tracking-wider
                    ${intensity === l
                      ? 'border-brand-500 bg-brand-50 text-brand-900'
                      : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-white'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Progress HUD Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3 rounded-2xl border border-brand-100 bg-white p-6 shadow-sm flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">Calibrated Study checklist</h4>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
                <Zap className="h-3.5 w-3.5 fill-current" /> Keep it up!
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Domain Readiness Level</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                <div style={{ width: `${progressPercent}%` }} className="h-full bg-brand-500 transition-all duration-500" />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500">
              <div>Completed Milestones: <span className="text-slate-800">{completedCount}</span> / {totalCount}</div>
              <div className="hidden sm:block">Active Stream: <span className="text-brand-600 capitalize">{role}</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-150 bg-slate-900 text-white p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-brand-300 uppercase tracking-widest">Global Index Target</span>
              <h4 className="text-xl font-black">ATS Match Grade</h4>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-slate-300">Aim for at least 80% syllabus completion to unlock targeted mock referrals.</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-brand-300">
                <BookOpen className="h-3.5 w-3.5" /> 8 core resources linked
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Tasks Grid */}
        <div className="rounded-2xl border border-brand-100 bg-white shadow-sm p-6 space-y-6">
          <h3 className="text-base font-black text-slate-700 border-b border-slate-100 pb-3">Syllabus Checklists</h3>

          <div className="relative border-l-2 border-slate-100 pl-6 ml-4 space-y-6">
            {tasks.map((task) => (
              <div key={task.day} className="relative group">
                {/* Timeline node */}
                <div
                  className={`absolute -left-[35px] top-1.5 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                    ${task.completed
                      ? 'bg-brand-500 border-brand-500 text-white shadow-md'
                      : 'bg-white border-slate-200 text-slate-400 group-hover:border-brand-400'}`}
                >
                  {task.completed ? (
                    <CheckSquare className="h-3.5 w-3.5 fill-current" />
                  ) : (
                    <span className="text-[10px] font-extrabold">{task.day}</span>
                  )}
                </div>

                {/* Card block */}
                <div
                  onClick={() => toggleTask(task.day)}
                  className={`cursor-pointer p-4 rounded-xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4
                    ${task.completed
                      ? 'bg-brand-50/30 border-brand-200'
                      : 'bg-slate-50/50 border-slate-100 hover:border-brand-200 hover:bg-white'}`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        task.completed
                          ? 'text-brand-700 bg-brand-50 border-brand-200'
                          : 'text-slate-500 bg-slate-100 border-slate-200'
                      }`}>
                        {task.category}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">Day {task.day} Objective</span>
                    </div>
                    <h4 className={`text-xs font-black transition ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {task.title}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">{task.desc}</p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg border transition-all ${
                      task.completed
                        ? 'text-brand-600 bg-brand-50 border-brand-300'
                        : 'text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-700 border-slate-200'
                    }`}>
                      {task.completed ? 'Done' : 'Mark Completed'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RoadmapPage;
