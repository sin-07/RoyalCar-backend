import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'owner'],
    default: 'user',
  },
  mobile: String,
  drivingLicense: String,
  emailVerified: {
    type: Boolean,
    default: false,
  },
  image: String,
  otp: String,
  otpExpires: Date,
}, {
  timestamps: true,
});

export default mongoose.model('User', userSchema);