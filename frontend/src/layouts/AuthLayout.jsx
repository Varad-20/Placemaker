import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { GraduationCap, Award, CheckCircle, ArrowRight, Sun, Moon } from 'lucide-react';

export const AuthLayout = ({ children, title, subtitle }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen bg-[#EEEEEE] dark:bg-[#0a2d28] text-slate-800 dark:text-slate-100 transition-colors duration-300 relative">
      {/* Floating Theme Toggle */}
      <div className="absolute top-5 right-5 z-50">
        <button
          onClick={toggleTheme}
          className="rounded-xl p-2.5 bg-white/60 dark:bg-brand-900/40 text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-brand-900/60 transition-all border border-slate-200/30 dark:border-brand-900/30 backdrop-blur-sm shadow-sm"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400 animate-pulse-subtle" /> : <Moon className="h-5 w-5 text-brand-600" />}
        </button>
      </div>
      {/* Brand Sidebar */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 flex-col justify-between p-12 text-white border-r border-brand-600/30">
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-brand-300/20 blur-[100px] animate-pulse-subtle"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-white/10 blur-[100px]"></div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 shadow-lg">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            PlaceMentor <span className="text-brand-200">AI</span>
          </span>
        </div>

        <div className="relative z-10 max-w-lg space-y-8 my-auto">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white ring-1 ring-inset ring-white/20">
              <Award className="h-4 w-4" /> AI Placement Companion
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight sm:text-5xl text-white">
              Elevate Your Placement <br />
              <span className="text-brand-200">
                Readiness Index
              </span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Unlock tailormade resume ATS scores, real-time AI mock interviews with exact grading, structured DSA tracks, and customized career roadmaps.
            </p>
          </div>

          <div className="space-y-4">
            {[
              'Upload resumes for real-time ATS optimization guidelines.',
              'Participate in AI-driven HR & Technical simulated sessions.',
              'Track comprehensive DSA syllabus streaks and eligibility matrices.',
              'Generate dynamic 30/60 days preparation checklists.',
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span className="text-white/85 text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex justify-between items-center text-xs text-white/50">
          <span>© 2026 PlaceMentor AI. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Right Form Area */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-300/15 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-200/20 rounded-full blur-[100px] -z-10"></div>

        <div className="w-full max-w-md space-y-8 bg-white dark:bg-brand-950/60 p-8 rounded-2xl shadow-xl shadow-brand-300/15 border border-brand-100 dark:border-brand-900/30 backdrop-blur-md animate-slide-up">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-brand-300">
              {subtitle}
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;
