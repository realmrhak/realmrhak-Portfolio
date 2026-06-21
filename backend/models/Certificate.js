import mongoose from 'mongoose'

const certificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 160,
    },
    issuer: {
      type: String,
      default: '',
      trim: true,
      maxlength: 160,
    },
    image_url: {
      type: String,
      required: [true, 'Image is required'],
      trim: true,
    },
    issued_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Certificate', certificateSchema)
