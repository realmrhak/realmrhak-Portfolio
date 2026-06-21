import crypto from 'crypto'
import Comment from '../models/Comment.js'
import { stripHtml, truncate } from '../middleware/sanitize.js'
import { uploadToCloudinary } from '../config/cloudinary.js'

// PUBLIC — list comments (pinned first, then newest). Projection limits payload.
export async function getComments(_req, res, next) {
  try {
    const comments = await Comment.find()
      .sort({ is_pinned: -1, createdAt: -1 })
      .lean()
      .select('name comment image_url likes is_pinned createdAt')
    res.json(comments)
  } catch (err) {
    next(err)
  }
}

// PUBLIC — create comment (optionally with uploaded image)
export async function createComment(req, res, next) {
  try {
    const { name, comment } = req.body

    if (!name || !comment) {
      return res.status(400).json({ message: 'Name and comment are required' })
    }

    let image_url = null
    if (req.file) {
      image_url = (await uploadToCloudinary(req.file.path, 'comments')) || `/uploads/${req.file.filename}`
    }

    const created = await Comment.create({
      name: truncate(stripHtml(name), 60),
      comment: truncate(stripHtml(comment), 1000),
      image_url,
      likes: 0,
      is_pinned: false,
    })

    // Don't echo likedBy back to client
    const { likedBy, ...safe } = created.toObject()
    res.status(201).json(safe)
  } catch (err) {
    next(err)
  }
}

// PUBLIC — like a comment (one like per browser fingerprint, stored hashed).
// Atomic: findOneAndUpdate with $addToSet + $inc so two concurrent likes
// can't both succeed and inflate the counter.
export async function likeComment(req, res, next) {
  try {
    const { id } = req.params

    // Browser fingerprint — opaque, HMAC'd with a server secret so attackers
    // can't precompute fingerprints to inflate likes. Falls back to IP.
    const raw = req.headers['x-browser-id'] || req.ip
    if (!raw) {
      return res.status(400).json({ message: 'Unable to identify client for like' })
    }
    const serverSecret = process.env.JWT_SECRET || 'like-fingerprint-fallback'
    const fingerprint = crypto
      .createHmac('sha256', serverSecret)
      .update(String(raw))
      .digest('hex')

    // Atomic conditional update: only update if the fingerprint is NOT already in likedBy.
    // $addToSet is idempotent; $inc only matters when the filter actually matched.
    const updated = await Comment.findOneAndUpdate(
      { _id: id, likedBy: { $ne: fingerprint } },
      {
        $addToSet: { likedBy: fingerprint },
        $inc: { likes: 1 },
      },
      { new: true }
    ).select('likes likedBy')

    if (!updated) {
      // Either the comment doesn't exist OR the user already liked it.
      const existing = await Comment.findById(id).select('likes likedBy').lean()
      if (!existing) return res.status(404).json({ message: 'Comment not found' })
      return res.status(200).json({ likes: existing.likes, alreadyLiked: true })
    }

    res.json({ likes: updated.likes, alreadyLiked: false })
  } catch (err) {
    next(err)
  }
}

// ADMIN — toggle pinned
export async function togglePinComment(req, res, next) {
  try {
    const comment = await Comment.findById(req.params.id)
    if (!comment) return res.status(404).json({ message: 'Comment not found' })

    comment.is_pinned = !comment.is_pinned
    await comment.save()

    const { likedBy, ...safe } = comment.toObject()
    res.json(safe)
  } catch (err) {
    next(err)
  }
}

// ADMIN — delete
export async function deleteComment(req, res, next) {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id)
    if (!comment) return res.status(404).json({ message: 'Comment not found' })
    res.json({ message: 'Comment deleted' })
  } catch (err) {
    next(err)
  }
}
