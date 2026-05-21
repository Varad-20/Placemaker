import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../layouts/DashboardLayout';
import { User, Mail, Building, GraduationCap, Target, Calendar, Award, Code, Check, AlertCircle } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    branch: user?.branch || '',
    cgpa: user?.cgpa || '',
    targetRole: user?.targetRole || '',
    graduationYear: user?.graduationYear || new Date().getFullYear(),
    skillsInput: user?.skills?.join(', ') || '',
  });

  const [success, setSuccess] = useState(false);
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
    setSuccess(false);
    setError('');

    // Pre-validate CGPA
    if (parseFloat(formData.cgpa) < 0 || parseFloat(formData.cgpa) > 10) {
      setError('CGPA must be a value between 0 and 10');
      return;
    }

    setLoading(true);

    // Convert CSV skills back to an array
    const skillsArray = formData.skillsInput
      ? formData.skillsInput.split(',').map((skill) => skill.trim()).filter((s) => s.length > 0)
      : [];

    const finalPayload = {
      name: formData.name,
      college: formData.college,
      branch: formData.branch,
      cgpa: parseFloat(formData.cgpa),
      targetRole: formData.targetRole,
      graduationYear: parseInt(formData.graduationYear),
      skills: skillsArray,
    };

    try {
      const res = await updateProfile(finalPayload);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Failed to update profile details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'PM';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Profile Card Intro Header */}
        <div className="rounded-2xl border border-slate-200/60 dark:border-brand-900/30 bg-white dark:bg-brand-950/80 p-6 shadow-sm dark:shadow-brand-950/15 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-700 text-2xl font-black text-white shadow-lg shadow-brand-500/20">
            {getInitials(user?.name)}
          </div>
          <div className="space-y-1.5 text-center sm:text-left min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
              {user?.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-brand-400 font-semibold uppercase tracking-wider">
              Targeting {user?.targetRole || 'Software Engineer'}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Building className="h-3.5 w-3.5" /> {user?.college}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" /> {user?.email}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Form Details container */}
        <div className="rounded-2xl border border-slate-200/60 dark:border-brand-900/30 bg-white dark:bg-brand-950/80 p-6 md:p-8 shadow-sm dark:shadow-brand-950/15">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">
            Career Profile Credentials
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Status alerts */}
            {success && (
              <div className="flex items-center gap-2.5 rounded-xl bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/15">
                <Check className="h-4.5 w-4.5 shrink-0" />
                <p>Profile details updated successfully!</p>
              </div>
            )}
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl bg-rose-500/10 p-4 text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-500/15">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <p className="flex-1">{error}</p>
              </div>
            )}

            {/* Input grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-brand-400/80">
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
                    className="w-full rounded-xl border border-slate-200 dark:border-brand-900/30 bg-slate-50 dark:bg-[#130d29] py-3 pl-10 pr-4 text-xs text-slate-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-[#0c0817] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email (Read Only for security) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-brand-400/80">
                  Email Address (Verified)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full rounded-xl border border-slate-200/50 dark:border-brand-900/20 bg-slate-100/50 dark:bg-brand-900/15 py-3 pl-10 pr-4 text-xs text-slate-400 dark:text-slate-500 outline-none cursor-not-allowed select-none"
                  />
                </div>
              </div>

              {/* College */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-brand-400/80">
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
                    className="w-full rounded-xl border border-slate-200 dark:border-brand-900/30 bg-slate-50 dark:bg-[#130d29] py-3 pl-10 pr-4 text-xs text-slate-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-[#0c0817] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Branch */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-brand-400/80">
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
                    className="w-full rounded-xl border border-slate-200 dark:border-brand-900/30 bg-slate-50 dark:bg-[#130d29] py-3 pl-10 pr-4 text-xs text-slate-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-[#0c0817] outline-none transition-all"
                  />
                </div>
              </div>

              {/* CGPA */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-brand-400/80">
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
                    className="w-full rounded-xl border border-slate-200 dark:border-brand-900/30 bg-slate-50 dark:bg-[#130d29] py-3 pl-10 pr-4 text-xs text-slate-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-[#0c0817] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Target Role */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-brand-400/80">
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
                    className="w-full rounded-xl border border-slate-200 dark:border-brand-900/30 bg-slate-50 dark:bg-[#130d29] py-3 pl-10 pr-4 text-xs text-slate-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-[#0c0817] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Graduation Year */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-brand-400/80">
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
                    className="w-full rounded-xl border border-slate-200 dark:border-brand-900/30 bg-slate-50 dark:bg-[#130d29] py-3 pl-10 pr-4 text-xs text-slate-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-[#0c0817] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Skills CSV Input field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-brand-400/80">
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
                    className="w-full rounded-xl border border-slate-200 dark:border-brand-900/30 bg-slate-50 dark:bg-[#130d29] py-3 pl-10 pr-4 text-xs text-slate-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-[#0c0817] outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Display parsed current skills */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-brand-400/60">
                Skills Tags Preview
              </label>
              <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-slate-100 dark:border-brand-900/20 bg-slate-50/50 dark:bg-brand-900/10 min-h-[3.5rem]">
                {formData.skillsInput
                  ? formData.skillsInput
                      .split(',')
                      .map((s) => s.trim())
                      .filter((s) => s.length > 0)
                      .map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-lg border border-brand-500/20"
                        >
                          {skill}
                        </span>
                      ))
                  : <span className="text-xs text-slate-400 dark:text-slate-500 self-center">No skills listed yet. Add skills separated by commas above.</span>}
              </div>
            </div>

            {/* Form submit */}
            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-brand-900/20">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-400 hover:to-brand-600 text-sm font-bold text-white py-3.5 px-6 shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 transition-all outline-none disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
