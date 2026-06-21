import Project from '../models/Project.js'
import Certificate from '../models/Certificate.js'
import Comment from '../models/Comment.js'
import Message from '../models/Message.js'
import TechStack from '../models/TechStack.js'

// ADMIN — dashboard aggregate stats
export async function getStats(_req, res, next) {
  try {
    const [projects, certificates, comments, messages, techStacks, unreadMessages] =
      await Promise.all([
        Project.countDocuments(),
        Certificate.countDocuments(),
        Comment.countDocuments(),
        Message.countDocuments(),
        TechStack.countDocuments(),
        Message.countDocuments({ is_read: false }),
      ])

    res.json({
      projects,
      certificates,
      comments,
      messages,
      techStacks,
      unreadMessages,
    })
  } catch (err) {
    next(err)
  }
}
