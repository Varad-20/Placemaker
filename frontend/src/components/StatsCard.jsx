import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, description, trend, trendType, color = 'brand', onClick }) => {
  const colorMap = {
    brand: 'from-brand-500/20 to-indigo-500/20 text-brand-600 dark:text-brand-400 border-brand-500/10 dark:border-brand-500/20',
    green: 'from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/10 dark:border-emerald-500/20',
    blue: 'from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400 border-blue-500/10 dark:border-blue-500/20',
    orange: 'from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border-amber-500/10 dark:border-amber-500/20',
    rose: 'from-rose-500/20 to-pink-500/20 text-rose-600 dark:text-rose-400 border-rose-500/10 dark:border-rose-500/20',
  };

  return (
    <div 
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-brand-900/30 bg-white dark:bg-brand-950/80 p-6 shadow-sm dark:shadow-brand-950/20 hover:shadow-md transition-all duration-300 group hover:-translate-y-1 ${onClick ? 'cursor-pointer hover:border-blue-500/40 dark:hover:border-blue-500/40' : ''}`}
    >
      {/* Decorative gradient glow background on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

      <div className="flex items-start justify-between">
        <div className="space-y-2.5">
          <p className="text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase">
            {title}
          </p>
          <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {value}
          </h3>
        </div>

        {/* Dynamic theme matching icon box wrapper */}
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br border ${colorMap[color] || colorMap.brand}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs font-medium text-slate-400 dark:text-brand-300/60 truncate pr-2">
          {description}
        </p>

        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
              trendType === 'positive'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            }`}
          >
            {trendType === 'positive' ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            <span>{trend}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
