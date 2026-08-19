"use client";

import React, { useState } from 'react';
import { Enrollment, Video, Course } from '../types';
import { VdoCipherPlayer } from './VdoCipherPlayer';
import { CertificateModal } from './CertificateModal';
import { getStoredUser } from '../services/authService';
import {
  PlayCircle,
  CheckCircle2,
  Award,
  Clock,
  BookOpen,
  ChevronRight,
  FileText,
  Download,
  Sparkles,
  Layers,
  GraduationCap
} from 'lucide-react';

interface StudentDashboardProps {
  enrollments: Enrollment[];
  onBrowseCourses: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  enrollments,
  onBrowseCourses,
}) => {
  const currentUser = getStoredUser();
  const userName = currentUser?.name || 'Haseeb Ahmad';

  // Navigation Tabs inside Student Portal
  const [studentTab, setStudentTab] = useState<'catalog' | 'player' | 'certificates'>('catalog');

  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(
    enrollments.length > 0 ? enrollments[0] : null
  );

  const [activeVideo, setActiveVideo] = useState<Video | null>(
    enrollments.length > 0 && enrollments[0].course.videos.length > 0
      ? enrollments[0].course.videos[0]
      : null
  );

  const [completedIds, setCompletedIds] = useState<number[]>(
    enrollments.length > 0 ? enrollments[0].completedVideoIds || [101, 102] : [101, 102]
  );

  // Certificate Modal State
  const [certModalData, setCertModalData] = useState<{
    isOpen: boolean;
    courseTitle: string;
  }>({
    isOpen: false,
    courseTitle: ''
  });

  if (enrollments.length === 0) {
    return (
      <section className="px-4 md:px-8 max-w-7xl mx-auto w-full py-12">
        <div className="framer-card rounded-3xl p-12 text-center border border-[#d4d1c8] space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#121212] text-[#f85e00] flex items-center justify-center mx-auto shadow-xl">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#121212]">No Enrolled Courses Yet</h2>
          <p className="text-sm text-[#5a5955] max-w-md mx-auto">
            You haven't enrolled in any courses yet. Discover high-impact tech & design courses to start learning.
          </p>
          <button
            onClick={onBrowseCourses}
            className="orange-gradient-btn px-6 py-3 rounded-xl text-white font-extrabold text-xs shadow-md cursor-pointer"
          >
            Explore Catalog
          </button>
        </div>
      </section>
    );
  }

  const currentCourse = selectedEnrollment?.course;

  const toggleVideoComplete = (videoId: number) => {
    if (completedIds.includes(videoId)) {
      setCompletedIds(completedIds.filter((id) => id !== videoId));
    } else {
      setCompletedIds([...completedIds, videoId]);
    }
  };

  const progressPercentage = currentCourse && currentCourse.videos.length > 0
    ? Math.min(100, Math.round((completedIds.length / currentCourse.videos.length) * 100))
    : 100;

  const handleSelectEnrolledCourse = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    if (enrollment.course.videos.length > 0) {
      setActiveVideo(enrollment.course.videos[0]);
    }
    setStudentTab('player');
  };

  return (
    <section className="px-4 md:px-8 max-w-7xl mx-auto w-full py-8 space-y-8">
      
      {/* Student Welcome Banner */}
      <div className="framer-card rounded-3xl p-6 md:p-8 border border-[#d4d1c8] bg-[#f5f4f0] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#121212] text-[#f85e00] text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            STUDENT PORTAL
          </div>
          <h1 className="text-3xl font-extrabold text-[#121212] tracking-tight">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-xs md:text-sm text-[#5a5955] font-medium">
            Manage your enrolled courses, watch video lessons, and download earned certificates.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="flex items-center gap-4 bg-[#ebe9e4] p-3 rounded-2xl border border-[#d4d1c8] text-xs font-bold text-[#121212]">
          <div className="text-center px-3 border-r border-[#c5c2b8]">
            <span className="block text-xl font-extrabold font-grotesk text-[#f85e00]">
              {enrollments.length}
            </span>
            <span className="text-[10px] text-[#5a5955] uppercase">Enrolled</span>
          </div>
          <div className="text-center px-3 border-r border-[#c5c2b8]">
            <span className="block text-xl font-extrabold font-grotesk text-[#121212]">
              {enrollments.filter(e => (e.course.videos.length > 0 && completedIds.length >= e.course.videos.length)).length}
            </span>
            <span className="text-[10px] text-[#5a5955] uppercase">Completed</span>
          </div>
          <div className="text-center px-3">
            <span className="block text-xl font-extrabold font-grotesk text-[#121212]">100%</span>
            <span className="text-[10px] text-[#5a5955] uppercase">Verified</span>
          </div>
        </div>
      </div>

      {/* Student Portal Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-[#d4d1c8] pb-4 overflow-x-auto">
        <button
          onClick={() => setStudentTab('catalog')}
          className={`px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            studentTab === 'catalog'
              ? 'bg-[#121212] text-white shadow-md'
              : 'bg-[#f5f4f0] text-[#5a5955] hover:text-[#121212] border border-[#d4d1c8]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>My Enrolled Courses ({enrollments.length})</span>
        </button>

        <button
          onClick={() => setStudentTab('player')}
          className={`px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            studentTab === 'player'
              ? 'bg-[#121212] text-white shadow-md'
              : 'bg-[#f5f4f0] text-[#5a5955] hover:text-[#121212] border border-[#d4d1c8]'
          }`}
        >
          <PlayCircle className="w-4 h-4 text-[#f85e00]" />
          <span>Learning Player</span>
        </button>

        <button
          onClick={() => setStudentTab('certificates')}
          className={`px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            studentTab === 'certificates'
              ? 'bg-[#121212] text-white shadow-md'
              : 'bg-[#f5f4f0] text-[#5a5955] hover:text-[#121212] border border-[#d4d1c8]'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-500" />
          <span>Certificates & PDF Downloads</span>
        </button>
      </div>

      {/* TAB 1: ENROLLED COURSES CATALOG */}
      {studentTab === 'catalog' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-[#121212] tracking-tight">
                My Enrolled Courses Catalog
              </h2>
              <p className="text-xs text-[#5a5955]">
                Select any enrolled course to open its video lesson curriculum and start watching.
              </p>
            </div>
            <button
              onClick={onBrowseCourses}
              className="text-xs font-bold text-[#f85e00] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore New Courses</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((e) => {
              const c = e.course;
              const isSelected = selectedEnrollment?.course.id === c.id;
              return (
                <div
                  key={c.id}
                  className={`framer-card rounded-3xl p-6 border bg-[#f5f4f0] shadow-lg flex flex-col justify-between space-y-4 transition-all ${
                    isSelected ? 'ring-2 ring-[#f85e00] border-[#f85e00]' : 'border-[#d4d1c8]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#121212] border border-[#d4d1c8]">
                      <img
                        src={c.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'}
                        alt={c.title}
                        className="w-full h-full object-cover opacity-90"
                      />
                      <div className="absolute top-3 left-3 bg-[#121212]/90 text-white text-[10px] font-mono font-bold px-2 py-1 rounded-md">
                        {c.category}
                      </div>
                    </div>

                    <h3 className="text-lg font-extrabold text-[#121212] tracking-tight line-clamp-2">
                      {c.title}
                    </h3>
                    <p className="text-xs text-[#5a5955] line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-[#d4d1c8]">
                    <div className="flex items-center justify-between text-xs text-[#5a5955] font-medium">
                      <span>{c.videos?.length || 0} Lessons</span>
                      <span className="font-bold text-emerald-600">Access Granted</span>
                    </div>

                    <button
                      onClick={() => handleSelectEnrolledCourse(e)}
                      className="orange-gradient-btn w-full py-3 rounded-xl text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>{isSelected ? 'Continue Watching' : 'Study This Course'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: LEARNING PLAYER */}
      {studentTab === 'player' && currentCourse && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main DRM Player & Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* DRM Video Player Wrapper */}
            <div className="framer-card rounded-3xl overflow-hidden border border-[#d4d1c8] bg-[#121212] shadow-2xl">
              <VdoCipherPlayer
                videoUrl={activeVideo?.url || ''}
                title={activeVideo?.title || currentCourse.title}
              />
            </div>

            {/* Video Meta Info */}
            <div className="framer-card rounded-3xl p-6 border border-[#d4d1c8] bg-[#f5f4f0] shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4d1c8] pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-[#f85e00] tracking-wider">
                    CURRENT LESSON
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#121212] tracking-tight">
                    {activeVideo?.title || 'Course Overview'}
                  </h2>
                </div>

                {activeVideo && (
                  <button
                    onClick={() => toggleVideoComplete(activeVideo.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                      completedIds.includes(activeVideo.id)
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-[#ebe9e4] text-[#121212] hover:bg-[#121212] hover:text-white border border-[#d4d1c8]'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {completedIds.includes(activeVideo.id)
                        ? 'Lesson Completed'
                        : 'Mark as Complete'}
                    </span>
                  </button>
                )}
              </div>

              <p className="text-xs md:text-sm text-[#5a5955] leading-relaxed">
                {activeVideo?.description || currentCourse.description}
              </p>
            </div>

            {/* 100% Completion Unlocked Banner */}
            {progressPercentage >= 100 && (
              <div className="framer-card rounded-3xl p-6 border border-emerald-300 bg-emerald-50 text-emerald-950 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold tracking-tight text-emerald-950">
                      Congratulations, {userName}! 🎓
                    </h3>
                    <p className="text-xs text-emerald-800 font-medium">
                      You have completed 100% of "{currentCourse.title}". Your certificate is ready!
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() =>
                      setCertModalData({
                        isOpen: true,
                        courseTitle: currentCourse.title,
                      })
                    }
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF Certificate</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Curriculum Sidebar */}
          <div className="space-y-6">
            
            {/* Progress Card */}
            <div className="framer-card rounded-3xl p-6 border border-[#d4d1c8] bg-[#f5f4f0] shadow-md space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-[#121212]">
                <span>Course Progress</span>
                <span className="font-mono text-[#f85e00]">{progressPercentage}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#ebe9e4] overflow-hidden p-0.5 border border-[#d4d1c8]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#f85e00] to-emerald-500 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              {progressPercentage >= 100 && (
                <button
                  onClick={() =>
                    setCertModalData({
                      isOpen: true,
                      courseTitle: currentCourse.title,
                    })
                  }
                  className="w-full py-3 rounded-xl bg-[#121212] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer hover:bg-[#f85e00] transition-colors"
                >
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>View PDF Certificate</span>
                </button>
              )}
            </div>

            {/* Video Lessons List */}
            <div className="framer-card rounded-3xl p-6 border border-[#d4d1c8] bg-[#f5f4f0] shadow-md space-y-4">
              <h3 className="text-sm font-extrabold text-[#121212] tracking-tight">
                Course Curriculum ({currentCourse.videos.length} Lessons)
              </h3>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {currentCourse.videos.map((vid, idx) => {
                  const isActive = activeVideo?.id === vid.id;
                  const isDone = completedIds.includes(vid.id);

                  return (
                    <button
                      key={vid.id}
                      onClick={() => setActiveVideo(vid)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isActive
                          ? 'bg-[#121212] text-white border-[#121212] shadow-md'
                          : 'bg-[#ebe9e4] text-[#121212] border-[#d4d1c8] hover:bg-[#e2e0d8]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 ${
                            isDone
                              ? 'bg-emerald-500 text-white'
                              : isActive
                              ? 'bg-[#f85e00] text-white'
                              : 'bg-[#d4d1c8] text-[#5a5955]'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate">{vid.title}</p>
                          <span
                            className={`text-[10px] font-mono ${
                              isActive ? 'text-gray-300' : 'text-[#5a5955]'
                            }`}
                          >
                            {vid.duration || '10:00'}
                          </span>
                        </div>
                      </div>

                      <PlayCircle
                        className={`w-4 h-4 flex-shrink-0 ${
                          isActive ? 'text-[#f85e00]' : 'text-[#5a5955]'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 3: DEDICATED CERTIFICATES TAB */}
      {studentTab === 'certificates' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-[#121212] tracking-tight">
              My Earned Certificates ({enrollments.length})
            </h2>
            <p className="text-xs text-[#5a5955]">
              Official course completion certificates bearing your name: <strong>{userName}</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrollments.map((e) => {
              const c = e.course;
              return (
                <div
                  key={c.id}
                  className="framer-card rounded-3xl p-6 border border-[#d4d1c8] bg-[#f5f4f0] shadow-lg space-y-4 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                        <GraduationCap className="w-3.5 h-3.5" /> VERIFIED COMPLETION
                      </div>
                      <h3 className="text-lg font-extrabold text-[#121212] tracking-tight">
                        {c.title}
                      </h3>
                      <p className="text-xs text-[#5a5955]">
                        Awarded to: <strong className="text-[#121212]">{userName}</strong>
                      </p>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-[#121212] text-[#d4af37] flex items-center justify-center shadow-md flex-shrink-0">
                      <Award className="w-7 h-7" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#d4d1c8] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#5a5955]">
                      STATUS: 100% COMPLETE
                    </span>

                    <button
                      onClick={() =>
                        setCertModalData({
                          isOpen: true,
                          courseTitle: c.title,
                        })
                      }
                      className="orange-gradient-btn px-4 py-2.5 rounded-xl text-white font-extrabold text-xs flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF Certificate</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Official Certificate Download Modal */}
      <CertificateModal
        isOpen={certModalData.isOpen}
        userName={userName}
        courseTitle={certModalData.courseTitle}
        onClose={() => setCertModalData({ isOpen: false, courseTitle: '' })}
      />

    </section>
  );
};
