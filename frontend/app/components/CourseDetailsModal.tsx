"use client";

import React, { useState } from 'react';
import { Course } from '../types';
import { X, Star, PlayCircle, ShieldCheck, Award, CheckCircle2, ArrowUpRight, Lock, Clock, UserCheck } from 'lucide-react';

interface CourseDetailsModalProps {
  course: Course | null;
  onClose: () => void;
  onEnroll: (course: Course) => void;
}

export const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  course,
  onClose,
  onEnroll,
}) => {
  if (!course) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'syllabus' | 'instructor' | 'reviews'>('overview');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/70 backdrop-blur-sm overflow-y-auto">
      
      <div className="framer-card rounded-3xl border border-[#d4d1c8] bg-[#f5f4f0] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col relative my-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-[#d4d1c8] flex items-start justify-between bg-[#ebe9e4]">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-[#121212] text-[#f85e00] px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase">
                {course.category}
              </span>
              <span className="text-xs font-bold text-[#5a5955]">• {course.level} Level</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#121212] tracking-tight">
              {course.title}
            </h2>
            <p className="text-xs md:text-sm text-[#5a5955] font-medium">{course.subtitle}</p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#dedcd7] hover:bg-[#121212] hover:text-white text-[#121212] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Left Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tabs */}
            <div className="flex border-b border-[#d4d1c8] gap-4 text-sm font-bold">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-2 transition-colors cursor-pointer ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-[#f85e00] text-[#121212]'
                    : 'text-[#5a5955] hover:text-[#121212]'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('syllabus')}
                className={`pb-2 transition-colors cursor-pointer ${
                  activeTab === 'syllabus'
                    ? 'border-b-2 border-[#f85e00] text-[#121212]'
                    : 'text-[#5a5955] hover:text-[#121212]'
                }`}
              >
                Syllabus ({course.videos.length} lessons)
              </button>
              <button
                onClick={() => setActiveTab('instructor')}
                className={`pb-2 transition-colors cursor-pointer ${
                  activeTab === 'instructor'
                    ? 'border-b-2 border-[#f85e00] text-[#121212]'
                    : 'text-[#5a5955] hover:text-[#121212]'
                }`}
              >
                Instructor
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'overview' && (
              <div className="space-y-4 text-xs md:text-sm text-[#5a5955] leading-relaxed">
                <p>{course.description}</p>
                
                <div className="p-4 rounded-2xl bg-[#ebe9e4] border border-[#d4d1c8] space-y-3">
                  <h4 className="font-extrabold text-[#121212] text-sm uppercase tracking-wide">What you will learn</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-[#121212]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#f85e00]" />
                      <span>App Router Architecture</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#f85e00]" />
                      <span>Framer Animation Engineering</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#f85e00]" />
                      <span>Database & Prisma ORM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#f85e00]" />
                      <span>Stripe Payment Integration</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'syllabus' && (
              <div className="space-y-3">
                <h4 className="font-extrabold text-[#121212] text-sm uppercase tracking-wide">Lesson Curriculum</h4>
                <div className="space-y-2">
                  {course.videos.map((vid, idx) => (
                    <div
                      key={vid.id}
                      className="p-3.5 rounded-xl bg-[#ebe9e4] border border-[#d4d1c8] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <PlayCircle className="w-4 h-4 text-[#f85e00]" />
                        <div>
                          <p className="font-bold text-[#121212]">{vid.title}</p>
                          {vid.description && <p className="text-[11px] text-[#5a5955]">{vid.description}</p>}
                        </div>
                      </div>
                      <span className="font-mono text-[#5a5955] font-semibold">{vid.duration || '15:00'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'instructor' && (
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#ebe9e4] border border-[#d4d1c8]">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#121212]"
                />
                <div className="space-y-1">
                  <h4 className="font-extrabold text-[#121212] text-base">{course.instructor.name}</h4>
                  <p className="text-xs text-[#f85e00] font-bold">{course.instructor.role}</p>
                  <p className="text-xs text-[#5a5955] pt-1">
                    Senior tech educator with over 10 years of production experience building high-scale web products.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Right Sticky Checkout Sidebar */}
          <div className="lg:col-span-5 space-y-4">
            <div className="framer-card-dark p-6 rounded-2xl border border-[#2a2a2a] space-y-5 shadow-xl">
              
              <div className="relative rounded-xl overflow-hidden h-40 border border-[#2a2a2a]">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent flex items-end p-3">
                  <span className="text-xs font-mono text-[#f85e00] font-bold">FULL ACCESS PASS</span>
                </div>
              </div>

              <div className="flex items-baseline justify-between border-b border-[#2a2a2a] pb-4">
                <div>
                  <p className="text-xs text-[#a8a59b] font-semibold">Course Tuition</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold font-grotesk text-white">
                      ${course.price.toFixed(2)}
                    </span>
                    {course.originalPrice && (
                      <span className="text-sm text-[#a8a59b] line-through font-mono">
                        ${course.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                <span className="bg-[#f85e00]/20 text-[#f85e00] px-2.5 py-1 rounded text-xs font-mono font-bold border border-[#f85e00]/30">
                  SAVE 40%
                </span>
              </div>

              <div className="space-y-2 text-xs text-[#ebe9e4]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#f85e00]" />
                  <span>Full Lifetime Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#f85e00]" />
                  <span>Verified Skill Certificate</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#f85e00]" />
                  <span>30-Day Money-Back Guarantee</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onEnroll(course);
                }}
                className="orange-gradient-btn w-full py-3.5 rounded-xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                Enroll Now
                <ArrowUpRight className="w-4 h-4" />
              </button>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
