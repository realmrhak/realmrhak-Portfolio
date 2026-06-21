import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 60,
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      trim: true,
      maxlength: 1000,
    },
    image_url: {
      type: String,
      default: null,
      trim: true,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    is_pinned: {
      type: Boolean,
      default: false,
    },
    // Track per-browser "liked" state via a Set of opaque browser IDs (optional).
    // We don't require accounts to like, so we store a hashed browser fingerprint.
    likedBy: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
)

commentSchema.index({ is_pinned: -1, createdAt: -1 })

export default mongoose.model('Comment', commentSchema)
