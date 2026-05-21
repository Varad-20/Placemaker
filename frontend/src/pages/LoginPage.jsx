import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../layouts/AuthLayout';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back!"
      subtitle="Sign in to resume tracking placement readiness scores."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Alerts display */}
        {error && (
          <div className="flex items-start gap-2.5 rounded-xl bg-rose-500/10 p-4 text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-500/15">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <p className="flex-1">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Email input field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-brand-400/80">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="h-4.5 w-4.5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="w-full rounded-xl border border-slate-200 dark:border-brand-950/30 bg-slate-50 dark:bg-brand-950/40 py-3.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:border-brand-500 focus:bg-white dark:focus:bg-brand-950/60 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password input field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-brand-400/80">
                Password
              </label>
              <a
                href="#"
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-4.5 w-4.5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 dark:border-brand-950/30 bg-slate-50 dark:bg-brand-950/40 py-3.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:border-brand-500 focus:bg-white dark:focus:bg-brand-950/60 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Submit Form */}
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-sm font-bold text-white py-3.5 px-4 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-brand-950 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <span>Sign In</span>
              <LogIn className="h-4 w-4" />
            </>
          )}
        </button>

        {/* Bottom swap direction links */}
        <p className="text-center text-xs text-slate-500 dark:text-brand-300/60 mt-4">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Create an Account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
