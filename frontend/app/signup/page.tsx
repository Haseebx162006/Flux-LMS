"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, ArrowRight, ArrowLeft, Shield, BookOpen, KeyRound } from 'lucide-react';
import { signUp, verifyOtp, login } from '../services/authService';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<'signup' | 'otp'>('signup');

  // Form states
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [role, setRole] = useState<'STUDENT' | 'ADMIN'>('STUDENT');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);

  // Status states
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms of Service to register.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      const res = await signUp({ name, email, password });
      setMessage(res.message || `OTP verification code sent to ${email}. Please check your email inbox.`);
      setStep('otp');
    } catch (apiError: any) {
      const msg = apiError?.response?.data?.message;
      if (msg) {
        setError(msg);
      } else {
        setError("Failed to create account. Please check your internet connection.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }

    setIsSubmitting(true);
    try {
      await verifyOtp(email, otpCode);
      
      // Auto sign-in after successful verification
      try {
        await login({ email, password });
      } catch (loginErr) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify({ id: Date.now(), name, email, role }));
        }
      }
      router.push('/');
    } catch (apiError: any) {
      setError(apiError?.response?.data?.message || 'Invalid or expired OTP code.');
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

      {/* Main Card */}
      <main className="max-w-lg w-full mx-auto my-auto py-8">
        <div className="framer-card rounded-3xl p-8 border border-[#d4d1c8] bg-[#f5f4f0] shadow-2xl space-y-6 relative overflow-hidden">
          
          {/* Header Title */}
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#121212] text-[#f85e00] text-xs font-mono font-bold">
              {step === 'signup' ? <User className="w-3.5 h-3.5" /> : <KeyRound className="w-3.5 h-3.5" />}
              {step === 'signup' ? 'CREATE YOUR ACCOUNT' : 'VERIFY EMAIL OTP'}
            </div>
            <h1 className="text-3xl font-extrabold text-[#121212] tracking-tight">
              {step === 'signup' ? 'Start Learning Today' : 'Enter Verification Code'}
            </h1>
            <p className="text-xs text-[#5a5955] font-medium max-w-sm mx-auto">
              {step === 'signup' 
                ? 'Join thousands of learners mastering web dev, AI, UI/UX, and technology skills.'
                : `We sent a 6-digit OTP code to ${email}. Check your email inbox or backend terminal.`}
            </p>
          </div>

          {/* Form */}
          {step === 'signup' ? (
            <form onSubmit={handleSignupSubmit} className="space-y-4 text-xs font-bold text-[#121212]">
              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#5a5955] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Haseeb Rivers"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#ebe9e4] border border-[#d4d1c8] rounded-xl pl-10 pr-4 py-3 font-medium focus:outline-none focus:border-[#121212] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#5a5955] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="Haseeb@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#ebe9e4] border border-[#d4d1c8] rounded-xl pl-10 pr-4 py-3 font-medium focus:outline-none focus:border-[#121212] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#5a5955] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#ebe9e4] border border-[#d4d1c8] rounded-xl pl-10 pr-4 py-3 font-medium focus:outline-none focus:border-[#121212] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide">Account Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('STUDENT')}
                    className={`p-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      role === 'STUDENT'
                        ? 'bg-[#121212] text-white border-[#121212] shadow-md'
                        : 'bg-[#ebe9e4] text-[#5a5955] border-[#d4d1c8]'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-[#f85e00]" />
                    Student Learner
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('ADMIN')}
                    className={`p-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      role === 'ADMIN'
                        ? 'bg-[#f85e00] text-white border-[#f85e00] shadow-md'
                        : 'bg-[#ebe9e4] text-[#5a5955] border-[#d4d1c8]'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    Platform Admin
                  </button>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#5a5955]">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-[#d4d1c8] text-[#f85e00] focus:ring-[#f85e00]"
                  />
                  <span>I agree to the Terms of Service & Privacy Policy</span>
                </label>
              </div>

              {message && <p className="text-xs text-emerald-600 font-bold bg-emerald-50 p-3 rounded-xl border border-emerald-200">{message}</p>}
              {error && <p className="text-xs text-rose-600 font-bold bg-rose-50 p-3 rounded-xl border border-rose-200">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="orange-gradient-btn w-full py-3.5 rounded-xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer mt-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending Code...</span>
                  </div>
                ) : (
                  <>
                    <span>Send Verification OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4 text-xs font-bold text-[#121212]">
              <div className="p-3 bg-[#ebe9e4] rounded-xl border border-[#d4d1c8] text-xs text-[#5a5955]">
                <p className="font-bold text-[#121212]">Enter 6-Digit OTP Code</p>
                <p className="text-[11px] mt-0.5">Verification email sent to <span className="font-bold text-[#121212]">{email}</span>.</p>
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide">6-Digit Verification OTP Code</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#5a5955] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="123456"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full bg-[#ebe9e4] border border-[#d4d1c8] rounded-xl pl-10 pr-4 py-3 font-mono text-center tracking-widest text-lg font-bold focus:outline-none focus:border-[#121212]"
                  />
                </div>
              </div>

              {message && <p className="text-xs text-emerald-600 font-bold bg-emerald-50 p-3 rounded-xl border border-emerald-200">{message}</p>}
              {error && <p className="text-xs text-rose-600 font-bold bg-rose-50 p-3 rounded-xl border border-rose-200">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="orange-gradient-btn w-full py-3.5 rounded-xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer mt-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Code...</span>
                  </div>
                ) : (
                  <>
                    <span>Verify OTP & Complete Signup</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('signup')}
                className="w-full py-2 text-xs font-bold text-[#5a5955] hover:text-[#121212] text-center cursor-pointer"
              >
                ← Back to Signup Details
              </button>
            </form>
          )}

          {/* Footer switch */}
          <div className="pt-4 border-t border-[#d4d1c8] text-center text-xs text-[#5a5955]">
            <span>Already have an account? </span>
            <Link href="/login" className="font-extrabold text-[#f85e00] hover:underline">
              Sign In
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
