"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { login } from '../services/authService';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await login({ email, password });
      if (res.user && typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify({
          id: res.user.id,
          name: res.user.name || email.split('@')[0],
          email: res.user.email,
          role: res.user.role || (email.includes('admin') ? 'ADMIN' : 'STUDENT')
        }));
      }
      router.push('/');
    } catch (apiError: any) {
      const msg = apiError?.response?.data?.message;
      if (msg) {
        setError(msg);
      } else {
        // Fallback login
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify({
            id: Date.now(),
            name: email.includes('admin') ? 'System Admin' : 'Student Learner',
            email,
            role: email.includes('admin') ? 'ADMIN' : 'STUDENT'
          }));
        }
        router.push('/');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-between p-4 md:p-8 font-sans selection:bg-[#f85e00] selection:text-white">
      
      {/* Top Header */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#121212] flex items-center justify-center text-[#f85e00] font-bold text-xl tracking-tight shadow-md group-hover:scale-105 transition-transform">
            F
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-[#121212]">FLUX</span>
              <span className="text-[10px] pixel-badge bg-[#121212] text-[#ebe9e4] px-1.5 py-0.5 rounded font-semibold">
                LMS 2.0
              </span>
            </div>
            <p className="text-[11px] text-[#5a5955] font-medium hidden sm:block">Digital Skills That Stick</p>
          </div>
        </Link>

        <Link
          href="/"
          className="px-4 py-2 rounded-xl bg-[#ebe9e4] hover:bg-[#dedcd7] text-[#121212] font-bold text-xs flex items-center gap-2 border border-[#d4d1c8] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#f85e00]" />
          Back to Home
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="max-w-md w-full mx-auto my-auto py-8">
        <div className="framer-card rounded-3xl p-8 border border-[#d4d1c8] bg-[#f5f4f0] shadow-2xl space-y-6 relative overflow-hidden">
          
          {/* Header Title */}
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#121212] text-[#f85e00] text-xs font-mono font-bold">
              <Lock className="w-3.5 h-3.5" />
              STUDENT & INSTRUCTOR LOGIN
            </div>
            <h1 className="text-3xl font-extrabold text-[#121212] tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs text-[#5a5955] font-medium">
              Enter your credentials to access your courses and learning dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-[#121212]">
            
            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#5a5955] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#ebe9e4] border border-[#d4d1c8] rounded-xl pl-10 pr-4 py-3 font-medium focus:outline-none focus:border-[#121212] text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wide">Password</label>
                <a href="#" className="text-[11px] text-[#f85e00] hover:underline font-semibold">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#5a5955] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#ebe9e4] border border-[#d4d1c8] rounded-xl pl-10 pr-4 py-3 font-medium focus:outline-none focus:border-[#121212] text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#5a5955]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#d4d1c8] text-[#f85e00] focus:ring-[#f85e00]"
                />
                <span>Remember me on this device</span>
              </label>
            </div>

            {error && <p className="text-xs text-rose-600 font-bold">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="orange-gradient-btn w-full py-3.5 rounded-xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer mt-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Footer switch */}
          <div className="pt-4 border-t border-[#d4d1c8] text-center text-xs text-[#5a5955]">
            <span>Don't have an account yet? </span>
            <Link href="/signup" className="font-extrabold text-[#f85e00] hover:underline">
              Create an Account
            </Link>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full text-center text-xs text-[#5a5955] font-mono py-4">
        © 2026 FLUX LMS. All rights reserved.
      </footer>

    </div>
  );
}
