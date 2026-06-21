import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: 1000,
    },
    image_url: {
      type: String,
      default: '',
      trim: true,
    },
    live_url: {
      type: String,
      default: '',
      trim: true,
    },
    // Optional rich content shown on the project detail page (markdown / plain text)
    long_description: {
      type: String,
      default: '',
      maxlength: 8000,
    },
    tags: {
      type: [String],
      default: [],
    },
    is_featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

// Index the public-listing sort order so the .find().sort() query is index-backed.
projectSchema.index({ is_featured: -1, createdAt: 1 })

export default mongoose.model('Project', projectSchema)
