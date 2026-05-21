import React, { useState, useRef } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import {
  Upload, FileText, CheckCircle2, XCircle, AlertCircle,
  BarChart2, Zap, Target, TrendingUp, DownloadCloud, Trash2
} from 'lucide-react';

const keywords = [
  { word: 'React.js', found: true, importance: 'High' },
  { word: 'Node.js', found: true, importance: 'High' },
  { word: 'REST APIs', found: true, importance: 'High' },
  { word: 'MongoDB', found: true, importance: 'Medium' },
  { word: 'System Design', found: false, importance: 'High' },
  { word: 'Kubernetes', found: false, importance: 'Medium' },
  { word: 'TypeScript', found: false, importance: 'Medium' },
  { word: 'Python', found: true, importance: 'Medium' },
  { word: 'CI/CD', found: false, importance: 'Low' },
  { word: 'Agile/Scrum', found: true, importance: 'Low' },
];

const suggestions = [
  { type: 'error', text: 'Add a quantifiable achievement to each work experience bullet (e.g., "Improved API response time by 35%").' },
  { type: 'warning', text: 'Missing skills section — add System Design, Kubernetes, TypeScript to increase ATS match.' },
  { type: 'warning', text: 'Resume length exceeds 1 page for <3 years experience. Consider condensing bullet points.' },
  { type: 'success', text: 'Strong action verbs detected in 80% of bullet points. Keep it up!' },
  { type: 'success', text: 'Education section is well-formatted with CGPA and relevant coursework.' },
];

const ResumePage = () => {
  const { user, updateProfile, uploadResume } = useAuth();
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [extractedDetails, setExtractedDetails] = useState(null);

  const userSkills = extractedDetails?.skills || user?.skills || [];
  
  const keywordsList = [
    { word: 'React.js', found: userSkills.some(s => /react/i.test(s)), importance: 'High' },
    { word: 'Node.js', found: userSkills.some(s => /node/i.test(s)), importance: 'High' },
    { word: 'REST APIs', found: userSkills.some(s => /rest|api/i.test(s)), importance: 'High' },
    { word: 'MongoDB', found: userSkills.some(s => /mongo/i.test(s)), importance: 'Medium' },
    { word: 'System Design', found: userSkills.some(s => /system/i.test(s)), importance: 'High' },
    { word: 'Kubernetes', found: userSkills.some(s => /kubernetes|k8s/i.test(s)), importance: 'Medium' },
    { word: 'TypeScript', found: userSkills.some(s => /typescript|ts/i.test(s)), importance: 'Medium' },
    { word: 'Python', found: userSkills.some(s => /python/i.test(s)), importance: 'Medium' },
    { word: 'CI/CD', found: userSkills.some(s => /ci\/cd|jenkins|actions/i.test(s)), importance: 'Low' },
    { word: 'Agile/Scrum', found: userSkills.some(s => /agile|scrum/i.test(s)), importance: 'Low' },
  ];

  const found = keywordsList.filter(k => k.found).length;
  const total = keywordsList.length;

  const currentCgpa = extractedDetails?.cgpa !== undefined ? extractedDetails.cgpa : user?.cgpa || 8.0;
  const currentBacklogs = extractedDetails?.backlogs !== undefined ? extractedDetails.backlogs : user?.backlogs || 0;
  
  // Calculate dynamic ATS score: base of 40 + (found / total) * 45 + (CGPA / 10) * 15 - backlogs * 5
  const rawScore = Math.round(40 + (found / total) * 45 + (currentCgpa / 10) * 15 - currentBacklogs * 5);
  const score = Math.max(0, Math.min(100, rawScore));

  const handleFile = (f) => {
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setAnalyzed(false);
      setExtractedDetails(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    handleFile(f);
  };

  const runAnalysis = async () => {
    if (!file) return;
    setAnalyzing(true);
    try {
      const res = await uploadResume(file);
      if (res && res.success) {
        setExtractedDetails(res.extractedData);
        setAnalyzed(true);
      } else {
        alert(res?.message || 'Failed to analyze resume.');
      }
    } catch (err) {
      console.error("Failed to analyze resume:", err);
      alert('An error occurred during resume analysis. Make sure the backend server is running.');
    } finally {
      setAnalyzing(false);
    }
  };

  const scoreColor = score >= 80 ? 'text-brand-600' : score >= 60 ? 'text-amber-500' : 'text-rose-500';
  const scoreRing = score >= 80 ? 'stroke-brand-500' : score >= 60 ? 'stroke-amber-400' : 'stroke-rose-400';
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 100) * circumference;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Resume ATS Analyzer</h2>
            <p className="text-sm text-slate-500 mt-0.5">Upload your PDF resume to get an instant ATS compatibility score and improvement tips.</p>
          </div>
          {user?.resumeUrl && (
            <button
              onClick={() => {
                const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
                const hostUrl = baseUrl.replace(/\/api\/?$/, '');
                const fullUrl = `${hostUrl}${user.resumeUrl}`;
                window.open(fullUrl, '_blank');
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-brand-900/30 bg-white dark:bg-brand-950/80 hover:bg-slate-50 dark:hover:bg-brand-900/10 text-slate-700 dark:text-slate-200 font-bold px-4 py-2.5 shadow-sm transition"
            >
              <FileText className="h-4 w-4 text-brand-500" />
              <span>View Current Resume</span>
            </button>
          )}
        </div>

        {/* Active Resume Notification */}
        {user?.resumeUrl && !analyzed && !file && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-brand-500/10 border border-brand-500/15 text-brand-800 dark:text-brand-300 shadow-sm animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow-md shadow-brand-500/25">
                <FileText className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-wider text-brand-700 dark:text-brand-400">Active Resume Detected</p>
                <p className="text-xs font-semibold opacity-90 leading-relaxed">
                  You have an uploaded resume in the system. Click the button to view it, or drag a new PDF below to replace it.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
                const hostUrl = baseUrl.replace(/\/api\/?$/, '');
                const fullUrl = `${hostUrl}${user.resumeUrl}`;
                window.open(fullUrl, '_blank');
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 dark:bg-brand-500/20 dark:hover:bg-brand-500/30 text-white dark:text-brand-300 text-xs font-bold px-4 py-2 shadow-sm transition shrink-0"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>View Active Resume</span>
            </button>
          </div>
        )}

        {/* Upload Area */}
        {!analyzed && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed transition-all p-12 flex flex-col items-center justify-center gap-4 text-center
              ${dragging ? 'border-brand-400 bg-brand-50' : 'border-brand-200 bg-white hover:border-brand-400 hover:bg-brand-50/50'}`}
          >
            <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e => handleFile(e.target.files[0])} />
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-500 to-brand-300 shadow-lg shadow-brand-500/20">
              <Upload className="h-8 w-8 text-white" />
            </div>
            {file ? (
              <div className="space-y-1">
                <p className="font-bold text-slate-800 text-lg">{file.name}</p>
                <p className="text-sm text-slate-400">{(file.size / 1024).toFixed(1)} KB · PDF</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="font-bold text-slate-800 text-lg">Drop your resume here</p>
                <p className="text-sm text-slate-400">or click to browse — PDF format only</p>
              </div>
            )}
          </div>
        )}

        {file && !analyzed && (
          <div className="flex items-center gap-4">
            <button
              onClick={runAnalysis}
              disabled={analyzing}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold px-8 py-3.5 shadow-lg shadow-brand-500/20 hover:from-brand-400 hover:to-brand-600 transition-all disabled:opacity-60"
            >
              {analyzing ? (
                <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /><span>Analyzing...</span></>
              ) : (
                <><Zap className="h-4 w-4" /><span>Run ATS Analysis</span></>
              )}
            </button>
            <button onClick={() => setFile(null)} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-rose-500 transition">
              <Trash2 className="h-4 w-4" /> Remove
            </button>
          </div>
        )}

        {/* Results */}
        {analyzed && (
          <div className="space-y-6 animate-fade-in">
            {/* Re-upload button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button onClick={() => { setFile(null); setAnalyzed(false); }} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:underline">
                  <Upload className="h-4 w-4" /> Upload New Resume
                </button>
                <span className="text-slate-300">·</span>
                <span className="text-sm text-slate-400 font-medium">{file.name}</span>
              </div>
            </div>

            {/* Success Sync Banner */}
            <div className="flex items-start sm:items-center gap-3.5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/15 text-emerald-800 dark:text-emerald-300 shadow-sm animate-fade-in">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/25">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Interactive Profile Synced</p>
                <p className="text-xs font-semibold opacity-90 leading-relaxed">
                  Your credentials have been extracted and saved to your profile: 
                  <span className="font-extrabold ml-1 px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-800 dark:text-emerald-200">CGPA: {currentCgpa}</span>
                  <span className="font-extrabold ml-1 px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-800 dark:text-emerald-200">{extractedDetails?.branch || user?.branch || 'CSE'} Branch</span>
                  <span className="font-extrabold ml-1 px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-800 dark:text-emerald-200">{currentBacklogs} Backlogs</span>
                  <span className="font-extrabold ml-1 px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-800 dark:text-emerald-200">{extractedDetails?.skills?.length || user?.skills?.length || 0} Key Skills</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ATS Score Ring */}
              <div className="rounded-2xl border border-brand-100 bg-white shadow-sm p-6 flex flex-col items-center gap-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">ATS Score</h3>
                <div className="relative h-40 w-40">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" className="stroke-slate-100" strokeWidth="8" fill="transparent" />
                    <circle cx="50" cy="50" r="42" className={scoreRing} strokeWidth="8"
                      strokeDasharray={circumference} strokeDashoffset={offset}
                      strokeLinecap="round" fill="transparent" style={{ transition: 'stroke-dashoffset 1s ease' }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-black ${scoreColor}`}>{score}</span>
                    <span className="text-xs text-slate-400 font-semibold">/ 100</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className={`text-sm font-bold rounded-full px-3 py-1 ${score >= 80 ? 'text-brand-700 bg-brand-50 border border-brand-200' : score >= 60 ? 'text-amber-700 bg-amber-50 border border-amber-200' : 'text-rose-700 bg-rose-50 border border-rose-200'}`}>{score >= 80 ? 'Excellent' : score >= 60 ? 'Needs Improvement' : 'Low Score'}</p>
                  <p className="text-xs text-slate-400 mt-2">Aim for 80+ to pass automated filters</p>
                </div>
              </div>

              {/* Keyword Match */}
              <div className="lg:col-span-2 rounded-2xl border border-brand-100 bg-white shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-700">Keyword Analysis</h3>
                  <span className="text-xs font-bold text-brand-600 bg-brand-50 border border-brand-200 rounded-full px-3 py-1">{found}/{total} Matched</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {keywordsList.map((kw, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2">
                        {kw.found
                          ? <CheckCircle2 className="h-4 w-4 text-brand-500 shrink-0" />
                          : <XCircle className="h-4 w-4 text-rose-400 shrink-0" />}
                        <span className="text-xs font-semibold text-slate-700">{kw.word}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        kw.importance === 'High' ? 'text-rose-600 bg-rose-50' :
                        kw.importance === 'Medium' ? 'text-amber-600 bg-amber-50' :
                        'text-slate-500 bg-slate-100'}`}>{kw.importance}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="rounded-2xl border border-brand-100 bg-white shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-700 mb-4">Improvement Suggestions</h3>
              <div className="space-y-3">
                {suggestions.map((s, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3.5 rounded-xl border text-sm
                    ${s.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-700' :
                      s.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                      'bg-brand-50 border-brand-100 text-brand-700'}`}>
                    {s.type === 'error' ? <XCircle className="h-4 w-4 shrink-0 mt-0.5" /> :
                     s.type === 'warning' ? <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /> :
                     <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />}
                    <p>{s.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ResumePage;
