import mongoose from 'mongoose'

const memberSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
    },
    role: {
      type:     String,
      required: [true, 'Role is required'],
      trim:     true,
    },
    timezone: {
      type:     String,
      required: [true, 'Timezone is required'],
    },
    workStart: {
      type:    String,
      default: '09:00',
    },
    workEnd: {
      type:    String,
      default: '17:00',
    },
    colorIndex: {
      type:    Number,
      default: 0,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Member', memberSchema)