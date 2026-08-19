import api from './api';
import { Course } from '../types';

export interface CreateCoursePayload {
  title: string;
  subtitle?: string;
  description?: string;
  price: number;
  category?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail?: string;
}

export interface AddVideoPayload {
  title: string;
  url: string;
  description?: string;
}

/**
 * Upload a course picture/thumbnail to Cloudinary via backend API
 */
export const uploadCourseImage = async (base64OrFileUrl: string): Promise<string> => {
  try {
    const response = await api.post<{ url: string }>('/courses/upload-image', {
      image: base64OrFileUrl
    });
    return response.data.url;
  } catch (error) {
    console.error("Failed to upload course image to Cloudinary:", error);
    throw error;
  }
};

/**
 * Fetch all published courses directly from PostgreSQL database via API
 */
export const getCourses = async (): Promise<Course[]> => {
  try {
    const response = await api.get<{ courses: Course[] }>('/courses');
    if (response.data && Array.isArray(response.data.courses)) {
      return response.data.courses;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch courses from backend database API:", error);
    throw error;
  }
};

/**
 * Fetch single course details by ID directly from PostgreSQL database via API
 */
export const getCourseById = async (id: number): Promise<Course | null> => {
  try {
    const response = await api.get<{ course: Course }>(`/courses/${id}`);
    if (response.data && response.data.course) {
      return response.data.course;
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch course ${id} from database API:`, error);
    throw error;
  }
};

/**
 * Create a new course (Admin only)
 */
export const createCourse = async (payload: CreateCoursePayload): Promise<Course | null> => {
  try {
    const response = await api.post<{ course: Course }>('/courses', payload);
    return response.data.course || null;
  } catch (error) {
    console.error("Failed to create course via backend API:", error);
    throw error;
  }
};

/**
 * Delete a course (Admin only)
 */
export const deleteCourse = async (id: number): Promise<boolean> => {
  try {
    await api.delete(`/courses/${id}`);
    return true;
  } catch (error) {
    console.error(`Failed to delete course ${id} via backend API:`, error);
    throw error;
  }
};

/**
 * Add a video lesson URL to a course (Admin only)
 */
export const addVideoToCourse = async (courseId: number, payload: AddVideoPayload) => {
  try {
    const response = await api.post(`/courses/${courseId}/videos`, payload);
    return response.data;
  } catch (error) {
    console.error(`Failed to add video URL to course ${courseId}:`, error);
    throw error;
  }
};

/**
 * Delete a video lesson from a course (Admin only)
 */
export const deleteVideoFromCourse = async (courseId: number, videoId: number) => {
  try {
    const response = await api.delete(`/courses/${courseId}/videos/${videoId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete video ${videoId} from course ${courseId}:`, error);
    throw error;
  }
};
