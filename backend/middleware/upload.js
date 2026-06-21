import multer from 'multer'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Resolve uploads dir relative to project root (backend/uploads), never cwd-dependent
const UPLOAD_DIR = path.resolve(__dirname, '..', 'uploads')

// Ensure the upload directory exists on cold starts. Even with Cloudinary,
// we still write to disk first (so we can verify magic bytes), then upload
// to Cloudinary and delete the local copy.
try {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
} catch (err) {
  if (!fs.existsSync(UPLOAD_DIR)) {
    throw err
  }
}

// Safe integer parse with sane fallback — never NaN
function parseMaxUploadMB() {
  const raw = Number(process.env.MAX_UPLOAD_MB)
  if (!Number.isFinite(raw) || raw <= 0) return 5
  return Math.min(raw, 25) // hard cap 25MB regardless of env
}

const MAX_UPLOAD_MB = parseMaxUploadMB()

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

// Known magic bytes for image formats we allow.
const MAGIC_BYTES = [
  { ext: '.jpg', sig: [0xff, 0xd8, 0xff] },
  { ext: '.jpeg', sig: [0xff, 0xd8, 0xff] },
  { ext: '.png', sig: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { ext: '.gif', sig: [0x47, 0x49, 0x46, 0x38] },
  { ext: '.webp', sig: [0x52, 0x49, 0x46, 0x46] },
]

function matchesSignature(buffer, sig) {
  if (buffer.length < sig.length) return false
  for (let i = 0; i < sig.length; i++) {
    if (buffer[i] !== sig[i]) return false
  }
  return true
}

function hasValidImageMagic(buffer) {
  return MAGIC_BYTES.some((m) => matchesSignature(buffer, m.sig))
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const random = crypto.randomBytes(16).toString('hex')
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${random}${ext}`)
  },
})

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase()
  if (!allowedExtensions.includes(ext)) {
    return cb(new Error(`File type ${ext} is not allowed`))
  }
  if (!file.mimetype || !file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed'))
  }
  cb(null, true)
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_UPLOAD_MB * 1024 * 1024,
    files: 1,
  },
})

/**
 * Middleware that runs AFTER multer has written the file to disk.
 * Opens the file, sniffs the first 16 bytes, and rejects anything that
 * doesn't match a known image magic signature.
 */
export function verifyImageMagic(req, res, next) {
  if (!req.file) return next()

  fs.open(req.file.path, 'r', (err, fd) => {
    if (err) {
      return next(err)
    }
    const buffer = Buffer.alloc(16)
    fs.read(fd, buffer, 0, 16, 0, (readErr) => {
      fs.close(fd, () => {})
      if (readErr) return next(readErr)
      if (!hasValidImageMagic(buffer)) {
        fs.unlink(req.file.path, () => {})
        return res
          .status(400)
          .json({ message: 'Invalid image file: content does not match an allowed image format.' })
      }
      next()
    })
  })
}
