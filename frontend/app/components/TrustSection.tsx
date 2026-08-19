"use client";

import React from 'react';
import { Users, Award, BookOpen, Star, TrendingUp } from 'lucide-react';

export const TrustSection: React.FC = () => {
  return (
    <section className="px-4 md:px-8 max-w-7xl mx-auto w-full mb-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="framer-card p-5 rounded-2xl border border-[#d4d1c8] text-center space-y-1 hover:border-[#121212] transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#121212] text-[#f85e00] flex items-center justify-center mx-auto mb-2 font-bold shadow">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-2xl md:text-3xl font-extrabold font-grotesk text-[#121212]">10,000+</p>
          <p className="text-xs text-[#5a5955] font-semibold uppercase tracking-wider">Active Students</p>
        </div>

        <div className="framer-card p-5 rounded-2xl border border-[#d4d1c8] text-center space-y-1 hover:border-[#121212] transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#121212] text-[#f85e00] flex items-center justify-center mx-auto mb-2 font-bold shadow">
            <Star className="w-5 h-5 fill-current" />
          </div>
          <p className="text-2xl md:text-3xl font-extrabold font-grotesk text-[#121212]">4.9 / 5.0</p>
          <p className="text-xs text-[#5a5955] font-semibold uppercase tracking-wider">Average Rating</p>
        </div>

        <div className="framer-card p-5 rounded-2xl border border-[#d4d1c8] text-center space-y-1 hover:border-[#121212] transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#121212] text-[#f85e00] flex items-center justify-center mx-auto mb-2 font-bold shadow">
            <BookOpen className="w-5 h-5" />
          </div>
          <p className="text-2xl md:text-3xl font-extrabold font-grotesk text-[#121212]">150+</p>
          <p className="text-xs text-[#5a5955] font-semibold uppercase tracking-wider">Expert Courses</p>
        </div>

        <div className="framer-card p-5 rounded-2xl border border-[#d4d1c8] text-center space-y-1 hover:border-[#121212] transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#121212] text-[#f85e00] flex items-center justify-center mx-auto mb-2 font-bold shadow">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-2xl md:text-3xl font-extrabold font-grotesk text-[#121212]">132%</p>
          <p className="text-xs text-[#5a5955] font-semibold uppercase tracking-wider">Average Salary Increase</p>
        </div>

      </div>
    </section>
  );
};
