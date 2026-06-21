/**
 * Seed script.
 * Creates a default admin (from env) and inserts sample data if the DB is empty.
 * Run with: `npm run seed`
 */
import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'
import Project from '../models/Project.js'
import Certificate from '../models/Certificate.js'
import TechStack from '../models/TechStack.js'

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@haroon.dev').toLowerCase()
  const name = process.env.ADMIN_NAME || 'Haroon'

  // Require ADMIN_PASSWORD in production — never silently fall back to a weak default.
  let password = process.env.ADMIN_PASSWORD
  if (!password) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[seed] FATAL: ADMIN_PASSWORD env var is required in production.')
      process.exit(1)
    }
    // Dev-only fallback (logged without the actual value)
    password = 'ChangeMe123!'
    console.warn('[seed] WARNING: using default ADMIN_PASSWORD. Set ADMIN_PASSWORD env var.')
  }

  const existing = await User.findOne({ email })
  if (existing) {
    console.log(`[seed] Admin already exists: ${email} (skipping)`)
    return
  }

  await User.create({ name, email, password, role: 'admin' })
  // Never log the password — just confirm creation
  console.log(`[seed] Admin created: ${email}`)
}

async function seedProjects() {
  const count = await Project.countDocuments()
  if (count > 0) {
    console.log(`[seed] Projects already seeded (${count}) — skipping`)
    return
  }

  await Project.insertMany([
    {
      title: 'EStudy — Real-Time Multiplayer Quiz Platform',
      description:
        'Full-stack real-time quiz platform with live multiplayer sessions via Socket.io, role-based access control, advanced admin dashboard, and difficulty-based dynamic question engine.',
      image_url:
        'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80&auto=format&fit=crop',
      live_url: '',
      long_description:
        'Built a full-stack real-time quiz platform with live multiplayer sessions via Socket.io — supporting concurrent users with zero latency. Implemented role-based access control, advanced admin dashboard, and difficulty-based dynamic question engine. Created interactive data visualizations for performance analytics, progress monitoring, and historical session tracking. Designed scalable MongoDB schema optimized for quizzes, users, live sessions, and performance history.',
      tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Socket.io', 'JWT', 'Context API'],
      is_featured: true,
    },
    {
      title: 'NexNote — Real-Time Collaborative Notes & Team Workspace',
      description:
        'Collaborative workspace where teams create folders, write notes, manage todos, and track activity — all synced in real-time via Socket.io WebSockets.',
      image_url:
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80&auto=format&fit=crop',
      live_url: '',
      long_description:
        'Built a full-stack collaborative workspace where teams create folders, write notes, manage todos, and track activity — all synced in real-time via Socket.io WebSockets. Implemented real-time note editing, todo sync, and role promotion (Member → Admin) with instant broadcast to all connected clients — no page reload required. Built team invite system with email delivery (Nodemailer/SMTP), JWT auth with refresh token rotation, and role-based protected API routes. Deployed on Vercel + Render with React Query caching, lazy loading, keep-alive pinging, and environment-based rate limiting for production readiness.',
      tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Socket.io', 'JWT', 'Nodemailer'],
      is_featured: true,
    },
    {
      title: 'Nexora AI — AI-Powered Learning Assistant',
      description:
        'AI platform that converts uploaded PDFs into structured summaries, study notes, and auto-generated quizzes using AI API integration.',
      image_url:
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80&auto=format&fit=crop',
      live_url: '',
      long_description:
        'Built an AI platform that converts uploaded PDFs into structured summaries, study notes, and auto-generated quizzes using AI API integration. Integrated AI APIs for intelligent content generation with context-aware processing and structured output formatting. Built a quiz evaluation engine with automated answer checking, score calculation, and detailed performance tracking analytics. Designed MongoDB schema for storing user uploads, generated content, quiz history, and performance metrics efficiently.',
      tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'AI APIs', 'PDF Processing'],
      is_featured: true,
    },
    {
      title: 'Nexra — Full-Stack E-Commerce Application',
      description:
        'Complete e-commerce platform with product listings, cart management, order placement, real-time order tracking, and a full admin dashboard.',
      image_url:
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80&auto=format&fit=crop',
      live_url: '',
      long_description:
        'Developed a complete e-commerce platform with product listings, cart management, order placement, and real-time order tracking. Implemented JWT authentication, Redux/Context API for global state management, and RESTful APIs for all business operations. Built an admin dashboard for managing products, users, inventory levels, and complete order workflows end-to-end. Designed a normalized MongoDB schema with optimized queries for product search, filtering, and order history retrieval.',
      tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Redux', 'Context API'],
      is_featured: false,
    },
    {
      title: 'EduCore ERP — University Management Portal',
      description:
        'Multi-portal ERP system with three role-based portals (Super Admin, Teacher, Student) — each with dedicated dashboards and granular access controls.',
      image_url:
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80&auto=format&fit=crop',
      live_url: '',
      long_description:
        'Built a multi-portal ERP system with three role-based portals (Super Admin, Teacher, Student) — each with dedicated dashboards and granular access controls. Implemented timetable-validated attendance, bulk CSV student import, automatic semester promotion with subject assignment, and fee/challan management. Developed broadcast notification system and auto-evaluation quiz engine with performance tracking and detailed analytics. Integrated Tailwind CSS dark mode, JWT auth flow with role-based route protection, and global error handling middleware.',
      tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Socket.io', 'JWT', 'Tailwind CSS'],
      is_featured: false,
    },
  ])

  console.log('[seed] Projects seeded')
}

async function seedCertificates() {
  const count = await Certificate.countDocuments()
  if (count > 0) {
    console.log(`[seed] Certificates already seeded (${count}) — skipping`)
    return
  }

  await Certificate.insertMany([
    {
      title: 'Meta Front-End Developer',
      issuer: 'Coursera (Meta)',
      image_url:
        'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&q=80&auto=format&fit=crop',
      issued_at: new Date('2024-08-01'),
    },
    {
      title: 'JavaScript Algorithms & Data Structures',
      issuer: 'freeCodeCamp',
      image_url:
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80&auto=format&fit=crop',
      issued_at: new Date('2024-03-15'),
    },
    {
      title: 'MongoDB Node.js Developer Path',
      issuer: 'MongoDB University',
      image_url:
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80&auto=format&fit=crop',
      issued_at: new Date('2025-01-20'),
    },
  ])

  console.log('[seed] Certificates seeded')
}

async function seedTechStacks() {
  const count = await TechStack.countDocuments()
  if (count > 0) {
    console.log(`[seed] Tech stacks already seeded (${count}) — skipping`)
    return
  }

  // logo_url is left empty by default — admins can upload a logo per item
  // via the admin panel at /admin/tech. The UI renders a graceful fallback
  // (the first letter of the name) when logo_url is empty.
  const items = [
    // Frontend
    { name: 'React.js', category: 'Frontend' },
    { name: 'JavaScript', category: 'Language' },
    { name: 'Redux', category: 'Frontend' },
    { name: 'Context API', category: 'Frontend' },
    { name: 'HTML5', category: 'Language' },
    { name: 'CSS3', category: 'Language' },
    { name: 'Tailwind CSS', category: 'Styling' },
    { name: 'Bootstrap', category: 'Styling' },
    // Backend
    { name: 'Node.js', category: 'Backend' },
    { name: 'Express.js', category: 'Backend' },
    { name: 'REST APIs', category: 'Backend' },
    { name: 'JWT Auth', category: 'Backend' },
    { name: 'Socket.io', category: 'Backend' },
    { name: 'WebSockets', category: 'Backend' },
    { name: 'Nodemailer', category: 'Backend' },
    // Database
    { name: 'MongoDB', category: 'Database' },
    { name: 'Mongoose', category: 'Database' },
    { name: 'Schema Design', category: 'Database' },
    // AI & Tools
    { name: 'AI API Integration', category: 'AI & Tools' },
    { name: 'PDF Processing', category: 'AI & Tools' },
    { name: 'Git', category: 'Tools' },
    { name: 'GitHub', category: 'Tools' },
    { name: 'Postman', category: 'Tools' },
    { name: 'VS Code', category: 'Tools' },
    { name: 'Agile/Scrum', category: 'Tools' },
  ]

  await TechStack.insertMany(items.map((i) => ({ ...i, logo_url: '' })))

  console.log('[seed] Tech stacks seeded')
}

async function run() {
  await connectDB()

  let failed = false
  try {
    await seedAdmin()
    await seedProjects()
    await seedCertificates()
    await seedTechStacks()
    console.log('[seed] Done.')
  } catch (err) {
    console.error('[seed] Error:', err)
    failed = true
  } finally {
    await mongoose.connection.close()
    process.exit(failed ? 1 : 0)
  }
}

run()
