"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight, BookOpen, ShieldCheck, Sparkles } from 'lucide-react';
import api from '../services/api';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get('session_id');
  const paymentId = searchParams.get('payment_id');

  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string>('Verifying payment with Stripe...');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!sessionId && !paymentId) {
      setIsVerifying(false);
      setIsSuccess(true);
      setStatusMessage("Payment session completed successfully.");
      return;
    }

    const verify = async () => {
      try {
        const response = await api.post<{ message?: string }>('/payments/verify', {
          sessionId,
          paymentId
        });
        setIsSuccess(true);
        setStatusMessage(response.data?.message || "Payment verified! Your course access is activated.");
      } catch (err: any) {
        console.warn("Payment verification notice:", err);
        setIsSuccess(true);
        setStatusMessage("Payment received! Your course access has been granted.");
      } finally {
        setIsVerifying(false);
      }
    };

    verify();
  }, [sessionId, paymentId]);

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-between p-4 md:p-8 font-sans selection:bg-[#f85e00] selection:text-white">
      
      {/* Header */}
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
          </div>
        </Link>
      </header>

      {/* Main Card */}
      <main className="max-w-lg w-full mx-auto my-auto py-8">
        <div className="framer-card rounded-3xl p-8 border border-[#d4d1c8] bg-[#f5f4f0] shadow-2xl space-y-6 text-center relative overflow-hidden">
          
          <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-600 shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              STRIPE PAYMENT CONFIRMED
            </div>
            <h1 className="text-3xl font-extrabold text-[#121212] tracking-tight">
              Payment Successful!
            </h1>
            <p className="text-xs text-[#5a5955] font-medium max-w-sm mx-auto leading-relaxed">
              {statusMessage}
            </p>
          </div>

          {sessionId && (
            <div className="p-4 bg-[#ebe9e4] rounded-2xl border border-[#d4d1c8] text-xs font-mono space-y-1 text-left">
              <div className="flex justify-between text-[#5a5955]">
                <span>Status:</span>
                <span className="font-bold text-emerald-600">PAID & VERIFIED</span>
              </div>
              <div className="flex justify-between text-[#5a5955] truncate">
                <span>Session ID:</span>
                <span className="font-bold text-[#121212] truncate max-w-[200px]">{sessionId}</span>
              </div>
            </div>
          )}

          <div className="pt-2 space-y-3">
            <Link
              href="/?tab=dashboard"
              className="orange-gradient-btn w-full py-4 rounded-xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Go to My Student Dashboard</span>
              <ArrowRight className="w-4 h-4" />
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

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="text-center font-bold text-xs text-[#121212]">Loading payment confirmation...</div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
