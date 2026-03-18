'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff, UserPlus, Zap, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getApiErrorMessage } from '@/lib/utils';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Minimum 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
type FormData = z.infer<typeof schema>;

const requirements = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'A number', test: (p: string) => /[0-9]/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isAuthenticated, isLoading, loadUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [password, setPassword] = useState('');

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const watchedPassword = watch('password', '');
  useEffect(() => setPassword(watchedPassword), [watchedPassword]);
  useEffect(() => { loadUser(); }, [loadUser]);
  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/dashboard');
  }, [isLoading, isAuthenticated, router]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      await registerUser(data.email, data.password, data.name);
      toast.success('Account created! Welcome to TaskFlow 🚀');
      router.push('/dashboard');
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-6">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-900/50">
            <Zap className="w-4 h-4 text-white" fill="currentColor" />
          </div>
          <span className="text-xl font-bold text-white">TaskFlow</span>
        </div>

        <div className="card p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
            <p className="text-gray-500 text-sm">Get started with TaskFlow in seconds</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input
                {...register('name')}
                type="text"
                placeholder="Jane Smith"
                className="input"
                autoComplete="name"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>

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
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {requirements.map((req) => (
                    <div key={req.label} className={`flex items-center gap-1.5 text-xs transition-colors ${req.test(password) ? 'text-emerald-400' : 'text-gray-600'}`}>
                      <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                      {req.label}
                    </div>
                  ))}
                </div>
              )}
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="••••••••"
                className="input"
                autoComplete="new-password"
              />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full h-11 text-base mt-2">
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
