import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  GraduationCap,
  LayoutDashboard,
  FileText,
  Video,
  Map,
  Code,
  Building2,
  FolderGit,
  Users,
  User,
  LogOut,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Upload & ATS', to: '/resume', icon: FileText },
    { name: 'AI Mock Interview', to: '/interview', icon: Video },
    { name: 'Personalized Roadmap', to: '/roadmap', icon: Map },
    { name: 'DSA Tracker', to: '/dsa', icon: Code },
    { name: 'Company Eligibility', to: '/companies', icon: Building2 },
    { name: 'Project Recommendations', to: '/projects', icon: FolderGit },
    { name: 'Community Section', to: '/community', icon: Users },
    { name: 'My Profile', to: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/50 dark:border-brand-900/40 bg-white dark:bg-brand-950 p-5 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding Section */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-brand-900/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-500 to-brand-300 shadow-md shadow-brand-500/20">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              PlaceMentor <span className="text-brand-400">AI</span>
            </span>
          </div>
          {/* Close button for mobile drawer */}
          <button
            type="button"
            className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-brand-900/30 text-slate-500 dark:text-slate-400 lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1 py-6 overflow-y-auto pr-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-500/10 to-brand-300/10 dark:from-brand-500/20 dark:to-brand-300/10 text-brand-600 dark:text-brand-300 border-l-4 border-brand-500 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-brand-900/20 hover:text-slate-900 dark:hover:text-white border-l-4 border-transparent'
                }`
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Logout trigger */}
        <div className="pt-4 border-t border-slate-100 dark:border-brand-900/20">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3.5 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/10 hover:shadow-sm transition-all duration-200"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
