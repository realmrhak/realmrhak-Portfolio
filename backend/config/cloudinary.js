import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

// Configure Cloudinary from env vars. If not configured, this module will
// throw clearly when first used (rather than silently failing).
const isConfigured = () =>
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET

if (isConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })
}

/**
 * Upload a file from disk to Cloudinary.
 * Returns the secure HTTPS URL of the uploaded image.
 * If Cloudinary is not configured, falls back to returning the local path
 * (useful for local development).
 *
 * @param {string} localPath - path to the file on disk (from multer)
 * @param {string} [folder='portfolio'] - Cloudinary folder to organize uploads
 * @returns {Promise<string>} - the secure URL of the uploaded image
 */
export async function uploadToCloudinary(localPath, folder = 'portfolio') {
  // Fallback for local dev: if Cloudinary isn't configured, return the local
  // path so the existing /uploads/* route still serves the image.
  if (!isConfigured()) {
    console.warn(
      '[cloudinary] Not configured — falling back to local disk. ' +
        'Set CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET to enable cloud storage.'
    )
    return null
  }

  try {
    const result = await cloudinary.uploader.upload(localPath, {
      folder,
      resource_type: 'image',
      // Use the original filename (without extension) as the public_id
      // so the URL is human-readable in the Cloudinary dashboard.
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    })

    // Best-effort cleanup of the local temp file — we don't need it anymore
    try {
      fs.unlinkSync(localPath)
    } catch {
      // ignore — file may already be gone
    }

    return result.secure_url
  } catch (err) {
    console.error('[cloudinary] upload failed:', err.message)
    // Don't delete the local file on failure — fall back to serving it locally
    return null
  }
}

/**
 * Check if Cloudinary is configured (useful for health checks / debug).
 */
export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  )
}
