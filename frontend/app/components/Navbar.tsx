"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ActiveTab } from '../types';
import { AuthUser } from './AuthModal';
import { Home as HomeIcon, BookOpen, LayoutDashboard, ShieldCheck, ArrowUpRight, LogOut } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: AuthUser | null;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onSignOut,
}) => {
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

  return (
    <header className="sticky top-4 z-40 px-4 md:px-8 max-w-7xl mx-auto w-full font-sans">
      <nav className="framer-card rounded-2xl p-3 md:p-4 flex items-center justify-between shadow-lg border border-[#d4d1c8] bg-[#f5f4f0]/90 backdrop-blur-md">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
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
            <p className="text-[11px] text-[#5a5955] font-medium hidden sm:block">Learning Skills That Stick</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-[#ebe9e4] p-1.5 rounded-xl border border-[#d4d1c8]">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'home'
                ? 'bg-[#121212] text-[#ebe9e4] shadow-sm'
                : 'text-[#5a5955] hover:text-[#121212] hover:bg-[#dedcd7]'
            }`}
          >
            <HomeIcon className="w-4 h-4 text-[#f85e00]" />
            Home
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'courses'
                ? 'bg-[#121212] text-[#ebe9e4] shadow-sm'
                : 'text-[#5a5955] hover:text-[#121212] hover:bg-[#dedcd7]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#f85e00]" />
            Courses
          </button>

          {/* Student Portal: ONLY visible for STUDENT users or unauthenticated visitors (NEVER for ADMIN) */}
          {user?.role !== 'ADMIN' && (
            <button
              onClick={() => {
                if (!user) {
                  onOpenAuth('signin');
                } else {
                  setActiveTab('dashboard');
                }
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#121212] text-[#ebe9e4] shadow-sm'
                  : 'text-[#5a5955] hover:text-[#121212] hover:bg-[#dedcd7]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#f85e00]" />
              Student Portal
            </button>
          )}

          {/* Admin Panel: ONLY visible if logged in user is an ADMIN */}
          {user?.role === 'ADMIN' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-[#f85e00] text-white shadow-sm'
                  : 'text-[#f85e00] hover:bg-[#dedcd7]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Panel
            </button>
          )}
        </div>

        {/* User Auth Section */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-[#ebe9e4] border border-[#d4d1c8] hover:border-[#121212] transition-colors cursor-pointer"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-lg object-cover border border-[#121212]"
                />
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-[#121212] leading-tight">{user.name}</p>
                  <p className="text-[10px] font-mono text-[#f85e00] font-bold uppercase">{user.role}</p>
                </div>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#f5f4f0] border border-[#d4d1c8] rounded-2xl shadow-2xl p-2 z-50 text-xs font-bold space-y-1">
                  {user.role !== 'ADMIN' && (
                    <button
                      onClick={() => {
                        setActiveTab('dashboard');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#ebe9e4] text-[#121212] flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#f85e00]" />
                      My Student Portal
                    </button>
                  )}

                  {user.role === 'ADMIN' && (
                    <button
                      onClick={() => {
                        setActiveTab('admin');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#ebe9e4] text-[#f85e00] flex items-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Admin Dashboard
                    </button>
                  )}

                  <div className="border-t border-[#d4d1c8] pt-1" />

                  <button
                    onClick={() => {
                      onSignOut();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-100 text-rose-600 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2.5 rounded-xl bg-[#dedcd7] hover:bg-[#d4d1c8] text-[#121212] font-bold text-xs transition-colors border border-[#c5c2b8]"
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className="orange-gradient-btn px-5 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                Get Started
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

      </nav>
    </header>
  );
};
