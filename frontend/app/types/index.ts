export interface Video {
  id: number;
  title: string;
  url: string;
  description?: string;
  duration?: string;
  isCompleted?: boolean;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
}

export interface Course {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  rating: number;
  studentsCount: number;
  videos: Video[];
  reviews: Review[];
  thumbnail: string;
  badge?: string;
  certificateProvided: boolean;
}

export interface Enrollment {
  id: number;
  courseId: number;
  userId: number;
  progressPercentage: number;
  completedVideoIds: number[];
  enrolledAt: string;
  lastAccessedAt: string;
  course: Course;
}

export interface Payment {
  id: number;
  userId: number;
  courseId: number;
  amount: number;
  status: 'PAID' | 'PENDING' | 'FAILED';
  transactionId: string;
  createdAt: string;
  courseTitle: string;
}

export type ActiveTab = 'home' | 'courses' | 'dashboard' | 'admin';
