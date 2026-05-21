import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../layouts/AuthLayout';
import { User, Mail, Lock, Building, GraduationCap, Code, Target, Calendar, AlertCircle, Award } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    branch: '',
    cgpa: '',
    skillsInput: '', // Temporary skill tags string
    targetRole: '',
    graduationYear: new Date().getFullYear() + 1,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Pre-validate inputs
    if (parseFloat(formData.cgpa) < 0 || parseFloat(formData.cgpa) > 10) {
      setError('CGPA must be a value between 0 and 10');
      return;
    }

    setLoading(true);

    // Convert CSV skills string into arrays of trimmed skills
    const skillsArray = formData.skillsInput
      ? formData.skillsInput.split(',').map((skill) => skill.trim()).filter((s) => s.length > 0)
      : [];

    const finalPayload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      college: formData.college,
      branch: formData.branch,
      cgpa: parseFloat(formData.cgpa),
      skills: skillsArray,
      targetRole: formData.targetRole,
      graduationYear: parseInt(formData.graduationYear),
    };

    try {
      const res = await register(finalPayload);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Failed to create account. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Register to start tracking placement readiness indices."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Notification */}
        {error && (
          <div className="flex items-start gap-2.5 rounded-xl bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-500/15">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <p className="flex-1">{error}</p>
          </div>
        )}

        {/* Dynamic form field groups */}
        <div className="space-y-2 max-h-[52vh] overflow-y-auto pr-1">
          {/* Section 1: Core Credentials */}
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-brand-400/80">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-slate-200 dark:border-brand-950/30 bg-slate-50 dark:bg-brand-950/40 py-3 pl-10 pr-4 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-brand-950/60 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-brand-400/80">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@university.edu"
                    className="w-full rounded-xl border border-slate-200 dark:border-brand-950/30 bg-slate-50 dark:bg-brand-950/40 py-3 pl-10 pr-4 text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-brand-400/80">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 dark:border-brand-950/30 bg-slate-50 dark:bg-brand-950/40 py-3 pl-10 pr-4 text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-brand-950/20 my-1" />

          {/* Section 2: Education Detail Group */}
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-brand-400/80">
                College / University
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Building className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  name="college"
                  required
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Indian Institute of Technology"
                  className="w-full rounded-xl border border-slate-200 dark:border-brand-950/30 bg-slate-50 dark:bg-brand-950/40 py-3 pl-10 pr-4 text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-brand-400/80">
                  Branch / Department
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <GraduationCap className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    name="branch"
                    required
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="Computer Science"
                    className="w-full rounded-xl border border-slate-200 dark:border-brand-950/30 bg-slate-50 dark:bg-brand-950/40 py-3 pl-10 pr-4 text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-brand-400/80">
                  CGPA Score
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Award className="h-4 w-4" />
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    name="cgpa"
                    required
                    min="0"
                    max="10"
                    value={formData.cgpa}
                    onChange={handleChange}
                    placeholder="8.75"
                    className="w-full rounded-xl border border-slate-200 dark:border-brand-950/30 bg-slate-50 dark:bg-brand-950/40 py-3 pl-10 pr-4 text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-brand-950/20 my-1" />

          {/* Section 3: Professional Preference Detail Group */}
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-brand-400/80">
                Skills (Comma Separated)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Code className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  name="skillsInput"
                  value={formData.skillsInput}
                  onChange={handleChange}
                  placeholder="React, Node.js, Python, DSA, SQL"
                  className="w-full rounded-xl border border-slate-200 dark:border-brand-950/30 bg-slate-50 dark:bg-brand-950/40 py-3 pl-10 pr-4 text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-brand-400/80">
                  Target Career Role
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Target className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    name="targetRole"
                    required
                    value={formData.targetRole}
                    onChange={handleChange}
                    placeholder="Software Engineer"
                    className="w-full rounded-xl border border-slate-200 dark:border-brand-950/30 bg-slate-50 dark:bg-brand-950/40 py-3 pl-10 pr-4 text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-brand-400/80">
                  Graduation Year
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <input
                    type="number"
                    name="graduationYear"
                    required
                    value={formData.graduationYear}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 dark:border-brand-950/30 bg-slate-50 dark:bg-brand-950/40 py-3 pl-10 pr-4 text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Form */}
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-sm font-bold text-white py-3.5 px-4 shadow-lg shadow-brand-500/20 transition-all outline-none disabled:opacity-50"
        >
          {loading ? (
            <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <span>Create Profile</span>
          )}
        </button>

        {/* Redirect signin link */}
        <p className="text-center text-xs text-slate-500 dark:text-brand-300/60 mt-3">
          Already registered?{' '}
          <Link
            to="/login"
            className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Sign In Instead
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
