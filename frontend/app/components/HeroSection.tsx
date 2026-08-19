"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingUp, Play, Star, CheckCircle2, Shield, Zap, BookOpen, Award } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeroSectionProps {
  setActiveTab: (tab: ActiveTab) => void;
  onExploreCourses: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ setActiveTab, onExploreCourses }) => {
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
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ebe9e4] border border-[#d4d1c8] text-xs font-mono font-bold text-[#121212]"
            >
              <span className="text-[#f85e00] font-extrabold">[1/5]</span>
              <span>REVOLUTIONIZING ONLINE EDUCATION & SKILLS</span>
            </motion.div>

            {/* Headline focusing on Learning Management & Skills */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#121212] tracking-tight leading-[1.08] font-sans">
                MASTER DIGITAL <br />
                <span className="text-[#121212]">SKILLS THAT MOVE</span> <br />
                <span className="text-[#f85e00]">YOU FORWARD</span>
              </h1>
              <p className="text-base sm:text-lg text-[#5a5955] max-w-xl font-medium pt-2">
                Learn from industry experts with hands-on video curricula, interactive projects, and verified certificates designed to elevate your tech career.
              </p>
            </motion.div>

            {/* CTA Buttons */}
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

              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-7 py-3.5 rounded-xl bg-[#dedcd7] hover:bg-[#d4d1c8] text-[#121212] font-bold text-base transition-colors flex items-center gap-2 border border-[#c5c2b8] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current text-[#f85e00]" />
                Student Portal
              </button>
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

          {/* Right Column: Hero Visual Card (LMS & Course Learning Focused) */}
          <div className="lg:col-span-5 relative">
            
            {/* Floating Stat Badge (132% GROWTH) matching screenshot */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute -top-4 -right-2 md:right-4 z-20 bg-[#121212] text-[#ebe9e4] p-4 rounded-2xl border border-[#2a2a2a] shadow-2xl max-w-[220px]"
            >
              <div className="flex items-center gap-2 text-[#f85e00] font-extrabold text-xl font-mono">
                <TrendingUp className="w-5 h-5" />
                <span>↑ 132%</span>
                <span className="text-xs text-white uppercase font-bold tracking-wider">GROWTH</span>
              </div>
              <p className="text-[11px] text-[#a8a59b] mt-1 font-medium leading-snug">
                Our learners achieve measurable career growth through targeted skill mastery.
              </p>
            </motion.div>

            {/* 3D Tech Learning Canvas Mockup Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-[#ebe9e4] rounded-2xl p-6 border-2 border-[#121212] shadow-2xl space-y-4 relative overflow-hidden"
            >
              {/* Header pixel bar */}
              <div className="flex items-center justify-between border-b border-[#c5c2b8] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#f85e00]" />
                  <div className="w-3 h-3 rounded-full bg-[#121212]" />
                  <div className="w-3 h-3 rounded-full bg-[#c5c2b8]" />
                </div>
                <span className="text-xs font-mono font-bold text-[#121212]">FLUX_LEARNING_ENGINE_V2</span>
              </div>

              {/* Central LMS Course Session Showcase */}
              <div className="relative rounded-xl overflow-hidden bg-[#121212] text-white p-6 space-y-4 shadow-inner">
                <div className="flex items-center justify-between text-xs font-mono text-[#f85e00]">
                  <span>● INTERACTIVE LESSON MODULE</span>
                  <span>4.9 ★★★★★</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Full-Stack Web Dev & AI Engineering
                  </h3>
                  <p className="text-xs text-[#a8a59b]">
                    Building production-ready applications with hands-on guidance.
                  </p>
                </div>

                {/* Progress simulator */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-mono text-[#ebe9e4]">
                    <span>Module 04 / 10</span>
                    <span className="text-[#f85e00] font-bold">72% Complete</span>
                  </div>
                  <div className="w-full bg-[#2a2a2a] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#f85e00] to-[#ff7800] h-full w-[72%]" />
                  </div>
                </div>
              </div>

              {/* Bottom LMS Status Display */}
              <div className="bg-[#121212] text-[#ebe9e4] rounded-xl p-4 flex items-center justify-between border border-[#2a2a2a]">
                <div>
                  <span className="text-[10px] text-[#f85e00] font-mono font-bold block">LEARNING MATRIX</span>
                  <span className="text-lg font-black font-mono tracking-widest text-white">FLUX ACADEMY</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#f85e00] flex items-center justify-center text-white font-bold">
                  ⚡
                </div>
              </div>

            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
};
