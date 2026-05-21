import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Sparkles, ArrowRight } from 'lucide-react';

const PlaceholderPage = ({ title, subtitle, icon: Icon }) => {
  return (
    <DashboardLayout>
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center p-6">
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-ping rounded-full bg-brand-500/10 opacity-75"></div>
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-500 to-indigo-500 text-white shadow-xl shadow-brand-500/20">
            <Icon className="h-8 w-8" />
          </div>
        </div>

        <div className="max-w-md space-y-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-brand-500 dark:text-brand-300 ring-1 ring-inset ring-brand-500/20 uppercase">
            <Sparkles className="h-3 w-3" /> Under AI Calibration
          </span>

          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl leading-tight">
            {title} Module
          </h2>

          <p className="text-sm text-slate-500 dark:text-brand-300/60 leading-relaxed">
            {subtitle}. The core machine learning APIs are currently being integrated for real-time evaluations.
          </p>

          <div className="pt-4">
            <button
              onClick={() => (window.location.href = '/dashboard')}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 hover:bg-slate-900 dark:bg-brand-950/40 dark:hover:bg-brand-950/70 border border-slate-200/10 dark:border-brand-900/30 text-xs font-semibold text-slate-300 hover:text-white px-5 py-3 transition"
            >
              <span>Back to Readiness Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlaceholderPage;
