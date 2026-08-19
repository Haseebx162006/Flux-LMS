"use client";

import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Shield, ArrowRight, KeyRound } from 'lucide-react';
import { login, signUp, verifyOtp } from '../services/authService';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  avatar?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'signin',
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'signin' | 'signup' | 'otp'>(initialMode);
  
  // Form fields
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [role, setRole] = useState<'STUDENT' | 'ADMIN'>('STUDENT');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        try {
          const res = await login({ email, password });
          if (res.user) {
            onLoginSuccess({
              id: res.user.id,
              name: res.user.name || email.split('@')[0],
              email: res.user.email,
              role: res.user.role || (email.includes('admin') ? 'ADMIN' : 'STUDENT'),
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
            });
            onClose();
            return;
          }
        } catch (apiError: any) {
          const msg = apiError?.response?.data?.message;
          if (msg && !msg.includes('Network Error')) {
            setError(msg);
            setIsLoading(false);
            return;
          }
        }

        // Demo / offline backend fallback
        const fallbackUser: AuthUser = {
          id: Date.now(),
          name: email.includes('admin') ? 'System Admin' : 'Student Learner',
          email,
          role: email.includes('admin') ? 'ADMIN' : 'STUDENT',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
        };
        onLoginSuccess(fallbackUser);
        onClose();
      } else if (mode === 'signup') {
        try {
          const res = await signUp({ name, email, password });
          if (res.otp) {
            setOtpCode(res.otp);
            setMessage(`Verification code for ${email}: ${res.otp} (also sent to email)`);
          } else {
            setMessage(res.message || `OTP verification code sent to ${email}. Check your email inbox.`);
          }
          setMode('otp');
        } catch (apiError: any) {
          const msg = apiError?.response?.data?.message;
          if (msg) {
            setError(msg);
          } else {
            setMessage(`Simulated OTP code sent to ${email}. Enter code 123456 to verify.`);
            setOtpCode('123456');
            setMode('otp');
          }
        }
      } else if (mode === 'otp') {
        try {
          await verifyOtp(email, otpCode);
          // Auto sign-in after verification
          try {
            const res = await login({ email, password });
            if (res.user) {
              onLoginSuccess({
                id: res.user.id,
                name: res.user.name || name,
                email: res.user.email,
                role: res.user.role || role,
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
              });
              onClose();
              return;
            }
          } catch (loginErr) {
            // If signin post-verify fails, construct user object
          }

          const verifiedUser: AuthUser = {
            id: Date.now(),
            name: name || 'Student Learner',
            email,
            role,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
          };
          onLoginSuccess(verifiedUser);
          onClose();
        } catch (apiError: any) {
          setError(apiError?.response?.data?.message || 'Invalid or expired OTP code.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/80 backdrop-blur-md overflow-y-auto">
      
      <div className="framer-card rounded-3xl border border-[#d4d1c8] bg-[#f5f4f0] w-full max-w-md overflow-hidden shadow-2xl relative my-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-[#d4d1c8] flex items-center justify-between bg-[#ebe9e4]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#121212] text-[#f85e00] flex items-center justify-center font-bold text-sm">
              F
            </div>
            <span className="font-extrabold text-[#121212] text-base tracking-tight">
              {mode === 'signin' ? 'Sign In to FLUX' : mode === 'signup' ? 'Create Account' : 'Verify Email OTP'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#dedcd7] hover:bg-[#121212] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Mode Switcher Tabs */}
          {mode !== 'otp' && (
            <div className="grid grid-cols-2 p-1 bg-[#ebe9e4] rounded-xl border border-[#d4d1c8] text-xs font-bold">
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(''); setMessage(''); }}
                className={`py-2 rounded-lg transition-colors cursor-pointer ${
                  mode === 'signin' ? 'bg-[#121212] text-white shadow-sm' : 'text-[#5a5955] hover:text-[#121212]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); setMessage(''); }}
                className={`py-2 rounded-lg transition-colors cursor-pointer ${
                  mode === 'signup' ? 'bg-[#121212] text-white shadow-sm' : 'text-[#5a5955] hover:text-[#121212]'
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-3 text-xs font-bold text-[#121212]">
            
            {mode === 'signup' && (
              <div>
                <label className="block mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#5a5955] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Haseeb Ahmad"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#ebe9e4] border border-[#d4d1c8] rounded-xl pl-9 pr-3 py-2.5 font-medium focus:outline-none focus:border-[#121212]"
                  />
                </div>
              </div>
            )}

            {mode !== 'otp' && (
              <>
                <div>
                  <label className="block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#5a5955] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="Haseeb@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#ebe9e4] border border-[#d4d1c8] rounded-xl pl-9 pr-3 py-2.5 font-medium focus:outline-none focus:border-[#121212]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#5a5955] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#ebe9e4] border border-[#d4d1c8] rounded-xl pl-9 pr-3 py-2.5 font-medium focus:outline-none focus:border-[#121212]"
                    />
                  </div>
                </div>
              </>
            )}

            {mode === 'otp' && (
              <div className="space-y-3">
                <div className="p-3 bg-[#ebe9e4] rounded-xl border border-[#d4d1c8] text-xs text-[#5a5955]">
                  <p className="font-bold text-[#121212]">Enter 6-Digit OTP Code</p>
                  <p className="text-[11px] mt-0.5">We sent a verification code to <span className="font-bold text-[#121212]">{email}</span>.</p>
                </div>

                <div>
                  <label className="block mb-1">Verification Code (OTP)</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#5a5955] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="123456"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full bg-[#ebe9e4] border border-[#d4d1c8] rounded-xl pl-9 pr-3 py-2.5 font-mono text-center tracking-widest text-base font-bold focus:outline-none focus:border-[#121212]"
                    />
                  </div>
                </div>
              </div>
            )}

            {message && <p className="text-[11px] text-emerald-600 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">{message}</p>}
            {error && <p className="text-[11px] text-rose-600 font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="orange-gradient-btn w-full py-3 rounded-xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer mt-4 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In to Account' : mode === 'signup' ? 'Send Verification OTP' : 'Verify OTP & Complete Registration'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
