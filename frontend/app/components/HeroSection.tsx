"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingUp, Play, BookOpen, Award, Zap, Sparkles } from 'lucide-react';
import { ActiveTab } from '../types';
import { AuthUser } from './AuthModal';

interface HeroSectionProps {
  setActiveTab: (tab: ActiveTab) => void;
  onExploreCourses: () => void;
  user?: AuthUser | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ setActiveTab, onExploreCourses, user }) => {
  return (
    <section className="relative pt-6 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full font-sans">
      {/* Main Framer Hero Container */}
      <div className="framer-card rounded-3xl p-6 md:p-12 border border-[#d4d1c8] bg-[#f5f4f0] relative overflow-hidden shadow-xl">
        
        {/* Subtle orange accent glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f85e00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Column: Headlines & Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Index Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ebe9e4] border border-[#d4d1c8] text-xs font-mono font-bold text-[#121212]"
            >
              <span className="text-[#f85e00] font-extrabold">[1/5]</span>
              <span className="tracking-wide uppercase text-[11px]">REVOLUTIONIZING ONLINE EDUCATION & SKILLS</span>
            </motion.div>

            {/* Headline */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-1"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-[#121212] leading-[1.05] uppercase">
                MASTER DIGITAL <br />
                SKILLS THAT MOVE <br />
                <span className="text-[#f85e00]">YOU FORWARD</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#5a5955] max-w-lg font-medium leading-relaxed pt-3">
                Learn from industry experts with hands-on video curricula, interactive projects, and verified certificates designed to elevate your tech career.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <button
                onClick={onExploreCourses}
                className="orange-gradient-btn px-6 py-3 rounded-xl text-white font-extrabold text-sm flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] transition-transform"
              >
                Get Started
                <ArrowUpRight className="w-4 h-4" />
              </button>

              {user?.role === 'ADMIN' ? (
                <button
                  onClick={() => setActiveTab('admin')}
                  className="px-6 py-3 rounded-xl bg-[#dedcd7] hover:bg-[#d4d1c8] text-[#121212] font-extrabold text-sm transition-colors flex items-center gap-2 border border-[#c5c2b8] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#f85e00]" />
                  Admin Dashboard
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-6 py-3 rounded-xl bg-[#dedcd7] hover:bg-[#d4d1c8] text-[#121212] font-extrabold text-sm transition-colors flex items-center gap-2 border border-[#c5c2b8] cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-[#f85e00]" />
                  Student Portal
                </button>
              )}
            </motion.div>

            {/* Trust Highlights */}
            <div className="pt-4 flex flex-wrap items-center gap-6 border-t border-[#d4d1c8] text-xs font-bold text-[#5a5955]">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#f85e00]" />
                <span>Interactive Lessons</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#f85e00]" />
                <span>Verified Certificates</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#f85e00]" />
                <span>Self-Paced Progress</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Showcase Visual Card matching screenshot */}
          <div className="lg:col-span-5 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              {/* Outer Browser Mockup Container */}
              <div className="rounded-3xl p-5 md:p-6 bg-[#ebe9e4] border border-[#d4d1c8] shadow-2xl relative space-y-4">
                
                {/* Browser Top Window Controls */}
                <div className="flex items-center gap-1.5 pb-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#f85e00]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#121212]/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#121212]/20" />
                </div>

                {/* Floating 132% Growth Pill */}
                <div className="absolute -top-6 -right-3 sm:-right-6 bg-[#121212] text-white p-3.5 rounded-2xl shadow-2xl border border-[#d4d1c8]/20 max-w-[200px] z-20 space-y-1">
                  <div className="flex items-center gap-1 text-[#f85e00] font-extrabold text-xs">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>132% GROWTH</span>
                  </div>
                  <p className="text-[10px] text-[#ebe9e4]/80 leading-tight">
                    Our learners achieve measurable career growth through targeted skill mastery.
                  </p>
                </div>

                {/* Inner Dark Lesson Module Card */}
                <div className="bg-[#121212] text-white rounded-2xl p-5 border border-[#252525] shadow-lg space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#f85e00] font-bold">
                    <span>INTERACTIVE LESSON MODULE</span>
                    <span className="text-white bg-[#252525] px-2 py-0.5 rounded">4.9 ★</span>
                  </div>

                  <h3 className="text-base font-extrabold text-white tracking-tight">
                    Full-Stack Web Dev & AI Engineering
                  </h3>
                  <p className="text-[11px] text-[#ebe9e4]/70 leading-relaxed font-medium">
                    Building production-ready applications with hands-on guidance.
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-2 border-t border-[#252525]">
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                      <span className="text-[#ebe9e4]/60">Module 04 / 10</span>
                      <span className="text-[#f85e00]">72% Complete</span>
                    </div>
                    <div className="w-full bg-[#252525] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#f85e00] h-full w-[72%] rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Bottom Learning Matrix Strip */}
                <div className="bg-[#121212] rounded-2xl p-4 flex items-center justify-between border border-[#252525]">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-[#f85e00] block uppercase tracking-wider">
                      LEARNING MATRIX
                    </span>
                    <span className="text-xs font-black text-white tracking-wide">
                      FLUX ACADEMY
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#f85e00] shadow-md flex items-center justify-center text-white text-xs font-black">
                    •
                  </div>
                </div>

              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
