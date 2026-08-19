# ⚡ FLUX LMS — Next-Gen Learning Management System

> **A modern, full-stack Learning Management System (LMS) built with Next.js 16 App Router, Node.js/Express, PostgreSQL (Neon), Prisma ORM, Stripe Payments, Cloudinary, and VdoCipher Secure DRM Video Streaming.**

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [Student Experience](#-student-experience)
  - [Admin & Instructor Center](#-admin--instructor-center)
  - [Security & DRM Video Streaming](#-security--drm-video-streaming)
  - [Payments & Monetization](#-payments--monetization)
- [Tech Stack](#-tech-stack)
- [Architecture & Database Schema](#-architecture--database-schema)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#1-backend-setup)
  - [Frontend Setup](#2-frontend-setup)
- [Environment Variables](#-environment-variables)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Deployment](#-deployment)
- [License](#-license)

---

## 🌟 Overview

**FLUX LMS** is a full-featured educational platform designed for premium digital learning experiences. It enables instructors and administrators to create structured curricula, securely host DRM-protected video lessons, upload course thumbnails via Cloudinary, accept Stripe payments, and issue downloadable PDF certificates upon course completion.

---

## ✨ Key Features

### 🎓 Student Experience
- **Interactive Course Discovery**: Filter courses by category, difficulty level (Beginner / Intermediate / Advanced), and keywords.
- **Rich Course Previews**: Syllabus breakdowns, lesson curriculum details, instructor profiles, and tuition pricing.
- **Dedicated Learning Player**: Distraction-free study portal with automated curriculum navigation, lesson completion tracking, and real-time progress percentage.
- **Dynamic Certificate Generation**: Unlocks a downloadable, personalized completion certificate when 100% of course lessons are completed.
- **Email OTP Verification**: Secure email-based registration with 6-digit OTP verification powered by Nodemailer.

### 🛡️ Admin & Instructor Center
- **Course Studio**: Full CRUD operations for creating, updating, and removing courses.
- **Cloudinary Image Upload**: Direct image file upload and hosting for course cover art and thumbnails.
- **Video Lesson Manager**: Attach video lessons to specific courses with titles, descriptions, and duration.
- **Live Video Testing**: Instant modal preview with embedded playback testing before publishing lessons.
- **User Access Management**: View registered platform users and block or unblock user accounts.
- **Analytics Overview**: Real-time tracking of platform revenue, active courses, student enrollments, and user counts.

### 🔒 Security & DRM Video Streaming
- **VdoCipher DRM Integration**: Studio-grade DRM encryption prevents screen capture and video downloads.
- **Dynamic OTP Authentication**: Backend generates short-lived, encrypted one-time playback tokens (`otp` and `playbackInfo`) on demand.
- **Universal Video Input**: Accepts 32-character VdoCipher Video IDs, dashboard URLs, embed snippets, YouTube links, Vimeo links, and direct MP4 streams.
- **JWT Authentication & Role-Based Access**: Secured endpoints with token-based authentication and role enforcement (`STUDENT` vs. `ADMIN`).

### 💳 Payments & Monetization
- **Stripe Checkout**: Seamless checkout sessions for purchasing course enrollment.
- **Stripe Webhooks & Verification**: Automatic enrollment granting upon verified Stripe payment completion.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: PostgreSQL (Neon Serverless Postgres)
- **ORM**: [Prisma ORM 7](https://www.prisma.io/) with `@prisma/adapter-pg`
- **Authentication**: JSON Web Tokens (JWT) & Bcrypt
- **Email Delivery**: Nodemailer (Gmail OAuth2 / SMTP)
- **Image Storage**: Cloudinary SDK
- **DRM Video**: VdoCipher API
- **Payments**: Stripe Node SDK

---

## 🗄️ Architecture & Database Schema

```prisma
enum Role {
  STUDENT
  ADMIN
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

model user {
  id                     Int          @id @default(autoincrement())
  name                   String
  email                  String       @unique
  password               String
  isVerified             Boolean      @default(false)
  isBlocked              Boolean      @default(false)
  otp                    String?
  otpExpiry              DateTime?
  role                   Role         @default(STUDENT)
  courses                course[]
  reviews                Review[]
  payments               Payment[]
  enrollments            Enrollment[]
}

model course {
  id          Int          @id @default(autoincrement())
  title       String
  userId      Int
  description String?
  price       Float
  category    String       @default("Web Development")
  level       String       @default("Intermediate")
  thumbnail   String?
  videos      Video[]
  reviews     Review[]
  payments    Payment[]
  enrollments Enrollment[]
}

model Video {
  id          Int     @id @default(autoincrement())
  title       String
  url         String
  description String?
  courseId    Int
  course      course  @relation(fields: [courseId], references: [id], onDelete: Cascade)
}

model Enrollment {
  id        Int      @id @default(autoincrement())
  userId    Int
  courseId  Int
  createdAt DateTime @default(now())

  @@unique([userId, courseId])
}
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.x` or higher (Node `v20+` recommended)
- **PostgreSQL**: Neon Cloud Postgres instance or local PostgreSQL database
- **Accounts**:
  - [Stripe](https://stripe.com/) (for checkout & webhooks)
  - [Cloudinary](https://cloudinary.com/) (for course image uploads)
  - [VdoCipher](https://www.vdocipher.com/) (for DRM video hosting)

---

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env # or create .env using the template below

# Generate Prisma Client & Run Migrations
npx prisma generate
npx prisma db push

# (Optional) Seed the database with sample courses & admin
npm run seed

# Start development server with file watch
npm run dev
```

The backend server will run on `http://localhost:5000`.

---

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

The frontend application will be live at `http://localhost:3000`.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```env
# Server
PORT=5000
FRONTEND_URL="http://localhost:3000"
JWT_SECRET="your_jwt_secret_key"

# Database (PostgreSQL / Neon)
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# VdoCipher DRM Video Streaming
VDOCIPHER_API_SECRET="your_vdocipher_api_secret"

# Cloudinary Image Upload
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Email Delivery (Nodemailer / Gmail)
EMAIL_USER="your_email@gmail.com"
MAIL_PASS="your_app_password"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GOOGLE_REFRESH_TOKEN="..."
GOOGLE_REDIRECT_URI="https://developers.google.com/oauthplayground"
```

### Frontend (`frontend/.env.local` or environment)

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:5000/api"
```

---

## 📡 API Endpoints Reference

### 🔑 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register new student account & send OTP | Public |
| `POST` | `/api/auth/verify-otp` | Verify 6-digit email OTP | Public |
| `POST` | `/api/auth/signin` | Sign in with email & password | Public |
| `POST` | `/api/auth/google` | Sign in / register via Google OAuth | Public |
| `POST` | `/api/auth/forgot-password` | Request password reset OTP | Public |
| `POST` | `/api/auth/reset-password` | Reset password using OTP | Public |
| `GET` | `/api/auth/users` | Get all managed users | Admin |
| `PATCH`| `/api/auth/users/:id/block` | Toggle block/unblock user status | Admin |

### 📚 Courses & Videos (`/api/courses`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/courses` | List all published courses with videos & reviews | Public |
| `GET` | `/api/courses/:id` | Get specific course details | Public |
| `GET` | `/api/courses/vdocipher-otp/:videoId` | Generate authenticated VdoCipher DRM OTP | Public |
| `POST` | `/api/courses/upload-image` | Upload course thumbnail to Cloudinary | Admin |
| `POST` | `/api/courses` | Create new course | Admin |
| `PUT` | `/api/courses/:id` | Update course metadata | Admin |
| `DELETE`| `/api/courses/:id` | Delete course | Admin |
| `POST` | `/api/courses/:courseId/videos` | Add video lesson to course | Admin |
| `DELETE`| `/api/courses/:courseId/videos/:videoId` | Remove video lesson | Admin |

### 🎓 Enrollments (`/api/enrollments`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/enrollments/my-courses` | Get current user's enrolled courses | Authenticated |
| `POST` | `/api/enrollments` | Enroll user into course | Authenticated |
| `GET` | `/api/enrollments/check/:courseId` | Check if user is enrolled in course | Authenticated |

### 💳 Payments (`/api/payments`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/payments/create-checkout-session` | Create Stripe checkout session | Authenticated |
| `POST` | `/api/payments/webhook` | Stripe webhook event listener | Public (Stripe) |

---

## 📦 Deployment

### Backend (Render / Railway / VPS)
A `render.yaml` blueprint is included in the project root:
```bash
# Push repository to GitHub and connect to Render Web Service
# Build Command: npm install && npm run build
# Start Command: npm start
```

### Frontend (Vercel)
1. Import the `frontend` folder to [Vercel](https://vercel.com).
2. Set `NEXT_PUBLIC_API_BASE_URL` to your production backend URL (e.g. `https://your-backend.onrender.com/api`).
3. Deploy!

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
