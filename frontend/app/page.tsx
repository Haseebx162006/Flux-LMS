"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrustSection } from './components/TrustSection';
import { CourseDiscovery } from './components/CourseDiscovery';
import { CourseDetailsModal } from './components/CourseDetailsModal';
import { CheckoutModal } from './components/CheckoutModal';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal, AuthUser } from './components/AuthModal';
import { Footer } from './components/Footer';

import { ActiveTab, Course, Enrollment } from './types';
import { getCourses } from './services/courseService';
import { getMyEnrollments } from './services/enrollmentService';
import { getStoredUser, logout } from './services/authService';

function HomeContent() {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  // Authentication State
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Modal triggers
  const [selectedCourseDetails, setSelectedCourseDetails] = useState<Course | null>(null);
  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);

  // Restore stored session user and fetch live courses/enrollments from API on mount
  useEffect(() => {
    const savedUser = getStoredUser();
    if (savedUser) {
      setUser(savedUser);
      if (savedUser.role === 'ADMIN') {
        setActiveTab('admin');
      } else if (requestedTab === 'dashboard') {
        setActiveTab('dashboard');
      }
    }

    const loadCatalogAndEnrollments = async () => {
      try {
        const fetchedCourses = await getCourses();
        setCourses(fetchedCourses || []);
      } catch (err) {
        console.error("Error fetching courses from database API:", err);
      }

      if (savedUser && savedUser.role !== 'ADMIN') {
        try {
          const userEnrollments = await getMyEnrollments();
          setEnrollments(userEnrollments || []);
        } catch (err) {
          console.error("Error fetching user enrollments from database API:", err);
        }
      }
    };

    loadCatalogAndEnrollments();
  }, [requestedTab]);

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleLoginSuccess = async (loggedInUser: AuthUser) => {
    setUser(loggedInUser);
    setIsAuthOpen(false);
    
    // Refresh live catalog and user enrollments from backend
    try {
      const fetchedCourses = await getCourses();
      setCourses(fetchedCourses || []);
      
      if (loggedInUser.role !== 'ADMIN') {
        const userEnrollments = await getMyEnrollments();
        setEnrollments(userEnrollments || []);
      }
    } catch (e) {
      // Ignored
    }

    if (loggedInUser.role === 'ADMIN') {
      setActiveTab('admin');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleSignOut = () => {
    logout();
    setUser(null);
    setEnrollments([]);
    setActiveTab('home');
  };

  const handleEnrollSuccess = async (enrolledCourse: Course) => {
    try {
      const userEnrollments = await getMyEnrollments();
      setEnrollments(userEnrollments || []);
    } catch (e) {
      // Ignored
    }
    setCheckoutCourse(null);
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-between font-sans selection:bg-[#f85e00] selection:text-white">
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <>
            <HeroSection
              setActiveTab={setActiveTab}
              user={user}
              onExploreCourses={() => {
                const discoveryEl = document.getElementById('catalog-section');
                if (discoveryEl) {
                  discoveryEl.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setActiveTab('courses');
                }
              }}
            />
            
            <TrustSection />

            <div id="catalog-section" className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
              <CourseDiscovery
                courses={courses}
                onSelectCourse={(course) => setSelectedCourseDetails(course)}
                onEnrollCourse={(course) => {
                  if (!user) {
                    handleOpenAuth('signin');
                    return;
                  }
                  setCheckoutCourse(course);
                }}
              />
            </div>
          </>
        )}

        {activeTab === 'courses' && (
          <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
            <CourseDiscovery
              courses={courses}
              onSelectCourse={(course) => setSelectedCourseDetails(course)}
              onEnrollCourse={(course) => {
                if (!user) {
                  handleOpenAuth('signin');
                  return;
                }
                setCheckoutCourse(course);
              }}
            />
          </div>
        )}

        {activeTab === 'dashboard' && user?.role !== 'ADMIN' && (
          <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
            <StudentDashboard
              enrollments={enrollments}
              onBrowseCourses={() => setActiveTab('courses')}
            />
          </div>
        )}

        {activeTab === 'admin' && user?.role === 'ADMIN' && (
          <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
            <AdminDashboard
              courses={courses}
              onAddCourse={(newCourse) => {
                setCourses([newCourse, ...courses]);
              }}
              onDeleteCourse={(courseId) => {
                setCourses(courses.filter(c => c.id !== courseId));
              }}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} user={user} />

      {/* Course Details Modal */}
      <CourseDetailsModal
        course={selectedCourseDetails}
        onClose={() => setSelectedCourseDetails(null)}
        onEnroll={(course) => {
          setSelectedCourseDetails(null);
          if (!user) {
            handleOpenAuth('signin');
            return;
          }
          setCheckoutCourse(course);
        }}
      />

      {/* Checkout Modal */}
      {checkoutCourse && (
        <CheckoutModal
          course={checkoutCourse}
          onClose={() => setCheckoutCourse(null)}
          onSuccess={handleEnrollSuccess}
        />
      )}

      {/* Auth Modal (Sign In / Sign Up) */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="text-xs font-bold text-[#121212]">Loading FLUX LMS...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
