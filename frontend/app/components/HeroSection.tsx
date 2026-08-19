"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingUp, Play, Star, CheckCircle2, Shield, Zap, BookOpen, Award, ShieldCheck } from 'lucide-react';
import { ActiveTab } from '../types';
import { AuthUser } from './AuthModal';

interface HeroSectionProps {
  setActiveTab: (tab: ActiveTab) => void;
  onExploreCourses: () => void;
  user?: AuthUser | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ setActiveTab, onExploreCourses, user }) => {
  return (
    <section className="relative pt-8 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
      {/* Main Framer Hero Container matching screenshot design */}
      <div className="framer-card rounded-3xl p-6 md:p-12 border border-[#d4d1c8] bg-[#f5f4f0] relative overflow-hidden shadow-xl">
        
        {/* Background Accent Grids */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f85e00]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Column: Headlines & Content - LMS & Learning Focus */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Index Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ebe9e4] border border-[#d4d1c8] text-xs font-mono font-medium text-[#121212]"
            >
              <span className="w-2 h-2 rounded-full bg-[#f85e00] animate-pulse" />
              <span>Next-Gen Fullstack LMS</span>
              <span className="text-[#5a5955]">|</span>
              <span className="text-[#f85e00] font-bold">2026 Curriculum</span>
            </motion.div>

            {/* Headline */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#121212] leading-[1.08]">
                Master High-Impact <br />
                <span className="text-[#f85e00] underline decoration-[#121212]/20 decoration-wavy decoration-2">
                  Software Engineering.
                </span>
              </h1>
              <p className="text-sm md:text-base text-[#5a5955] max-w-xl font-normal leading-relaxed pt-2">
                Gain verified certificates, learn from industry experts, stream DRM-protected video masterclasses, and level up your software engineering career with real projects.
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
                className="orange-gradient-btn px-7 py-3.5 rounded-xl text-white font-bold text-base flex items-center gap-2 cursor-pointer shadow-lg"
              >
                Get Started
                <ArrowUpRight className="w-5 h-5" />
              </button>

              {user?.role === 'ADMIN' ? (
                <button
                  onClick={() => setActiveTab('admin')}
                  className="px-7 py-3.5 rounded-xl bg-[#121212] text-[#f85e00] hover:bg-[#252525] font-bold text-base transition-colors flex items-center gap-2 border border-[#121212] cursor-pointer shadow-md"
                >
                  <ShieldCheck className="w-5 h-5" />
                  Admin Dashboard
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-7 py-3.5 rounded-xl bg-[#dedcd7] hover:bg-[#d4d1c8] text-[#121212] font-bold text-base transition-colors flex items-center gap-2 border border-[#c5c2b8] cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current text-[#f85e00]" />
                  Student Portal
                </button>
              )}
            </motion.div>

            {/* LMS Trust Highlights */}
            <div className="pt-4 flex items-center gap-6 border-t border-[#d4d1c8] text-xs font-semibold text-[#5a5955]">
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

          {/* Right Column: Hero Showcase Visual Card */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="framer-card rounded-2xl overflow-hidden border border-[#d4d1c8] bg-[#ebe9e4] shadow-2xl relative">
                
                {/* Course Banner Image Preview */}
                <div className="relative aspect-video w-full bg-[#121212] overflow-hidden group">
                  <img 
                    src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80" 
                    alt="LMS Masterclass"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-80" />
                  
                  {/* Floating Live Badge */}
                  <div className="absolute top-3 left-3 bg-[#121212]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#d4d1c8]/30 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[11px] font-bold text-white font-mono uppercase">Interactive LMS</span>
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-[#f85e00] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="p-5 space-y-3 bg-[#f5f4f0]">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#121212] text-[#f85e00] px-2.5 py-1 rounded-md text-xs font-mono font-bold">
                      FLAGSHIP TRACK
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#121212]">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>4.9 (1.8k reviews)</span>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-lg text-[#121212]">
                    Full-Stack Next.js 15 & Enterprise AI Architecture
                  </h3>

                  <div className="flex items-center justify-between pt-2 border-t border-[#d4d1c8] text-xs font-medium text-[#5a5955]">
                    <div className="flex items-center gap-2">
                      <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                        alt="Instructor" 
                        className="w-6 h-6 rounded-full object-cover border border-[#121212]"
                      />
                      <span>Sarah Jenkins</span>
                    </div>
                    <span className="font-mono font-bold text-[#121212]">24 Modules • DRM Secured</span>
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
