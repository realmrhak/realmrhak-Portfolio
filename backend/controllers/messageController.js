import Message from '../models/Message.js'
import { stripHtml, truncate } from '../middleware/sanitize.js'

const EMAIL_RE = /^\S+@\S+\.\S+$/

// PUBLIC — submit contact message
export async function createMessage(req, res, next) {
  try {
    const { name, email, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' })
    }

    const cleanEmail = String(email).toLowerCase().trim()
    if (!EMAIL_RE.test(cleanEmail)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    const created = await Message.create({
      name: truncate(stripHtml(name), 80),
      email: cleanEmail,
      message: truncate(stripHtml(message), 2000),
    })

    res.status(201).json({ message: 'Message sent successfully', id: created._id })
  } catch (err) {
    next(err)
  }
}

// ADMIN — list messages (unread first)
export async function getMessages(_req, res, next) {
  try {
    const messages = await Message.find()
      .sort({ is_read: 1, createdAt: -1 })
      .lean()
      .select('name email message is_read createdAt')
    res.json(messages)
  } catch (err) {
    next(err)
  }
}

// ADMIN — mark as read
export async function markMessageRead(req, res, next) {
  try {
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { is_read: true },
      { new: true }
    )
    if (!msg) return res.status(404).json({ message: 'Message not found' })
    res.json(msg)
  } catch (err) {
    next(err)
  }
}

// ADMIN — delete
export async function deleteMessage(req, res, next) {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id)
    if (!msg) return res.status(404).json({ message: 'Message not found' })
    res.json({ message: 'Message deleted' })
  } catch (err) {
    next(err)
  }
}
