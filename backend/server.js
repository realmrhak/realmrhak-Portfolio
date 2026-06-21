import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'

import { connectDB } from './config/db.js'
import { apiLimiter } from './middleware/rateLimiter.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

import authRoutes from './routes/auth.js'
import projectRoutes from './routes/projects.js'
import certificateRoutes from './routes/certificates.js'
import techRoutes from './routes/tech.js'
import commentRoutes from './routes/comments.js'
import messageRoutes from './routes/messages.js'
import dashboardRoutes from './routes/dashboard.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ============ PROCESS-LEVEL HANDLERS (register FIRST) ============
// Register before anything else so a rejection during startup is caught.
process.on('unhandledRejection', (err) => {
  console.error('[server] Unhandled rejection:', err)
})
process.on('uncaughtException', (err) => {
  console.error('[server] Uncaught exception:', err)
  process.exit(1)
})

// ============ VALIDATE REQUIRED ENV ============
if (!process.env.JWT_SECRET) {
  console.error('\n[server] FATAL: JWT_SECRET environment variable is not set.')
  console.error('[server] Generate one with: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"')
  process.exit(1)
}

const app = express()

// ============ TRUST PROXY ============
// Render (and most PaaS) sit behind a proxy — needed for correct req.ip & rate limiting
app.set('trust proxy', 1)

// ============ SECURITY MIDDLEWARE ============
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow frontend to load /uploads images
    contentSecurityPolicy: false, // disabled for API-only server
  })
)

// CORS — allow configured origins
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

app.use(
  cors({
    origin(origin, cb) {
      // allow same-origin / curl / postman (no Origin header) — server-to-server calls
      if (!origin) return cb(null, true)
      if (allowedOrigins.length === 0) {
        // No allowlist configured → allow any browser origin (dev convenience).
        // In production, ALWAYS set ALLOWED_ORIGINS to your Vercel frontend URL.
        if (process.env.NODE_ENV === 'production') {
          return cb(new Error(`CORS blocked for origin: ${origin} (ALLOWED_ORIGINS not configured)`))
        }
        return cb(null, true)
      }
      if (allowedOrigins.includes(origin)) return cb(null, true)
      return cb(new Error(`CORS blocked for origin: ${origin}`))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-browser-id'],
  })
)

// Body parsers
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// Gzip/Brotli compression for all responses
app.use(compression())

// HTTP request logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// ============ STATIC — serve uploaded images ============
const uploadsDir = path.resolve(__dirname, 'uploads')
app.use(
  '/uploads',
  express.static(uploadsDir, {
    maxAge: '7d',
    immutable: true,
    fallthrough: true,
  })
)

// ============ GLOBAL RATE LIMIT ============
app.use('/api', apiLimiter)

// ============ HEALTH CHECK ============
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  })
})

// ============ API ROUTES ============
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/certificates', certificateRoutes)
app.use('/api/tech', techRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/dashboard', dashboardRoutes)

// ============ ROOT ============
app.get('/', (_req, res) => {
  res.json({
    name: 'Portfolio API',
    version: '1.0.0',
    docs: '/api',
    health: '/health',
  })
})

// ============ 404 + ERROR HANDLERS ============
app.use(notFound)
app.use(errorHandler)

// ============ START ============
const PORT = process.env.PORT || 5000

try {
  await connectDB()
  app.listen(PORT, () => {
    console.log(
      `[server] Listening on port ${PORT} (${process.env.NODE_ENV || 'development'})`
    )
  })
} catch (err) {
  console.error('[server] Failed to start:', err)
  process.exit(1)
}
