"use client";

import React, { useState } from 'react';
import { Course } from '../types';
const CATEGORIES = ['All Courses', 'Web Development', 'AI & Machine Learning', 'UI/UX Design', 'Cyber Security'];
import { Search, Star, Clock, Users, PlayCircle, ArrowUpRight, Award, Filter } from 'lucide-react';

interface CourseDiscoveryProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onEnrollCourse: (course: Course) => void;
}

export const CourseDiscovery: React.FC<CourseDiscoveryProps> = ({
  courses,
  onSelectCourse,
  onEnrollCourse,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Courses');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');

  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      selectedCategory === 'All Courses' || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel =
      selectedLevel === 'All' || course.level === selectedLevel;
    return matchesCategory && matchesSearch && matchesLevel;
  });

  return (
    <section id="courses-section" className="px-4 md:px-8 max-w-7xl mx-auto w-full mb-16">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#121212] text-[#ebe9e4] text-xs font-mono font-bold mb-2">
            <span className="text-[#f85e00]">●</span> DISCOVER CURRICULUM
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#121212] tracking-tight">
            Featured Learning Tracks
          </h2>
          <p className="text-sm text-[#5a5955] font-medium pt-1">
            Explore industry-crafted courses designed to take you from foundational concepts to production mastery.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#5a5955] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courses or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f5f4f0] border border-[#d4d1c8] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#121212] font-medium focus:outline-none focus:border-[#121212] transition-colors placeholder:text-[#8a877e]"
          />
        </div>
      </div>

      {/* Filter Tabs & Options */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#d4d1c8]">
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#121212] text-[#ebe9e4] shadow-md'
                  : 'bg-[#f5f4f0] hover:bg-[#dedcd7] text-[#5a5955] border border-[#d4d1c8]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Level Dropdown */}
        <div className="flex items-center gap-2 text-xs font-bold text-[#5a5955]">
          <Filter className="w-3.5 h-3.5 text-[#f85e00]" />
          <span>Level:</span>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="bg-[#f5f4f0] border border-[#d4d1c8] rounded-lg px-2.5 py-1.5 text-xs text-[#121212] font-bold focus:outline-none cursor-pointer"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="framer-card rounded-2xl p-12 text-center text-[#5a5955] border border-[#d4d1c8]">
          <p className="text-lg font-bold">No courses match your search criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory('All Courses');
              setSearchQuery('');
              setSelectedLevel('All');
            }}
            className="mt-4 orange-gradient-btn px-4 py-2 rounded-xl text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="framer-card rounded-2xl overflow-hidden border border-[#d4d1c8] flex flex-col justify-between hover:border-[#121212] transition-all hover:shadow-xl group"
            >
              {/* Thumbnail Header */}
              <div className="relative h-48 w-full overflow-hidden bg-[#121212]">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                />
                
                {/* Badge Tag */}
                {course.badge && (
                  <span className="absolute top-3 left-3 bg-[#121212] text-[#f85e00] px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold tracking-wider uppercase shadow-md border border-[#2a2a2a]">
                    {course.badge}
                  </span>
                )}

                {/* Level Pill */}
                <span className="absolute top-3 right-3 bg-[#f5f4f0]/90 backdrop-blur-sm text-[#121212] px-2.5 py-1 rounded-lg text-[11px] font-bold border border-[#d4d1c8]">
                  {course.level}
                </span>

                {/* Play Icon Overlay */}
                <div 
                  onClick={() => onSelectCourse(course)}
                  className="absolute inset-0 bg-[#121212]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-[#f85e00] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-7 h-7" />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#5a5955] font-semibold">
                    <span className="text-[#f85e00] font-mono font-bold uppercase">{course.category}</span>
                    <div className="flex items-center gap-1 font-mono font-bold text-[#121212]">
                      <Star className="w-3.5 h-3.5 fill-[#f85e00] text-[#f85e00]" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  <h3 
                    onClick={() => onSelectCourse(course)}
                    className="text-lg font-bold text-[#121212] leading-snug cursor-pointer hover:text-[#f85e00] transition-colors"
                  >
                    {course.title}
                  </h3>

                  <p className="text-xs text-[#5a5955] font-medium line-clamp-2 leading-relaxed">
                    {course.subtitle}
                  </p>
                </div>

                {/* Instructor & Meta */}
                <div className="pt-3 border-t border-[#d4d1c8] space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#5a5955]">
                    <div className="flex items-center gap-2">
                      <img
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        className="w-6 h-6 rounded-full object-cover border border-[#121212]"
                      />
                      <span className="font-semibold text-[#121212] text-[11px]">{course.instructor.name}</span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="flex items-center gap-1">
                        <PlayCircle className="w-3 h-3 text-[#f85e00]" />
                        {course.videos.length} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#5a5955]" />
                        {course.studentsCount}
                      </span>
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-extrabold font-grotesk text-[#121212]">
                          ${course.price.toFixed(2)}
                        </span>
                        {course.originalPrice && (
                          <span className="text-xs text-[#8a877e] line-through font-mono">
                            ${course.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectCourse(course)}
                        className="px-3 py-1.5 rounded-lg bg-[#dedcd7] hover:bg-[#d4d1c8] text-[#121212] text-xs font-bold transition-colors cursor-pointer"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => onEnrollCourse(course)}
                        className="orange-gradient-btn px-3.5 py-1.5 rounded-lg text-white text-xs font-bold flex items-center gap-1 shadow cursor-pointer"
                      >
                        Enroll
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </section>
  );
};
