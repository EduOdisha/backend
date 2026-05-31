import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian phone number'],
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'counselor'],
    default: 'student',
  },
  avatar: {
    public_id: String,
    url: { type: String, default: '' },
  },
  isEmailVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  googleId: String,
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  // Student profile
  profile: {
    class: { type: String, enum: ['10th', '12th', 'Graduate', 'Post-Graduate', 'Other'] },
    stream: { type: String, enum: ['Science', 'Commerce', 'Arts', 'Other'] },
    city: String,
    district: String,
    interestedCourses: [{ type: String }],
    preferredColleges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'College' }],
  },
  savedColleges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'College' }],
  savedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  examReminders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
  recentlyViewed: [{
    college: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
    viewedAt: { type: Date, default: Date.now },
  }],
  notifications: [{
    title: String,
    message: String,
    type: { type: String, enum: ['exam', 'scholarship', 'general', 'counseling'] },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  }],
  // Auth tokens
  emailVerifyToken: String,
  emailVerifyExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  otpCode: String,
  otpExpire: Date,
  lastLogin: Date,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate email verify token
userSchema.methods.getEmailVerifyToken = function () {
  const token = crypto.randomBytes(20).toString('hex');
  this.emailVerifyToken = crypto.createHash('sha256').update(token).digest('hex');
  this.emailVerifyExpire = Date.now() + 24 * 60 * 60 * 1000;
  return token;
};

// Generate OTP
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otpCode = crypto.createHash('sha256').update(otp).digest('hex');
  this.otpExpire = Date.now() + 10 * 60 * 1000;
  return otp;
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  const token = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
  return token;
};

export default mongoose.model('User', userSchema);