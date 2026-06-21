import Certificate from '../models/Certificate.js'
import { stripHtml, truncate } from '../middleware/sanitize.js'
import { uploadToCloudinary } from '../config/cloudinary.js'

const CERT_UPDATABLE_FIELDS = ['title', 'issuer', 'image_url', 'issued_at']

// PUBLIC — list certificates
export async function getCertificates(_req, res, next) {
  try {
    const certs = await Certificate.find()
      .sort({ createdAt: 1 })
      .lean()
      .select('title issuer image_url issued_at createdAt')
    res.json(certs)
  } catch (err) {
    next(err)
  }
}

// PUBLIC
export async function getCertificate(req, res, next) {
  try {
    const cert = await Certificate.findById(req.params.id).lean()
    if (!cert) return res.status(404).json({ message: 'Certificate not found' })
    res.json(cert)
  } catch (err) {
    next(err)
  }
}

// ADMIN
export async function createCertificate(req, res, next) {
  try {
    const { title, issuer, image_url, issued_at } = req.body

    if (!title) {
      return res.status(400).json({ message: 'Title is required' })
    }

    let finalImageUrl = typeof image_url === 'string' ? image_url.trim() : ''
    if (req.file) {
      finalImageUrl = (await uploadToCloudinary(req.file.path, 'certificates')) || `/uploads/${req.file.filename}`
    }

    if (!finalImageUrl) {
      return res
        .status(400)
        .json({ message: 'Image is required — upload a file or paste an image URL' })
    }

    let issuedAtParsed = null
    if (issued_at) {
      const d = new Date(issued_at)
      if (Number.isNaN(d.getTime())) {
        return res.status(400).json({ message: 'Invalid issued_at date' })
      }
      issuedAtParsed = d
    }

    const cert = await Certificate.create({
      title: truncate(stripHtml(title), 160),
      issuer: truncate(stripHtml(issuer || ''), 160),
      image_url: finalImageUrl,
      issued_at: issuedAtParsed,
    })

    res.status(201).json(cert)
  } catch (err) {
    next(err)
  }
}

// ADMIN — whitelist-only update
export async function updateCertificate(req, res, next) {
  try {
    const update = {}
    for (const field of CERT_UPDATABLE_FIELDS) {
      if (field in req.body) update[field] = req.body[field]
    }

    if (req.file) {
      update.image_url = (await uploadToCloudinary(req.file.path, 'certificates')) || `/uploads/${req.file.filename}`
    } else if (typeof update.image_url === 'string') {
      update.image_url = update.image_url.trim()
    }

    if (update.title) update.title = truncate(stripHtml(update.title), 160)
    if (typeof update.issuer === 'string') {
      update.issuer = truncate(stripHtml(update.issuer), 160)
    }
    if (update.issued_at !== undefined) {
      if (update.issued_at === null || update.issued_at === '') {
        update.issued_at = null
      } else {
        const d = new Date(update.issued_at)
        if (Number.isNaN(d.getTime())) {
          return res.status(400).json({ message: 'Invalid issued_at date' })
        }
        update.issued_at = d
      }
    }

    const cert = await Certificate.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    })

    if (!cert) return res.status(404).json({ message: 'Certificate not found' })

    res.json(cert)
  } catch (err) {
    next(err)
  }
}

// ADMIN
export async function deleteCertificate(req, res, next) {
  try {
    const cert = await Certificate.findByIdAndDelete(req.params.id)
    if (!cert) return res.status(404).json({ message: 'Certificate not found' })
    res.json({ message: 'Certificate deleted' })
  } catch (err) {
    next(err)
  }
}
