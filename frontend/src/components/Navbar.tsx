'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { LogOut, Zap, User, Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out successfully');
    router.push('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <header className="h-16 border-b border-white/[0.06] bg-surface-1/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-900/50">
            <Zap className="w-4 h-4 text-white" fill="currentColor" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">TaskFlow</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button className="btn-ghost relative">
            <Bell className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 pl-2 border-l border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-600/30 border border-brand-500/30 flex items-center justify-center text-xs font-semibold text-brand-300">
                {initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-200 leading-none">{user?.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="btn-ghost text-gray-500 hover:text-red-400"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
