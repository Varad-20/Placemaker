import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Sun, Moon, Bell, User, LogOut, Settings } from 'lucide-react';

const Navbar = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  // Map route names to friendly titles
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Readiness Dashboard';
    if (path.includes('/resume')) return 'Resume ATS Evaluator';
    if (path.includes('/interview')) return 'AI Mock Interviews';
    if (path.includes('/roadmap')) return 'Personalized Career Roadmap';
    if (path.includes('/dsa')) return 'DSA Syllabus Tracker';
    if (path.includes('/companies')) return 'Placement Eligibility & Companies';
    if (path.includes('/projects')) return 'AI Project Ideas Generator';
    if (path.includes('/community')) return 'Discussion Forums';
    if (path.includes('/profile')) return 'My Career Profile';
    return 'Dashboard';
  };

  const getInitials = (name) => {
    if (!name) return 'PM';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/50 dark:border-brand-900/30 bg-white/80 dark:bg-brand-950/90 backdrop-blur-md px-4 md:px-6 lg:px-8">
      {/* Left items: Menu drawer toggle + Section heading */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-brand-950/30 text-slate-500 dark:text-slate-400 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right items: System options & User Dropdown */}
      <div className="flex items-center gap-3">
        {/* Toggle Theme Control */}
        <button
          onClick={toggleTheme}
          className="rounded-xl p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-brand-900/30 transition-all border border-slate-200/30 dark:border-brand-900/30"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400 animate-pulse-subtle" /> : <Moon className="h-5 w-5 text-brand-600" />}
        </button>

        {/* Alerts Center Bell */}
        <button
          className="rounded-xl p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-brand-900/30 transition-all border border-slate-200/30 dark:border-brand-900/30 relative"
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white dark:ring-[#080410]" />
        </button>

        {/* Split line separator */}
        <div className="h-6 w-px bg-slate-200 dark:bg-brand-950/30 mx-1" />

        {/* User Account Controls */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-50 dark:hover:bg-brand-900/30 transition-all border border-transparent hover:border-slate-200/40 dark:hover:border-brand-950/30"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-9 w-9 rounded-full object-cover border border-brand-500"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-sm font-semibold text-white shadow-md shadow-brand-500/10">
                {getInitials(user?.name)}
              </div>
            )}
            <span className="hidden md:block text-sm font-medium text-slate-700 dark:text-slate-300 pr-1 select-none">
              {user?.name?.split(' ')[0]}
            </span>
          </button>

          {/* User Account Context Dropdown menu */}
          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2.5 w-56 origin-top-right rounded-xl border border-slate-200/60 dark:border-brand-950/40 bg-white dark:bg-brand-950 p-1.5 shadow-xl dark:shadow-brand-950/30 focus:outline-none z-20 animate-fade-in">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-brand-900/30 mb-1">
                  <p className="text-xs text-slate-400 dark:text-brand-400">Logged in as</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{user?.email}</p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:text-slate-950 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-brand-900/30 transition"
                >
                  <User className="h-4.5 w-4.5 shrink-0" />
                  <span>My Career Profile</span>
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:text-slate-950 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-brand-900/30 transition"
                >
                  <Settings className="h-4.5 w-4.5 shrink-0" />
                  <span>Account Settings</span>
                </Link>

                <div className="h-px bg-slate-100 dark:bg-brand-950/20 my-1" />

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/10 transition"
                >
                  <LogOut className="h-4.5 w-4.5 shrink-0" />
                  <span>Sign out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
