import mongoose from 'mongoose'

const techStackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 80,
      unique: true,
    },
    logo_url: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
      maxlength: 60,
    },
  },
  { timestamps: true }
)

export default mongoose.model('TechStack', techStackSchema)
