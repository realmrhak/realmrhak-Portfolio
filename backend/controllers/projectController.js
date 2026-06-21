import Project from '../models/Project.js'
import { stripHtml, truncate } from '../middleware/sanitize.js'
import { uploadToCloudinary } from '../config/cloudinary.js'

// Helper: resolve the final image URL after a multer upload.
// If Cloudinary is configured, uploads the file and returns the Cloudinary URL.
// Otherwise falls back to the local /uploads/<filename> path.
async function resolveImageUrl(req, fallbackUrl) {
  if (!req.file) {
    return typeof fallbackUrl === 'string' ? fallbackUrl.trim() : ''
  }
  const cloudUrl = await uploadToCloudinary(req.file.path, 'projects')
  return cloudUrl || `/uploads/${req.file.filename}`
}

// Whitelisted fields for update — protects against mass-assignment of _id, __v, createdAt, etc.
const PROJECT_UPDATABLE_FIELDS = [
  'title',
  'description',
  'image_url',
  'live_url',
  'long_description',
  'tags',
  'is_featured',
]

// PUBLIC — list all projects (oldest first to match original portfolio ordering)
export async function getProjects(_req, res, next) {
  try {
    const projects = await Project.find()
      .sort({ is_featured: -1, createdAt: 1 })
      .lean()
      .select('title description image_url live_url tags is_featured createdAt')
    res.json(projects)
  } catch (err) {
    next(err)
  }
}

// PUBLIC — single project by id
export async function getProject(req, res, next) {
  try {
    const project = await Project.findById(req.params.id).lean()
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.json(project)
  } catch (err) {
    next(err)
  }
}

// ADMIN — create
export async function createProject(req, res, next) {
  try {
    const { title, description, image_url, live_url, long_description, tags, is_featured } = req.body

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' })
    }

    let finalImageUrl = await resolveImageUrl(req, image_url)

    const project = await Project.create({
      title: truncate(stripHtml(title), 120),
      description: truncate(stripHtml(description), 1000),
      image_url: finalImageUrl,
      live_url: typeof live_url === 'string' ? live_url.trim() : '',
      long_description: typeof long_description === 'string' ? truncate(long_description, 8000) : '',
      tags: Array.isArray(tags) ? tags.map((t) => truncate(stripHtml(String(t)), 40)) : [],
      is_featured: Boolean(is_featured),
    })

    res.status(201).json(project)
  } catch (err) {
    next(err)
  }
}

// ADMIN — update (whitelist-only)
export async function updateProject(req, res, next) {
  try {
    const update = {}

    for (const field of PROJECT_UPDATABLE_FIELDS) {
      if (field in req.body) update[field] = req.body[field]
    }

    if (req.file) {
      update.image_url = await uploadToCloudinary(req.file.path, 'projects') || `/uploads/${req.file.filename}`
    } else if (typeof update.image_url === 'string') {
      update.image_url = update.image_url.trim()
    }

    if (update.title) update.title = truncate(stripHtml(update.title), 120)
    if (update.description) update.description = truncate(stripHtml(update.description), 1000)
    if (typeof update.long_description === 'string') {
      update.long_description = truncate(update.long_description, 8000)
    }
    if (Array.isArray(update.tags)) {
      update.tags = update.tags.map((t) => truncate(stripHtml(String(t)), 40))
    }
    if ('is_featured' in update) {
      update.is_featured = Boolean(update.is_featured)
    }

    const project = await Project.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    })

    if (!project) return res.status(404).json({ message: 'Project not found' })

    res.json(project)
  } catch (err) {
    next(err)
  }
}

// ADMIN — delete
export async function deleteProject(req, res, next) {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.json({ message: 'Project deleted' })
  } catch (err) {
    next(err)
  }
}
