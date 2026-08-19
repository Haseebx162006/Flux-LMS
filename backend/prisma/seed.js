const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting Neon PostgreSQL database seeding...");

  // 1. Create Default Admin User
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("admin123", salt);

  const admin = await prisma.user.upsert({
    where: { email: "admin@fluxlms.com" },
    update: {},
    create: {
      name: "Marcus Vance",
      email: "admin@fluxlms.com",
      password: hashedPassword,
      isVerified: true,
      role: "ADMIN"
    }
  });

  console.log("👤 Created Admin User:", admin.email);

  // 2. Create Initial Courses
  const course1 = await prisma.course.create({
    data: {
      title: "Next.js 15 & Framer Motion Masterclass",
      description: "Master full-stack web development with Next.js App Router, Framer Motion animations, Tailwind CSS, and serverless backend architecture.",
      price: 89.99,
      category: "Web Development",
      level: "Intermediate",
      userId: admin.id,
      videos: {
        create: [
          {
            title: "01. Introduction to Next.js 15 App Router",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            description: "Overview of server components, routing conventions, and modern layout structure."
          },
          {
            title: "02. Setting up Framer Motion & Layout Animations",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            description: "Implementing micro-interactions, page transitions, and floating spring physics."
          }
        ]
      }
    }
  });

  const course2 = await prisma.course.create({
    data: {
      title: "AI Engineering & LLM Application Architecture",
      description: "Learn how to build autonomous AI systems, integrate OpenAI/Claude models, build vector database pipelines, and scale AI SaaS apps.",
      price: 119.99,
      category: "AI & Machine Learning",
      level: "Advanced",
      userId: admin.id,
      videos: {
        create: [
          {
            title: "01. Fundamentals of Large Language Model APIs",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyplays.mp4",
            description: "Understanding token limits, temperature, structured JSON output, and prompt engineering."
          }
        ]
      }
    }
  });

  console.log("📚 Created Courses:", course1.title, "|", course2.title);
  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
