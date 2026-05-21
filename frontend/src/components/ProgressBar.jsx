import React from 'react';

const ProgressBar = ({ percent, label, subtitle, showPercentage = true, color = 'brand' }) => {
  const normalizedPercent = Math.min(Math.max(0, percent), 100);

  const colorStyles = {
    brand: 'bg-gradient-to-r from-brand-600 to-brand-700',
    green: 'bg-gradient-to-r from-emerald-600 to-teal-500',
    blue: 'bg-gradient-to-r from-blue-600 to-indigo-500',
    orange: 'bg-gradient-to-r from-amber-600 to-orange-500',
    rose: 'bg-gradient-to-r from-rose-600 to-pink-500',
  };

  return (
    <div className="space-y-1.5 w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-semibold">
          {label && <span className="text-slate-600 dark:text-slate-300">{label}</span>}
          {showPercentage && (
            <span className="text-brand-600 dark:text-brand-400">{normalizedPercent}%</span>
          )}
        </div>
      )}

      {/* Progress background track */}
      <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-brand-950/20 overflow-hidden border border-slate-200/20 dark:border-brand-950/10">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${colorStyles[color] || colorStyles.brand}`}
          style={{ width: `${normalizedPercent}%` }}
        />
      </div>

      {subtitle && (
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-medium text-slate-400 dark:text-brand-400/50">{subtitle}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
