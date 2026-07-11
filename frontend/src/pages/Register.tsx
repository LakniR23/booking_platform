import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { register } from '../api/auth';
import { CalendarRange } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async () => {
      return register({ name, email, password });
    },
    onSuccess: () => {
      navigate('/login');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Registration failed');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="card w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="h-1.5 w-full bg-gradient-to-r from-[var(--color-brand-indigo)] to-[var(--color-brand-cyan)]" />
        <div className="p-6 sm:p-8">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-brand-navy)] shadow-lg shadow-[var(--color-brand-navy)]/20">
              <CalendarRange className="text-white" size={26} />
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-heading)]">Create Account</h1>
            <p className="mt-2 text-sm text-slate-500">Join us to manage services and bookings.</p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</label>
              <input
                id="name"
                type="text"
                required
                className="field"
                placeholder="Jane Doe"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</label>
              <input
                id="email"
                type="email"
                required
                className="field"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
              <input
                id="password"
                type="password"
                required
                className="field"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" disabled={mutation.isPending} className="btn btn-primary mt-2 w-full">
              {mutation.isPending ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-[var(--color-brand-indigo)] hover:opacity-80">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
