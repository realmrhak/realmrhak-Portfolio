/**
 * Centralised error handler. Always invoked last via `next(err)`.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500
  const isProd = process.env.NODE_ENV === 'production'

  // Multer file-size errors land here
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      message: `File too large. Max ${process.env.MAX_UPLOAD_MB || 5}MB allowed.`,
    })
  }

  // Multer file-type filter rejection — match by multer-style code instead of substring
  if (err.code === 'LIMIT_UNEXPECTED_FILE' || err.name === 'MulterError') {
    return res.status(400).json({ message: err.message || 'File upload error' })
  }
  if (err.message && /not allowed|only image files/i.test(err.message)) {
    return res.status(400).json({ message: err.message })
  }

  // Mongoose validation
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({ message: 'Validation failed', errors: messages })
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field'
    return res.status(409).json({ message: `Duplicate value for ${field}` })
  }

  // Mongoose cast / bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` })
  }

  // Always log full error server-side
  console.error('[error]', err)

  // Don't leak internal messages on 5xx in production
  if (status >= 500 && isProd) {
    return res.status(status).json({ message: 'Internal server error' })
  }

  res.status(status).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

/**
 * 404 — no route matched.
 */
export function notFound(req, res, _next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` })
}
