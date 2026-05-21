import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import {
  Building2, Search, CheckCircle2, AlertCircle, XCircle, Award,
  MapPin, Calendar, Briefcase, GraduationCap, RefreshCw, ChevronRight, Lock
} from 'lucide-react';

const mockCompanies = [
  { id: 1, name: 'Google', minCGPA: 8.5, package: '32 LPA', skills: ['DSA', 'System Design', 'Go/C++'], branch: ['CSE', 'ECE'], backlogs: 0, logo: 'G' },
  { id: 2, name: 'Microsoft', minCGPA: 8.0, package: '28 LPA', skills: ['DSA', 'OOPs', 'C#/Java'], branch: ['CSE', 'ECE', 'EE'], backlogs: 0, logo: 'M' },
  { id: 3, name: 'Amazon', minCGPA: 7.5, package: '25 LPA', skills: ['DSA', 'DBMS', 'Linux'], branch: ['CSE', 'ECE', 'ME', 'CE'], backlogs: 0, logo: 'A' },
  { id: 4, name: 'TCS Digital', minCGPA: 7.0, package: '7.5 LPA', skills: ['Python', 'SQL', 'SDLC'], branch: ['All'], backlogs: 1, logo: 'T' },
  { id: 5, name: 'Zoho Corporation', minCGPA: 6.5, package: '8 LPA', skills: ['C', 'Java', 'Web Dev'], branch: ['All'], backlogs: 2, logo: 'Z' },
  { id: 6, name: 'SaaS Startup', minCGPA: 7.0, package: '18 LPA', skills: ['React', 'Node.js', 'MongoDB'], branch: ['CSE', 'ECE'], backlogs: 0, logo: 'S' }
];

const CompaniesPage = () => {
  const { user } = useAuth();
  
  const [cgpa, setCgpa] = useState(user?.cgpa || 7.8);
  const [branch, setBranch] = useState(user?.branch || 'CSE');
  const [backlogs, setBacklogs] = useState(user?.backlogs || 0);
  const [userSkills, setUserSkills] = useState(user?.skills && user.skills.length > 0 ? user.skills : ['React', 'Node.js', 'MongoDB', 'SQL', 'DSA']);
  const [selectedComp, setSelectedComp] = useState(mockCompanies[0]);
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState('all');

  // Sync state with the user context profile whenever user data changes
  useEffect(() => {
    if (user) {
      if (user.cgpa !== undefined && user.cgpa !== null) setCgpa(user.cgpa);
      if (user.branch !== undefined && user.branch !== null) setBranch(user.branch);
      if (user.backlogs !== undefined && user.backlogs !== null) setBacklogs(user.backlogs);
      if (user.skills !== undefined && Array.isArray(user.skills) && user.skills.length > 0) {
        setUserSkills(user.skills);
      }
    }
  }, [user]);

  const checkEligibility = (company) => {
    const cgpaOk = cgpa >= company.minCGPA;
    const branchOk = company.branch.includes('All') || company.branch.includes(branch);
    const backlogsOk = backlogs <= company.backlogs;
    return {
      eligible: cgpaOk && branchOk && backlogsOk,
      cgpaOk,
      branchOk,
      backlogsOk
    };
  };

  // Sort and pre-evaluate eligibility: eligible first, then high-paying package LPA first
  const processedCompanies = useMemo(() => {
    return [...mockCompanies]
      .map(comp => ({
        ...comp,
        status: checkEligibility(comp)
      }))
      .sort((a, b) => {
        // 1. Eligible first
        if (a.status.eligible && !b.status.eligible) return -1;
        if (!a.status.eligible && b.status.eligible) return 1;

        // 2. High-paying package (LPA) descending
        const packageA = parseFloat(a.package);
        const packageB = parseFloat(b.package);
        return packageB - packageA;
      });
  }, [cgpa, branch, backlogs]);

  // Apply filters
  const allFiltered = useMemo(() => {
    return processedCompanies.filter(comp =>
      comp.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [processedCompanies, search]);

  const eligibleFiltered = useMemo(() => {
    return allFiltered.filter(comp => comp.status.eligible);
  }, [allFiltered]);

  const displayedCompanies = filterTab === 'eligible' ? eligibleFiltered : allFiltered;

  // Auto-adjust selected company if it is not in the currently displayed list
  useEffect(() => {
    if (displayedCompanies.length > 0) {
      const isStillVisible = displayedCompanies.some(c => c.id === selectedComp?.id);
      if (!isStillVisible) {
        setSelectedComp(displayedCompanies[0]);
      }
    } else {
      setSelectedComp(null);
    }
  }, [displayedCompanies, selectedComp]);

  // Skill gap analysis
  const missingSkills = selectedComp ? selectedComp.skills.filter(s => !userSkills.includes(s)) : [];
  const elStatus = selectedComp ? checkEligibility(selectedComp) : { eligible: false, cgpaOk: false, branchOk: false, backlogsOk: false };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Building2 className="h-6 w-6 text-brand-500" /> Company Eligibility Checker
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Instantly evaluate your placement qualifications, CGPA criteria, and identify skill match benchmarks.
          </p>
        </div>

        {/* PROFILE ADJUSTMENT HUB */}
        <div className="rounded-2xl border border-slate-200/60 dark:border-brand-900/30 bg-white dark:bg-brand-950/80 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
              <GraduationCap className="h-4.5 w-4.5 text-brand-500" /> Interactive Placement Profile HUD
            </h3>
            <Link
              to="/resume"
              className="inline-flex items-center gap-1 text-[10px] font-black text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 transition"
            >
              <RefreshCw className="h-3 w-3" /> Update Profile / Upload Resume
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                Your Current CGPA 
                <span className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 px-1.5 py-0.5 rounded flex items-center gap-0.5 uppercase tracking-wider">
                  <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500 shrink-0" /> Verified
                </span>
              </label>
              <div className="flex items-center gap-3">
                <div className="relative w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-800/60">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${(cgpa / 10) * 100}%` }}
                  />
                </div>
                <span className="font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1.5 text-xs">
                  <Lock className="h-3 w-3 text-emerald-600 dark:text-emerald-500 shrink-0" />
                  {cgpa.toFixed(1)}
                </span>
              </div>
              <p className="text-[9px] text-slate-400 dark:text-slate-500">Locked and verified from your parsed resume.</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                Academic Branch <Lock className="h-3 w-3 text-slate-400 dark:text-slate-500 shrink-0" />
              </label>
              <div className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2.5 font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span>
                  {branch === 'CSE' ? 'Computer Science (CSE)' :
                   branch === 'ECE' ? 'Electronics (ECE)' :
                   branch === 'EE' ? 'Electrical (EE)' :
                   branch === 'ME' ? 'Mechanical (ME)' :
                   branch === 'CE' ? 'Civil Engineering (CE)' : branch}
                </span>
              </div>
              <p className="text-[9px] text-slate-400 dark:text-slate-500">Synced from your student profile.</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                Active History Backlogs <Lock className="h-3 w-3 text-slate-400 dark:text-slate-500 shrink-0" />
              </label>
              <div className="flex gap-2">
                {[0, 1, 2].map((num) => (
                  <div
                    key={num}
                    className={`flex-1 py-2.5 rounded-xl font-bold border text-center transition select-none text-[10px]
                      ${backlogs === num
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 font-extrabold'
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500'}`}
                  >
                    {num} Backlogs {backlogs === num && '✓'}
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-slate-400 dark:text-slate-500">Verified backlog history check.</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                Key Skills Mapped <Lock className="h-3 w-3 text-slate-400 dark:text-slate-500 shrink-0" />
              </label>
              <p className="text-[10px] text-slate-400 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl leading-normal border border-slate-100 dark:border-slate-800 italic">
                {userSkills.join(', ')}
              </p>
              <p className="text-[9px] text-slate-400 dark:text-slate-500">Extracted from your resume.</p>
            </div>
          </div>
        </div>

        {/* PRIMARY SPLITS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-200/60 dark:border-brand-900/30 bg-white dark:bg-brand-950/80 shadow-sm p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">Recruiting pipelines</h3>
                  
                  {/* Glassmorphic Tabs Selector */}
                  <div className="flex bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl w-fit border border-slate-200/50 dark:border-slate-800/80">
                    <button
                      onClick={() => setFilterTab('all')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wide transition flex items-center gap-1.5
                        ${filterTab === 'all'
                          ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm border border-slate-200/10'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                    >
                      All Pipelines
                      <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold transition-colors
                        ${filterTab === 'all' 
                          ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400' 
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                        {allFiltered.length}
                      </span>
                    </button>
                    <button
                      onClick={() => setFilterTab('eligible')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wide transition flex items-center gap-1.5
                        ${filterTab === 'eligible'
                          ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/10'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                    >
                      Shortlisted / Eligible
                      <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold transition-colors
                        ${filterTab === 'eligible' 
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                        {eligibleFiltered.length}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="relative max-w-xs w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search company..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[10px] text-slate-800 dark:text-slate-200 outline-none focus:border-brand-500 dark:focus:border-brand-400 transition"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {displayedCompanies.map((comp) => {
                  const isSel = selectedComp?.id === comp.id;
                  const status = comp.status;

                  return (
                    <div
                      key={comp.id}
                      onClick={() => setSelectedComp(comp)}
                      className={`cursor-pointer p-4 rounded-xl border transition flex items-center justify-between gap-4
                        ${isSel
                          ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/30 shadow-sm'
                          : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 hover:border-brand-300 dark:hover:border-brand-500 hover:bg-white dark:hover:bg-brand-950/20'}`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`h-11 w-11 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white font-black text-sm flex items-center justify-center shadow shadow-brand-500/10 shrink-0`}>
                          {comp.logo}
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{comp.name}</h4>
                            <span className="text-[9px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded-full border border-brand-200 dark:border-brand-800/80">{comp.package}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 text-[9px] font-bold text-slate-400 dark:text-slate-500">
                            <span>Min CGPA: {comp.minCGPA}</span>
                            <span>·</span>
                            <span>Max Backlogs: {comp.backlogs}</span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          status.eligible
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${status.eligible ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span>{status.eligible ? 'Eligible' : 'Ineligible'}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}

                {displayedCompanies.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
                    <Building2 className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No recruitment pipelines found</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 max-w-[280px]">
                      {filterTab === 'eligible' 
                        ? 'Try updating your resume profile to meet eligibility parameters or search for a different name.' 
                        : 'Adjust your search filters or try a different keyword.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Selected Panel */}
          <div className="space-y-6">
            {selectedComp ? (
              <div className="rounded-2xl border border-slate-200/60 dark:border-brand-900/30 bg-white dark:bg-brand-950/80 p-6 shadow-sm flex flex-col justify-between gap-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3 space-y-1">
                  <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Detail checker</span>
                  <h4 className="text-sm font-black text-slate-800 dark:text-white">{selectedComp.name} Requirements</h4>
                </div>

                {/* Requirements Status checks */}
                <div className="space-y-3.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-between">
                    <span>CGPA Requirement (&gt;= {selectedComp.minCGPA}):</span>
                    {elStatus.cgpaOk ? (
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Branch Qualified ({selectedComp.branch.join('/')}):</span>
                    {elStatus.branchOk ? (
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Backlogs Safe (&lt;= {selectedComp.backlogs}):</span>
                    {elStatus.backlogsOk ? (
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                    )}
                  </div>
                </div>

                {/* Skill Gap Section */}
                <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 space-y-3">
                  <h5 className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Skill Gap analysis</h5>
                  {missingSkills.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-rose-600 dark:text-rose-400 text-xs font-medium">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <p>Missing {missingSkills.length} target skills: <span className="font-extrabold">{missingSkills.join(', ')}</span></p>
                      </div>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 leading-normal">Consider checking corresponding DSA practice paths or building templated systems.</p>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                      <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                      <span>Skill match verified! Ready to apply.</span>
                    </div>
                  )}
                </div>

                <button
                  disabled={!elStatus.eligible}
                  className="w-full text-center rounded-xl font-bold p-3 text-xs transition-all shadow-md
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:shadow-none
                    bg-gradient-to-r from-brand-500 to-brand-700 text-white hover:from-brand-600 hover:to-brand-800 shadow-brand-500/20"
                >
                  {elStatus.eligible ? 'Register for Placement Drive' : 'Criteria Not Met'}
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200/60 dark:border-brand-900/30 bg-white dark:bg-brand-950/80 p-6 shadow-sm text-center py-12 flex flex-col items-center justify-center">
                <AlertCircle className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No company selected</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 max-w-[180px]">Select a recruitment pipeline to inspect requirements.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CompaniesPage;

