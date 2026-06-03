import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  college: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
  coaching: { type: mongoose.Schema.Types.ObjectId, ref: 'Coaching' },
  rating: {
    overall: { type: Number, required: true, min: 1, max: 5 },
    academics: { type: Number, min: 1, max: 5 },
    infrastructure: { type: Number, min: 1, max: 5 },
    placements: { type: Number, min: 1, max: 5 },
    faculty: { type: Number, min: 1, max: 5 },
    value: { type: Number, min: 1, max: 5 },
  },
  title: { type: String, required: true, maxlength: 200 },
  review: { type: String, required: true, maxlength: 2000 },
  pros: [{ type: String }],
  cons: [{ type: String }],
  batch: String,
  course: String,
  isVerified: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
