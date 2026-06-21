import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: 2000,
    },
    is_read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

messageSchema.index({ is_read: 1, createdAt: -1 })

export default mongoose.model('Message', messageSchema)
