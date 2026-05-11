import mongoose from 'mongoose'
import bcrypt   from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
    },
    password: {
      type:      String,
      required:  [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select:    false,
    },
    timezone: {
      type:    String,
      default: 'UTC',
    },
    colorIndex: {
      type:    Number,
      default: 0,
    },
    isDemo: {
  type:    Boolean,
  default: false,
}
  },
  { timestamps: true }
)

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password)
}

export default mongoose.model('User', userSchema)