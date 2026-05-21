import React from 'react';

const RadialChart = ({ value = 0, size = 180, strokeWidth = 14, title = 'Readiness Index' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative" style={{ width: size, height: size }}>
        {/* SVG Circular Ring Gauge */}
        <svg className="h-full w-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
          {/* Track Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-slate-100 dark:stroke-brand-950/20"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Active Radial Progress Bar */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-brand-500 transition-all duration-1000 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              filter: 'drop-shadow(0 0 6px rgba(155, 48, 255, 0.4))',
            }}
          />
        </svg>

        {/* Dynamic Center Metrics Labels */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
          <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            {value}%
          </span>
          <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-brand-400 uppercase mt-0.5">
            {title}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RadialChart;
