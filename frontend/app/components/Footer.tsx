"use client";

import React from 'react';
import { ActiveTab } from '../types';
import { Globe, Share2, MessageCircle } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="mt-20 border-t border-[#d4d1c8] bg-[#f5f4f0] py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#121212] text-[#f85e00] flex items-center justify-center font-bold text-lg">
              F
            </div>
            <span className="font-extrabold text-xl tracking-tight text-[#121212]">FLUX LMS</span>
          </div>
          <p className="text-xs text-[#5a5955] max-w-sm leading-relaxed font-medium">
            Building next-generation interactive learning experiences for developers, designers, and tech innovators.
          </p>
        </div>

        <div className="space-y-2 text-xs font-semibold">
          <p className="font-mono text-[#f85e00] uppercase font-bold text-[11px] mb-1">PLATFORM</p>
          <p onClick={() => setActiveTab('home')} className="hover:text-[#f85e00] cursor-pointer">Explore Courses</p>
          <p onClick={() => setActiveTab('dashboard')} className="hover:text-[#f85e00] cursor-pointer">Student Portal</p>
        </div>

        <div className="space-y-2 text-xs font-semibold">
          <p className="font-mono text-[#f85e00] uppercase font-bold text-[11px] mb-1">CONNECT</p>
          <div className="flex items-center gap-3 pt-1">
            <div className="w-8 h-8 rounded-lg bg-[#ebe9e4] border border-[#d4d1c8] flex items-center justify-center cursor-pointer hover:border-[#121212]">
              <Globe className="w-4 h-4 text-[#121212]" />
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#ebe9e4] border border-[#d4d1c8] flex items-center justify-center cursor-pointer hover:border-[#121212]">
              <Share2 className="w-4 h-4 text-[#121212]" />
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#ebe9e4] border border-[#d4d1c8] flex items-center justify-center cursor-pointer hover:border-[#121212]">
              <MessageCircle className="w-4 h-4 text-[#121212]" />
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-[#d4d1c8] flex flex-col sm:flex-row items-center justify-between text-xs text-[#5a5955] font-mono">
        <p>© 2026 FLUX LMS. All rights reserved.</p>
        <p className="text-[11px] pt-2 sm:pt-0">Crafted with Next.js & Framer Design</p>
      </div>
    </footer>
  );
};
