'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getApiErrorMessage } from '@/lib/utils';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, loadUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => { loadUser(); }, [loadUser]);
  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/dashboard');
  }, [isLoading, isAuthenticated, router]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface-1 items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950/80 via-surface-1 to-surface-2" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-brand-400/10 rounded-full blur-2xl" />
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-900/50">
              <Zap className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">TaskFlow</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Organize your work,<br />amplify your output.
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            A powerful task management system built for engineers who move fast.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Tasks Completed', value: '12,400+' },
              { label: 'Active Users', value: '3,200+' },
              { label: 'Uptime', value: '99.9%' },
              { label: 'Avg Response', value: '< 50ms' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 rounded-xl p-4 border border-white/[0.06]">
                <div className="text-2xl font-bold text-brand-400 mb-1">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <span className="text-xl font-bold text-white">TaskFlow</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-gray-500">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="input"
                autoComplete="email"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full h-11 text-base"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
