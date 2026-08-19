"use client";

import React from 'react';
import { X, Download, Award, ShieldCheck, CheckCircle2, Sparkles, Printer } from 'lucide-react';

interface CertificateModalProps {
  userName: string;
  courseTitle: string;
  completionDate?: string;
  certificateId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  userName,
  courseTitle,
  completionDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  certificateId = `FLUX-CERT-${Math.floor(100000 + Math.random() * 900000)}`,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/80 backdrop-blur-md overflow-y-auto">
      
      {/* Container */}
      <div className="framer-card rounded-3xl border border-[#d4d1c8] bg-[#f5f4f0] w-full max-w-3xl overflow-hidden shadow-2xl relative my-auto font-sans">
        
        {/* Modal Top Bar (Hidden during print) */}
        <div className="p-4 border-b border-[#d4d1c8] flex items-center justify-between bg-[#ebe9e4] print:hidden">
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#121212]">
            <Award className="w-4 h-4 text-[#f85e00]" />
            <span>OFFICIAL COURSE COMPLETION CERTIFICATE</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="orange-gradient-btn px-4 py-2 rounded-xl text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Certificate (PDF)</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#dedcd7] hover:bg-[#121212] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE CERTIFICATE CARD */}
        <div id="printable-certificate" className="p-8 md:p-12 print:p-8 bg-[#fbfaf8] text-[#121212] border-8 border-double border-[#d4af37] relative overflow-hidden text-center shadow-inner">
          
          {/* Certificate Gold Accent Corners */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#d4af37]" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#d4af37]" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#d4af37]" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#d4af37]" />

          {/* Background Watermark Badge */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Award className="w-96 h-96 text-[#d4af37]" />
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-6 max-w-xl mx-auto py-4">
            
            {/* Header Badge */}
            <div className="flex items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#121212] text-[#f85e00] flex items-center justify-center font-extrabold text-xl shadow-md">
                F
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[#121212]">FLUX LMS</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-[#8c7320]">
                CERTIFICATE OF COMPLETION
              </h2>
              <p className="text-[11px] text-[#5a5955] italic">This document certifies that</p>
            </div>

            {/* Recipient User Name */}
            <div className="py-2 border-b-2 border-[#121212] inline-block px-8">
              <h1 className="text-3xl md:text-4xl font-extrabold font-grotesk text-[#121212] tracking-tight capitalize">
                {userName || "Learner Student"}
              </h1>
            </div>

            <p className="text-xs text-[#5a5955] font-medium leading-relaxed max-w-md mx-auto">
              has successfully completed all requirements, practical projects, and curriculum modules for the online professional course:
            </p>

            {/* Course Title */}
            <div className="p-4 bg-[#f5f4f0] rounded-2xl border border-[#d4d1c8] shadow-sm">
              <h3 className="text-xl md:text-2xl font-black text-[#121212] tracking-tight">
                {courseTitle}
              </h3>
            </div>

            {/* Verification Footer */}
            <div className="pt-6 grid grid-cols-2 gap-4 text-xs font-medium text-[#5a5955] border-t border-[#d4d1c8]">
              <div className="text-left space-y-1">
                <span className="block text-[10px] font-mono font-bold uppercase text-[#121212]">ISSUED DATE</span>
                <span className="font-bold text-[#121212]">{completionDate}</span>
              </div>

              <div className="text-right space-y-1">
                <span className="block text-[10px] font-mono font-bold uppercase text-[#121212]">CERTIFICATE ID</span>
                <span className="font-bold font-mono text-[#f85e00]">{certificateId}</span>
              </div>
            </div>

            {/* Signature & Seal */}
            <div className="pt-4 flex items-center justify-between">
              <div className="text-left space-y-1">
                <div className="font-script text-lg text-[#121212] font-bold italic">Haseeb</div>
                <div className="text-[10px] font-bold text-[#5a5955] uppercase">Lead Platform Instructor</div>
              </div>

              <div className="flex items-center gap-1 bg-[#121212] text-[#f85e00] px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold shadow-md">
                <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED FLUX CERTIFICATE
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
