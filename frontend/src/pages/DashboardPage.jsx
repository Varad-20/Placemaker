import React from 'react';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../layouts/DashboardLayout';
import StatsCard from '../components/StatsCard';
import ProgressBar from '../components/ProgressBar';
import RadialChart from '../components/RadialChart';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Video,
  Award,
  Calendar,
  CheckSquare,
  ChevronRight,
  TrendingUp,
  Building,
  Activity,
  Code
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleOpenResume = () => {
    if (user?.resumeUrl) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const hostUrl = baseUrl.replace(/\/api\/?$/, '');
      const fullUrl = `${hostUrl}${user.resumeUrl}`;
      window.open(fullUrl, '_blank');
    } else {
      navigate('/resume');
    }
  };

  // Dynamic user data variables or custom mock metrics for Phase 1
  const readinessScore = user?.placementReadinessScore || 45; // Default starter score
  const resumeScore = user?.atsScore || 0;

  // Checklist of recommended tasks
  const recommendedTasks = [
    {
      id: 1,
      title: 'Optimize Resume Profile',
      desc: 'Upload a PDF resume to identify keyword discrepancies.',
      to: '/resume',
      done: resumeScore > 0,
    },
    {
      id: 2,
      title: 'Start AI Mock Interview',
      desc: 'Engage with simulated technical or behavioral screens.',
      to: '/interview',
      done: false,
    },
    {
      id: 3,
      title: 'Maintain your DSA streak',
      desc: 'Complete 3 problem sets to build algorithm momentum.',
      to: '/dsa',
      done: false,
    },
  ];

  // Mock Roadmap preview for Phase 1
  const roadmapPreview = [
    { day: 'Day 12', title: 'Implement QuickSort Algorithm & analyze complexity', category: 'DSA', completed: true },
    { day: 'Day 13', title: 'Simulate 15m behavioral HR screen', category: 'Communication', completed: false },
    { day: 'Day 14', title: 'Add industry-standard action words to experience bullet points', category: 'Resume building', completed: false },
  ];

  // Mock target companies for Phase 1
  const recommendedCompanies = [
    { name: 'Google', minCGPA: 8.5, package: '32 LPA', skills: ['DSA', 'System Design', 'Go/C++'], eligible: (user?.cgpa || 0) >= 8.5 },
    { name: 'Microsoft', minCGPA: 8.0, package: '28 LPA', skills: ['DSA', 'OOPs', 'C#/Java'], eligible: (user?.cgpa || 0) >= 8.0 },
    { name: 'Amazon', minCGPA: 7.5, package: '25 LPA', skills: ['DSA', 'DBMS', 'Linux'], eligible: (user?.cgpa || 0) >= 7.5 },
    { name: 'SaaS Startup', minCGPA: 7.0, package: '18 LPA', skills: ['React', 'Node.js', 'MongoDB'], eligible: (user?.cgpa || 0) >= 7.0 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Dynamic User Banner Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 p-6 md:p-8 text-white shadow-md border border-brand-900/30">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-brand-500/10 blur-[80px]" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/20 px-2.5 py-0.5 text-xs font-semibold text-brand-300">
                <Activity className="h-3 w-3" /> System Calibrated
              </span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                Welcome back, {user?.name}!
              </h2>
              <p className="text-xs md:text-sm text-slate-300 max-w-xl font-medium">
                Your profile index has been evaluated. Your current target is{' '}
                <span className="font-bold text-white underline decoration-brand-400 decoration-2 underline-offset-4">
                  {user?.targetRole || 'Software Engineer'}
                </span>{' '}
                at{' '}
                <span className="font-semibold text-brand-200">
                  {user?.college || 'University'}
                </span>.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 shrink-0">
              <Link
                to="/resume"
                className="rounded-xl bg-white text-brand-800 hover:bg-slate-100 text-xs font-bold px-4 py-2.5 shadow-sm transition"
              >
                Upload Resume
              </Link>
              <Link
                to="/interview"
                className="rounded-xl bg-brand-600 text-white hover:bg-brand-500 text-xs font-bold px-4 py-2.5 shadow-md shadow-brand-500/20 transition"
              >
                Mock Interview
              </Link>
            </div>
          </div>
        </div>

        {/* Core Index Row & Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Readiness index card */}
          <div className="rounded-2xl border border-slate-200/60 dark:border-brand-900/30 bg-white dark:bg-brand-950/80 p-6 flex flex-col md:flex-row lg:flex-col items-center justify-center gap-6 shadow-sm dark:shadow-brand-950/15">
            <RadialChart value={readinessScore} size={160} />
            <div className="space-y-3.5 flex-1 w-full text-center md:text-left lg:text-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Readiness Evaluation Index
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto md:mx-0 lg:mx-auto">
                {readinessScore < 50
                  ? 'Your placement index stands in the moderate bracket. Upload resumes and participate in mock interviews to push indices higher.'
                  : 'Great index metrics! You are exceeding eligibility parameters for most target companies.'}
              </p>
              <ProgressBar percent={readinessScore} label="Global Readiness Level" color="brand" />
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatsCard
              title="ATS Resume Benchmark"
              value={resumeScore > 0 ? `${resumeScore}/100` : 'Not Uploaded'}
              icon={FileText}
              description={resumeScore > 0 ? 'Optimal keywords and formatting scores' : 'Upload resume to calibrate parsing indices'}
              trend={resumeScore > 0 ? 'Verified' : 'Action Required'}
              trendType={resumeScore > 0 ? 'positive' : 'negative'}
              color="blue"
              onClick={handleOpenResume}
            />
            <StatsCard
              title="Mock Interview Score"
              value="82%"
              icon={Video}
              description="Last Technical Round: Soft Skills need minor tuning"
              trend="+4% Improvement"
              trendType="positive"
              color="green"
            />
            <StatsCard
              title="DSA Tracker Streak"
              value="5 Days"
              icon={Code}
              description="Solved 42 Binary/DP problem sets"
              trend="Streaking"
              trendType="positive"
              color="orange"
            />
            <StatsCard
              title="Eligibility Status"
              value={`${recommendedCompanies.filter((c) => c.eligible).length} / ${recommendedCompanies.length}`}
              icon={Building}
              description="Eligible for target package pipelines"
              trend="Match Ready"
              trendType="positive"
              color="brand"
            />
          </div>
        </div>

        {/* Lower Grid splits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 1: Roadmap Checklist & Task list */}
          <div className="space-y-6">
            {/* Recommended Tasks Checklist */}
            <div className="rounded-2xl border border-slate-200/60 dark:border-brand-900/30 bg-white dark:bg-brand-950/80 p-6 shadow-sm dark:shadow-brand-950/15">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                Recommended Milestones
              </h3>
              <div className="space-y-3.5">
                {recommendedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start justify-between gap-4 p-3 rounded-xl border border-slate-100 dark:border-brand-900/15 bg-slate-50/50 dark:bg-brand-900/10 hover:bg-slate-50 dark:hover:bg-brand-900/15 transition"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={task.done}
                        readOnly
                        className="rounded border-slate-300 dark:border-brand-950 text-brand-600 focus:ring-brand-500 mt-1 cursor-not-allowed"
                      />
                      <div>
                        <h4 className={`text-xs font-bold ${task.done ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                          {task.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{task.desc}</p>
                      </div>
                    </div>
                    {!task.done && (
                      <Link
                        to={task.to}
                        className="rounded-lg p-1 text-brand-600 dark:text-brand-400 hover:bg-brand-500/10"
                      >
                        <ChevronRight className="h-4.5 w-4.5" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Roadmap Schedule */}
            <div className="rounded-2xl border border-slate-200/60 dark:border-brand-900/30 bg-white dark:bg-brand-950/80 p-6 shadow-sm dark:shadow-brand-950/15">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  30-Day Preparation Roadmap
                </h3>
                <Link
                  to="/roadmap"
                  className="inline-flex items-center gap-0.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  <span>View Full Roadmap</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="space-y-3">
                {roadmapPreview.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 dark:border-brand-900/20 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="shrink-0 text-xs font-extrabold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-md">
                        {item.day}
                      </span>
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate min-w-0">
                        {item.title}
                      </p>
                    </div>
                    <span className="shrink-0 text-[9px] font-bold text-slate-500 dark:text-brand-400 bg-slate-100 dark:bg-brand-900/25 px-2 py-0.5 rounded-full border border-slate-200/30 dark:border-brand-900/30">
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Target Companies eligibility index */}
          <div className="rounded-2xl border border-slate-200/60 dark:border-brand-900/30 bg-white dark:bg-brand-950/80 p-6 shadow-sm dark:shadow-brand-950/15">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Company Eligibility Pipelines
              </h3>
              <Link
                to="/companies"
                className="inline-flex items-center gap-0.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                <span>Check Details</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {recommendedCompanies.map((company, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-100 dark:border-brand-900/15 bg-slate-50/50 dark:bg-brand-900/10 hover:bg-slate-50 dark:hover:bg-brand-900/15 transition flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                        {company.name}
                      </h4>
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                        {company.package}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {company.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[8px] font-semibold text-slate-500 dark:text-brand-400/70 bg-slate-100 dark:bg-brand-950/20 px-1.5 py-0.5 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        company.eligible
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${company.eligible ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span>{company.eligible ? 'Eligible' : 'Ineligible'}</span>
                    </span>
                    <p className="text-[9px] text-slate-400 mt-1">Min CGPA: {company.minCGPA}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
