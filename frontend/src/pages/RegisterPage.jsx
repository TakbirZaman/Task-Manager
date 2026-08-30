// frontend/src/pages/RegisterPage.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../api/getErrorMessage';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-void px-4 overflow-hidden">
      {/* Animated aurora background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 h-full w-full animate-[aurora-pulse_8s_ease-in-out_infinite] rounded-full bg-violet/5 blur-[120px]" />
        <div className="absolute -bottom-1/2 -right-1/2 h-full w-full animate-[aurora-pulse_8s_ease-in-out_infinite_2s] rounded-full bg-aurora/5 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 h-96 w-96 animate-[aurora-pulse_10s_ease-in-out_infinite_1s] rounded-full bg-cyan/3 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-aurora-gradient shadow-lg shadow-aurora/30 animate-float">
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold text-gradient">Taskflow</h1>
          <p className="mt-2 text-sm text-ghost">Create an account to start your list.</p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-8 shadow-2xl shadow-black/30 animate-fade-in-up delay-2">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-rose/20 bg-rose/10 px-3 py-2 text-sm text-rose animate-scale-in">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="animate-fade-in-up delay-3">
              <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ghost">
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-mist/40 bg-deep/80 px-4 py-2.5 text-sm text-snow placeholder:text-ghost/50 transition-all duration-300 input-glow"
                placeholder="Your name"
                autoFocus
              />
            </div>

            <div className="animate-fade-in-up delay-4">
              <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ghost">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-mist/40 bg-deep/80 px-4 py-2.5 text-sm text-snow placeholder:text-ghost/50 transition-all duration-300 input-glow"
                placeholder="you@example.com"
              />
            </div>

            <div className="animate-fade-in-up delay-5">
              <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ghost">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-mist/40 bg-deep/80 px-4 py-2.5 text-sm text-snow placeholder:text-ghost/50 transition-all duration-300 input-glow"
                placeholder="At least 6 characters"
              />
              <p className="mt-1.5 text-xs text-ghost/60">At least 6 characters.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-glow mt-6 w-full rounded-lg bg-aurora-gradient py-3 text-sm font-semibold text-white shadow-lg shadow-aurora/25 disabled:opacity-60 disabled:shadow-none"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating account...
              </span>
            ) : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ghost animate-fade-in-up delay-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-aurora-light transition-colors duration-200 hover:text-aurora">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
