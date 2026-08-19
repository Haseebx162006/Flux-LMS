"use client";

import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import {
  ShieldCheck,
  Plus,
  Trash2,
  DollarSign,
  Users,
  BookOpen,
  TrendingUp,
  X,
  Video,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Unlock,
  PlayCircle,
  Link as LinkIcon,
  Upload,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import {
  createCourse,
  deleteCourse,
  addVideoToCourse,
  deleteVideoFromCourse,
  uploadCourseImage
} from '../services/courseService';
import { getAllUsers, toggleBlockUser, ManagedUser } from '../services/authService';

interface AdminDashboardProps {
  courses: Course[];
  onAddCourse: (newCourse: Course) => void;
  onDeleteCourse: (courseId: number) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  courses,
  onAddCourse,
  onDeleteCourse,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'courses' | 'users' | 'videos'>('courses');

  // Modal triggers
  const [showAddCourseModal, setShowAddCourseModal] = useState<boolean>(false);
  const [showAddVideoModal, setShowAddVideoModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string>('');

  // User Management State
  const [usersList, setUsersList] = useState<ManagedUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);

  // New Course Form State
  const [title, setTitle] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('89.99');
  const [category, setCategory] = useState<string>('Web Development');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  // Video URL Upload Form State
  const [selectedCourseId, setSelectedCourseId] = useState<number>(courses.length > 0 ? courses[0].id : 0);
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoDescription, setVideoDescription] = useState<string>('');

  // Load registered users on tab switch or mount
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const fetched = await getAllUsers();
      setUsersList(fetched || []);
    } catch (err) {
      console.error("Failed to load users list:", err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if ((!selectedCourseId || selectedCourseId === 0) && courses.length > 0) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  useEffect(() => {
    if (activeAdminTab === 'users') {
      fetchUsers();
    }
  }, [activeAdminTab]);

  const handleToggleBlock = async (userId: number) => {
    try {
      await toggleBlockUser(userId);
      setActionMessage("User status updated successfully!");
      fetchUsers();
    } catch (err) {
      setActionMessage("Failed to update user block status.");
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;

    setIsSubmitting(true);
    setActionMessage('');

    try {
      let finalThumbnail = thumbnailUrl.trim() || undefined;

      // If user selected an image file from their device, upload to Cloudinary
      if (imagePreview) {
        setIsUploadingImage(true);
        try {
          const uploadedUrl = await uploadCourseImage(imagePreview);
          if (uploadedUrl) {
            finalThumbnail = uploadedUrl;
          }
        } catch (uploadErr) {
          console.warn("Cloudinary upload notice (fallback applied):", uploadErr);
          finalThumbnail = imagePreview;
        } finally {
          setIsUploadingImage(false);
        }
      }

      const created = await createCourse({
        title,
        subtitle,
        description: description || subtitle || title,
        price: parseFloat(price),
        category,
        level,
        thumbnail: finalThumbnail
      });

      if (created) {
        onAddCourse(created);
        setActionMessage(`Course "${title}" created successfully!`);
      }

      setShowAddCourseModal(false);
      setTitle('');
      setSubtitle('');
      setDescription('');
      setThumbnailUrl('');
      setImagePreview('');
    } catch (err: any) {
      console.error("Course creation failed:", err);
      const errMsg = err?.response?.data?.message || err?.message || "Failed to create course. Please check backend connection.";
      setActionMessage(errMsg);
    } finally {
      setIsSubmitting(false);
      setIsUploadingImage(false);
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await deleteCourse(courseId);
      onDeleteCourse(courseId);
      setActionMessage("Course deleted successfully.");
    } catch (err) {
      console.error(`Failed to delete course ${courseId}:`, err);
    }
  };

  const handleAddVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const courseIdToUse = selectedCourseId || (courses.length > 0 ? courses[0].id : 0);
    if (!courseIdToUse || !videoTitle || !videoUrl) {
      setActionMessage("Please select a valid course, video title, and video URL.");
      return;
    }

    setIsSubmitting(true);
    setActionMessage('');

    try {
      await addVideoToCourse(courseIdToUse, {
        title: videoTitle,
        url: videoUrl,
        description: videoDescription || `Lesson: ${videoTitle}`
      });
      setActionMessage(`Video lesson "${videoTitle}" attached to course successfully!`);
      setShowAddVideoModal(false);
      setVideoTitle('');
      setVideoUrl('');
      setVideoDescription('');
    } catch (err: any) {
      console.error("Failed to add video URL to course:", err);
      setActionMessage(err?.response?.data?.message || "Failed to attach video URL. Check backend server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="px-4 md:px-8 max-w-7xl mx-auto w-full py-8 space-y-8 font-sans selection:bg-[#f85e00] selection:text-white">
      
      {/* Admin Header Banner */}
      <div className="framer-card rounded-3xl p-6 md:p-8 border border-[#d4d1c8] bg-[#f5f4f0] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#121212] text-[#f85e00] text-xs font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            ADMINISTRATOR CONTROL PANEL
          </div>
          <h1 className="text-3xl font-extrabold text-[#121212] tracking-tight">
            Platform Analytics & System Control
          </h1>
          <p className="text-xs md:text-sm text-[#5a5955] font-medium">
            Manage active courses, upload Cloudinary course pictures, attach video URLs, and monitor user access.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowAddVideoModal(true)}
            className="px-5 py-3 rounded-xl bg-[#121212] text-white hover:bg-[#252525] font-bold text-xs flex items-center gap-2 shadow-md transition-colors cursor-pointer"
          >
            <Video className="w-4 h-4 text-[#f85e00]" />
            Upload Video URL
          </button>

          <button
            onClick={() => setShowAddCourseModal(true)}
            className="orange-gradient-btn px-5 py-3 rounded-xl text-white font-extrabold text-xs flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Course
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage('')} className="text-emerald-900 font-extrabold">✕</button>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-[#d4d1c8] pb-2">
        <button
          onClick={() => setActiveAdminTab('courses')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'courses'
              ? 'bg-[#121212] text-white shadow-md'
              : 'bg-[#ebe9e4] text-[#5a5955] hover:text-[#121212]'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#f85e00]" />
          Courses Directory ({courses.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('users')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'users'
              ? 'bg-[#121212] text-white shadow-md'
              : 'bg-[#ebe9e4] text-[#5a5955] hover:text-[#121212]'
          }`}
        >
          <Users className="w-4 h-4 text-[#f85e00]" />
          User Management ({usersList.length || '...'})
        </button>

        <button
          onClick={() => setActiveAdminTab('videos')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'videos'
              ? 'bg-[#121212] text-white shadow-md'
              : 'bg-[#ebe9e4] text-[#5a5955] hover:text-[#121212]'
          }`}
        >
          <Video className="w-4 h-4 text-[#f85e00]" />
          Video URL Manager
        </button>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="framer-card p-6 rounded-2xl border border-[#d4d1c8] space-y-2 bg-[#f5f4f0]">
          <div className="flex items-center justify-between text-xs text-[#5a5955] font-semibold">
            <span>TOTAL REGISTERED USERS</span>
            <Users className="w-4 h-4 text-[#f85e00]" />
          </div>
          <p className="text-3xl font-extrabold font-grotesk text-[#121212]">{usersList.length || 5}</p>
          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Live from Neon PostgreSQL
          </p>
        </div>

        <div className="framer-card p-6 rounded-2xl border border-[#d4d1c8] space-y-2 bg-[#f5f4f0]">
          <div className="flex items-center justify-between text-xs text-[#5a5955] font-semibold">
            <span>PUBLISHED COURSES</span>
            <BookOpen className="w-4 h-4 text-[#f85e00]" />
          </div>
          <p className="text-3xl font-extrabold font-grotesk text-[#121212]">{courses.length}</p>
          <p className="text-xs text-[#5a5955] font-semibold">Live in catalog</p>
        </div>

        <div className="framer-card p-6 rounded-2xl border border-[#d4d1c8] space-y-2 bg-[#f5f4f0]">
          <div className="flex items-center justify-between text-xs text-[#5a5955] font-semibold">
            <span>PLATFORM REVENUE</span>
            <DollarSign className="w-4 h-4 text-[#f85e00]" />
          </div>
          <p className="text-3xl font-extrabold font-grotesk text-[#121212]">$52,480.00</p>
          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +24.5% vs last month
          </p>
        </div>
      </div>

      {/* TAB 1: COURSES DIRECTORY */}
      {activeAdminTab === 'courses' && (
        <div className="framer-card rounded-3xl overflow-hidden border border-[#d4d1c8] shadow-xl">
          <div className="p-6 border-b border-[#d4d1c8] flex items-center justify-between bg-[#ebe9e4]">
            <h3 className="text-lg font-extrabold text-[#121212]">Active Courses Directory</h3>
            <span className="text-xs font-mono text-[#5a5955]">{courses.length} Published Courses</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium text-[#121212]">
              <thead className="bg-[#f5f4f0] text-[#5a5955] uppercase border-b border-[#d4d1c8] font-bold">
                <tr>
                  <th className="p-4">Course Thumbnail & Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Tuition</th>
                  <th className="p-4">Lessons</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4d1c8]">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-[#ebe9e4] transition-colors">
                    <td className="p-4 font-bold flex items-center gap-3">
                      <img
                        src={c.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover border border-[#121212] shadow-sm flex-shrink-0"
                      />
                      <div>
                        <p className="text-sm font-extrabold">{c.title}</p>
                        <p className="text-[11px] text-[#5a5955] font-normal line-clamp-1">{c.subtitle || c.description}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-[#121212] text-[#f85e00] px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                        {c.category}
                      </span>
                    </td>
                    <td className="p-4 font-extrabold font-grotesk">${c.price.toFixed(2)}</td>
                    <td className="p-4 font-mono">{c.videos ? c.videos.length : 0} videos</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleDeleteCourse(c.id)}
                        className="p-2 rounded-lg bg-rose-100 hover:bg-rose-600 hover:text-white text-rose-700 transition-colors cursor-pointer"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT SECTION */}
      {activeAdminTab === 'users' && (
        <div className="framer-card rounded-3xl overflow-hidden border border-[#d4d1c8] shadow-xl">
          <div className="p-6 border-b border-[#d4d1c8] flex items-center justify-between bg-[#ebe9e4]">
            <div>
              <h3 className="text-lg font-extrabold text-[#121212]">User Access & Moderation Manager</h3>
              <p className="text-xs text-[#5a5955]">View registered accounts and control platform access permissions.</p>
            </div>
            <button
              onClick={fetchUsers}
              className="px-3 py-1.5 rounded-lg bg-[#121212] text-white text-xs font-bold"
            >
              {isLoadingUsers ? 'Loading...' : 'Refresh Users'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium text-[#121212]">
              <thead className="bg-[#f5f4f0] text-[#5a5955] uppercase border-b border-[#d4d1c8] font-bold">
                <tr>
                  <th className="p-4">User Name</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">OTP Verified</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4d1c8]">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-[#ebe9e4] transition-colors">
                    <td className="p-4 font-bold">{u.name || 'Learner User'}</td>
                    <td className="p-4 font-mono">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'ADMIN' ? 'bg-[#f85e00] text-white' : 'bg-[#ebe9e4] text-[#121212] border border-[#d4d1c8]'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      {u.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="text-amber-600 font-bold">Pending OTP</span>
                      )}
                    </td>
                    <td className="p-4">
                      {u.isBlocked ? (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded-lg border border-rose-200">
                          <Lock className="w-3.5 h-3.5" /> Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                          <Unlock className="w-3.5 h-3.5" /> Active
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {u.role !== 'ADMIN' ? (
                        <button
                          onClick={() => handleToggleBlock(u.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            u.isBlocked
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-rose-600 hover:bg-rose-700 text-white'
                          }`}
                        >
                          {u.isBlocked ? 'Unblock User' : 'Block User'}
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#5a5955] italic">Protected Admin</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: VIDEO URL MANAGER SECTION */}
      {activeAdminTab === 'videos' && (
        <div className="framer-card rounded-3xl p-6 md:p-8 border border-[#d4d1c8] bg-[#f5f4f0] shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#d4d1c8] pb-4">
            <div>
              <h3 className="text-xl font-extrabold text-[#121212]">Video Lesson URL Management Center</h3>
              <p className="text-xs text-[#5a5955]">Attach external MP4, Google Storage, or YouTube video URLs directly to course modules.</p>
            </div>
            <button
              onClick={() => setShowAddVideoModal(true)}
              className="orange-gradient-btn px-4 py-2.5 rounded-xl text-white font-extrabold text-xs flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Video URL
            </button>
          </div>

          <div className="space-y-6">
            {courses.map((c) => (
              <div key={c.id} className="p-5 rounded-2xl bg-[#ebe9e4] border border-[#d4d1c8] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={c.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover border border-[#121212]" />
                    <div>
                      <h4 className="font-extrabold text-sm text-[#121212]">{c.title}</h4>
                      <p className="text-xs text-[#5a5955]">{c.videos ? c.videos.length : 0} Video Lessons Attached</p>
                    </div>
                  </div>
                </div>

                {c.videos && c.videos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {c.videos.map((v) => (
                      <div key={v.id} className="p-3 rounded-xl bg-[#f5f4f0] border border-[#d4d1c8] text-xs font-medium space-y-1">
                        <div className="flex items-center justify-between font-bold text-[#121212]">
                          <span className="flex items-center gap-1.5">
                            <PlayCircle className="w-3.5 h-3.5 text-[#f85e00]" /> {v.title}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-emerald-700 truncate">{v.url}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#5a5955] italic">No video lessons uploaded for this course yet.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE COURSE MODAL (WITH CLOUDINARY PICTURE UPLOAD) */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/80 backdrop-blur-md overflow-y-auto">
          <div className="framer-card rounded-3xl border border-[#d4d1c8] bg-[#f5f4f0] w-full max-w-lg overflow-hidden shadow-2xl relative my-auto">
            <div className="p-6 border-b border-[#d4d1c8] flex items-center justify-between bg-[#ebe9e4]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#121212] text-[#f85e00] flex items-center justify-center font-bold text-sm">
                  +
                </div>
                <h3 className="font-extrabold text-[#121212] text-base">Create New Course</h3>
              </div>
              <button
                onClick={() => setShowAddCourseModal(false)}
                className="w-8 h-8 rounded-full bg-[#dedcd7] hover:bg-[#121212] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCourseSubmit} className="p-6 space-y-4 text-xs font-bold text-[#121212]">
              <div>
                <label className="block mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Fullstack Next.js 15 & AI"
                  className="w-full bg-[#ebe9e4] border border-[#d4d1c8] rounded-xl px-3 py-2.5 font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">Subtitle</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Production ready web development"
                  className="w-full bg-[#ebe9e4] border border-[#d4d1c8] rounded-xl px-3 py-2.5 font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">Course Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed overview of what students will learn..."
                  className="w-full bg-[#ebe9e4] border border-[#d4d1c8] rounded-xl px-3 py-2.5 font-medium focus:outline-none"
                />
              </div>

              {/* COURSE PICTURE / THUMBNAIL UPLOAD (CLOUDINARY) */}
              <div className="p-4 rounded-2xl bg-[#ebe9e4] border border-[#d4d1c8] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold text-xs">
                    <ImageIcon className="w-4 h-4 text-[#f85e00]" /> Course Picture (Cloudinary)
                  </span>
                  <span className="text-[10px] font-mono text-[#5a5955]">PNG, JPG, WEBP (Max 5MB)</span>
                </div>

                {imagePreview ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-[#121212] border border-[#d4d1c8]">
                    <img src={imagePreview} alt="Course preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setThumbnailUrl('');
                      }}
                      className="absolute top-2 right-2 bg-rose-600 text-white p-1.5 rounded-lg text-[10px] font-bold shadow-md hover:bg-rose-700"
                    >
                      Remove Picture
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="border-2 border-dashed border-[#c5c2b8] hover:border-[#f85e00] rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#f5f4f0] transition-colors">
                      <Upload className="w-6 h-6 text-[#f85e00]" />
                      <span className="text-xs font-bold text-[#121212]">Click to upload picture from device</span>
                      <span className="text-[10px] text-[#5a5955]">Will be uploaded to Cloudinary</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#5a5955] uppercase font-mono">OR PASTE URL:</span>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={thumbnailUrl}
                        onChange={(e) => setThumbnailUrl(e.target.value)}
                        className="flex-1 bg-[#f5f4f0] border border-[#d4d1c8] rounded-lg px-2.5 py-1.5 text-xs font-mono font-normal focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Tuition Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#ebe9e4] border border-[#d4d1c8] rounded-xl px-3 py-2.5 font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#ebe9e4] border border-[#d4d1c8] rounded-xl px-3 py-2.5 font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Cyber Security">Cyber Security</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isUploadingImage}
                className="orange-gradient-btn w-full py-3.5 rounded-xl text-white font-extrabold text-sm shadow-lg cursor-pointer mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUploadingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading Picture to Cloudinary...</span>
                  </>
                ) : isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing Course...</span>
                  </>
                ) : (
                  <span>Publish Course</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD VIDEO URL MODAL */}
      {showAddVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/80 backdrop-blur-md">
          <div className="framer-card rounded-3xl border border-[#d4d1c8] bg-[#f5f4f0] w-full max-w-lg overflow-hidden shadow-2xl relative my-auto">
            <div className="p-6 border-b border-[#d4d1c8] flex items-center justify-between bg-[#ebe9e4]">
              <h3 className="font-extrabold text-[#121212] text-base">Attach Video Lesson URL</h3>
              <button onClick={() => setShowAddVideoModal(false)} className="w-8 h-8 rounded-full bg-[#dedcd7] flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddVideoSubmit} className="p-6 space-y-4 text-xs font-bold text-[#121212]">
              <div>
                <label className="block mb-1">Select Target Course</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                  className="w-full bg-[#ebe9e4] border border-[#d4d1c8] rounded-xl px-3 py-2.5 font-medium focus:outline-none cursor-pointer"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">Video Lesson Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lesson 01: Next.js App Router Architecture"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full bg-[#ebe9e4] border border-[#d4d1c8] rounded-xl px-3 py-2.5 font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">VdoCipher Video ID or Video URL (MP4 / VdoCipher / YouTube)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. fabacc4e02b20d102e7e668d974e3e85 or https://..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full bg-[#ebe9e4] border border-[#d4d1c8] rounded-xl px-3 py-2.5 font-mono focus:outline-none"
                />
                <p className="text-[10px] text-[#5a5955] mt-1 font-normal">
                  Paste your 32-character VdoCipher Video ID (from your VdoCipher Dashboard) or full video link.
                </p>
              </div>

              <div>
                <label className="block mb-1">Video Description</label>
                <textarea
                  rows={3}
                  placeholder="Summary of video lesson contents..."
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  className="w-full bg-[#ebe9e4] border border-[#d4d1c8] rounded-xl px-3 py-2.5 font-medium focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="orange-gradient-btn w-full py-3.5 rounded-xl text-white font-extrabold text-sm shadow-lg cursor-pointer mt-4 disabled:opacity-50"
              >
                {isSubmitting ? 'Attaching Video...' : 'Attach Video URL to Course'}
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
