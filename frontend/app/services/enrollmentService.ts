import api from './api';
import { Enrollment } from '../types';

/**
 * Fetch enrollments for the currently logged-in student directly from database API
 */
export const getMyEnrollments = async (): Promise<Enrollment[]> => {
  try {
    const response = await api.get<{ enrollments: any[] }>('/enrollments/my-courses');
    if (response.data && Array.isArray(response.data.enrollments)) {
      return response.data.enrollments.map((e: any) => ({
        id: e.id,
        courseId: e.courseId,
        userId: e.userId,
        progressPercentage: e.progressPercentage || 0,
        completedVideoIds: e.completedVideoIds || [],
        enrolledAt: new Date(e.createdAt || Date.now()).toISOString().split('T')[0],
        lastAccessedAt: new Date().toISOString().split('T')[0],
        course: {
          id: e.course.id,
          title: e.course.title,
          subtitle: e.course.description || '',
          description: e.course.description || '',
          price: e.course.price,
          category: e.course.category || 'Web Development',
          level: e.course.level || 'Intermediate',
          instructor: {
            name: 'Course Author',
            role: 'Lead Instructor',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
          },
          rating: 5.0,
          studentsCount: 1,
          thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
          certificateProvided: true,
          videos: (e.course.videos || []).map((v: any) => ({
            id: v.id,
            title: v.title,
            url: v.url,
            description: v.description || '',
            duration: '10:00'
          })),
          reviews: []
        }
      }));
    }
    return [];
  } catch (error) {
    console.error("Could not fetch user enrollments from backend API:", error);
    return [];
  }
};

/**
 * Check if the current user is enrolled in a given course directly from database API
 */
export const checkEnrollmentStatus = async (courseId: number): Promise<boolean> => {
  try {
    const response = await api.get<{ isEnrolled: boolean }>(`/enrollments/status/${courseId}`);
    return Boolean(response.data?.isEnrolled);
  } catch (error) {
    console.warn(`Error checking enrollment status for course ${courseId}:`, error);
    return false;
  }
};
