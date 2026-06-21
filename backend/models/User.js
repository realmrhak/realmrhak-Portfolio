import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
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
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false, // never returned by default
    },
    role: {
      type: String,
      enum: ['admin', 'editor'],
      default: 'editor', // safer default — admin must be explicitly assigned
    },
  },
  { timestamps: true }
)

// Hash password before save
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (err) {
    next(err)
  }
})

// Hash password on findOneAndUpdate when the password field is being set.
// Without this, findByIdAndUpdate({ password: 'plain' }) would store plaintext.
userSchema.pre('findOneAndUpdate', async function hashPasswordOnUpdate(next) {
  const update = this.getUpdate()
  const candidatePassword =
    update?.password ?? (update?.$set && update.$set.password)

  if (candidatePassword) {
    const salt = await bcrypt.genSalt(12)
    const hashed = await bcrypt.hash(candidatePassword, salt)
    if (update.$set) {
      update.$set.password = hashed
    } else {
      update.password = hashed
    }
    this.setUpdate(update)
  }
  next()
})

// Compare candidate password with stored hash
userSchema.methods.matchPassword = function matchPassword(entered) {
  if (!entered || typeof entered !== 'string') return Promise.resolve(false)
  return bcrypt.compare(entered, this.password)
}

export default mongoose.model('User', userSchema)
