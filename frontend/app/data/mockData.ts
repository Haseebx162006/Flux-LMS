import { Course, Enrollment, Payment } from '../types';

export const MOCK_CATEGORIES = [
  'All Courses',
  'Web Development',
  'AI & Machine Learning',
  'UI/UX Design',
  'Data Science',
  'Cyber Security'
];

export const MOCK_COURSES: Course[] = [
  {
    id: 1,
    title: "Next.js 15 & Framer Motion Masterclass",
    subtitle: "Build ultra-modern interactive web applications with modern animation and server components.",
    description: "Master full-stack web development with Next.js App Router, Framer Motion animations, Tailwind CSS, and serverless backend architecture. Designed for developers looking to build high-converting digital products.",
    price: 89.99,
    originalPrice: 149.99,
    category: "Web Development",
    level: "Intermediate",
    instructor: {
      name: "Marcus Vance",
      role: "Lead Creative Technologist",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
    },
    rating: 4.9,
    studentsCount: 3840,
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    badge: "Bestseller",
    certificateProvided: true,
    videos: [
      {
        id: 101,
        title: "01. Introduction to Next.js 15 App Router",
        duration: "12:45",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        description: "Overview of server components, routing conventions, and modern layout structure.",
        isCompleted: true
      },
      {
        id: 102,
        title: "02. Setting up Framer Motion & Layout Animations",
        duration: "18:20",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        description: "Implementing micro-interactions, page transitions, and floating spring physics.",
        isCompleted: true
      },
      {
        id: 103,
        title: "03. Building the Pixel-Perfect Framer Hero Section",
        duration: "24:10",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        description: "Creating retro-modern badge overlays, custom color themes, and stat counters.",
        isCompleted: false
      },
      {
        id: 104,
        title: "04. Database Schema Design with Prisma & Postgres",
        duration: "31:05",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        description: "Designing models for courses, users, video lessons, payments, and enrollments.",
        isCompleted: false
      },
      {
        id: 105,
        title: "05. Deploying to Vercel & Production Optimization",
        duration: "15:50",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        description: "SEO optimization, edge caching, and automated deployment setup.",
        isCompleted: false
      }
    ],
    reviews: [
      {
        id: 1,
        rating: 5,
        comment: "The Framer design system modules completely elevated how I build client websites!",
        userName: "Elena Rostova",
        createdAt: "2 days ago"
      },
      {
        id: 2,
        rating: 5,
        comment: "Clear, concise, and incredibly practical. The video player interface is top notch.",
        userName: "David Chen",
        createdAt: "1 week ago"
      }
    ]
  },
  {
    id: 2,
    title: "AI Engineering & LLM Application Architecture",
    subtitle: "Build production AI agents, RAG systems, and neural workflow integrations.",
    description: "Learn how to build autonomous AI systems, integrate OpenAI/Claude models, build vector database pipelines, and scale AI-driven SaaS applications.",
    price: 119.99,
    originalPrice: 199.99,
    category: "AI & Machine Learning",
    level: "Advanced",
    instructor: {
      name: "Dr. Aris Thorne",
      role: "AI Research Scientist",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80"
    },
    rating: 4.95,
    studentsCount: 2190,
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
    badge: "Trending",
    certificateProvided: true,
    videos: [
      {
        id: 201,
        title: "01. Fundamentals of Large Language Model APIs",
        duration: "14:15",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyplays.mp4",
        description: "Understanding token limits, temperature, structured JSON output, and prompt engineering.",
        isCompleted: false
      },
      {
        id: 202,
        title: "02. Building Autonomous AI Agents with Tool Use",
        duration: "28:40",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        description: "Agentic tool calling, memory management, and multi-agent coordination.",
        isCompleted: false
      }
    ],
    reviews: [
      {
        id: 3,
        rating: 5,
        comment: "Extremely thorough breakdown of RAG and vector embeddings!",
        userName: "Sophia Miller",
        createdAt: "3 days ago"
      }
    ]
  },
  {
    id: 3,
    title: "Design Systems & High-Impact UI/UX Masterclass",
    subtitle: "From Figma variables and auto-layout to production React component systems.",
    description: "Design pixel-perfect, scalable design systems. Learn typography hierarchy, spacing scale, micro-animations, color science, and component tokenization.",
    price: 69.99,
    originalPrice: 109.99,
    category: "UI/UX Design",
    level: "Beginner",
    instructor: {
      name: "Camille Dubois",
      role: "Staff Product Designer",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80"
    },
    rating: 4.88,
    studentsCount: 4120,
    thumbnail: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80",
    badge: "Popular",
    certificateProvided: true,
    videos: [
      {
        id: 301,
        title: "01. Design Tokens & Color Harmony Science",
        duration: "16:20",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        description: "Structuring HSL color tokens, dark mode variables, and contrast ratio compliance.",
        isCompleted: false
      }
    ],
    reviews: []
  },
  {
    id: 4,
    title: "Cybersecurity Essentials & Ethical Hacking",
    subtitle: "Network defense, vulnerability auditing, and secure web app architecture.",
    description: "Learn offensive and defensive security practices, penetration testing, CORS/CSRF defense, JWT security, and automated code vulnerability scanning.",
    price: 94.99,
    originalPrice: 159.99,
    category: "Cyber Security",
    level: "Intermediate",
    instructor: {
      name: "Kaelen Voss",
      role: "Security Architect",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80"
    },
    rating: 4.85,
    studentsCount: 1580,
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    certificateProvided: true,
    videos: [
      {
        id: 401,
        title: "01. Web Application Vulnerabilities & OWASP Top 10",
        duration: "21:30",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutback2012.mp4",
        description: "Hands-on audit of SQL injection, XSS, and broken authentication.",
        isCompleted: false
      }
    ],
    reviews: []
  }
];

export const MOCK_USER_ENROLLMENTS: Enrollment[] = [
  {
    id: 501,
    courseId: 1,
    userId: 1,
    progressPercentage: 40,
    completedVideoIds: [101, 102],
    enrolledAt: "2026-08-01",
    lastAccessedAt: "2026-08-17",
    course: MOCK_COURSES[0]
  }
];

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: 901,
    userId: 1,
    courseId: 1,
    amount: 89.99,
    status: "PAID",
    transactionId: "tx_str_8492041948",
    createdAt: "2026-08-01T14:22:00Z",
    courseTitle: "Next.js 15 & Framer Motion Masterclass"
  }
];
