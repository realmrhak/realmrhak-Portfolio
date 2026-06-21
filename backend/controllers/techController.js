import TechStack from '../models/TechStack.js'
import { stripHtml, truncate } from '../middleware/sanitize.js'
import { uploadToCloudinary } from '../config/cloudinary.js'

const TECH_UPDATABLE_FIELDS = ['name', 'logo_url', 'category']

// PUBLIC
export async function getTechStacks(_req, res, next) {
  try {
    const items = await TechStack.find()
      .sort({ category: 1, name: 1 })
      .lean()
      .select('name logo_url category createdAt')
    res.json(items)
  } catch (err) {
    next(err)
  }
}

// ADMIN
export async function createTechStack(req, res, next) {
  try {
    const { name, logo_url, category } = req.body

    if (!name) {
      return res.status(400).json({ message: 'Name is required' })
    }

    let finalLogoUrl = typeof logo_url === 'string' ? logo_url.trim() : ''
    if (req.file) {
      finalLogoUrl = (await uploadToCloudinary(req.file.path, 'tech-logos')) || `/uploads/${req.file.filename}`
    }

    const item = await TechStack.create({
      name: truncate(stripHtml(name), 80),
      logo_url: finalLogoUrl,
      category: truncate(stripHtml(category || 'General'), 60),
    })

    res.status(201).json(item)
  } catch (err) {
    next(err)
  }
}

// ADMIN — whitelist-only update
export async function updateTechStack(req, res, next) {
  try {
    const update = {}
    for (const field of TECH_UPDATABLE_FIELDS) {
      if (field in req.body) update[field] = req.body[field]
    }

    if (req.file) {
      update.logo_url = (await uploadToCloudinary(req.file.path, 'tech-logos')) || `/uploads/${req.file.filename}`
    } else if (typeof update.logo_url === 'string') {
      update.logo_url = update.logo_url.trim()
    }

    if (update.name) update.name = truncate(stripHtml(update.name), 80)
    if (typeof update.category === 'string') {
      update.category = truncate(stripHtml(update.category), 60)
    }

    const item = await TechStack.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    })

    if (!item) return res.status(404).json({ message: 'Tech stack not found' })

    res.json(item)
  } catch (err) {
    next(err)
  }
}

// ADMIN
export async function deleteTechStack(req, res, next) {
  try {
    const item = await TechStack.findByIdAndDelete(req.params.id)
    if (!item) return res.status(404).json({ message: 'Tech stack not found' })
    res.json({ message: 'Tech stack deleted' })
  } catch (err) {
    next(err)
  }
}
