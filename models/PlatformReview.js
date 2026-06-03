import mongoose from 'mongoose';

// ─── PLATFORM REVIEW MODEL ────────────────────────────────────────────────────
// Reviews about EduOdisha platform, counselling services, and features —
// NOT about specific colleges.

const platformReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Overall rating (1–5)
  rating: { type: Number, required: true, min: 1, max: 5 },

  // Sub-ratings for specific aspects
  subRatings: {
    counselling: { type: Number, min: 1, max: 5 },   // Counsellor quality
    information: { type: Number, min: 1, max: 5 },   // Accuracy & helpfulness of info
    easeOfUse: { type: Number, min: 1, max: 5 },     // Platform usability
  },

  // What they used the platform for (helps personalize display)
  usedFor: {
    type: String,
    enum: ['College Search', 'Counselling', 'Scholarship', 'Exam Info', 'Course Selection', 'Other'],
    default: 'College Search',
  },

  // How they describe themselves
  role: { type: String, maxlength: 100, default: 'Student' }, // e.g. "B.Tech Aspirant", "Parent"
  location: { type: String, maxlength: 100 }, // e.g. "Cuttack, Odisha"

  // The review itself
  title: { type: String, required: true, maxlength: 200 },
  review: { type: String, required: true, maxlength: 2000 },

  // Moderation
  isApproved: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false }, // Pin on homepage

  likes: { type: Number, default: 0 },
}, { timestamps: true });

// One review per user
platformReviewSchema.index({ user: 1 }, { unique: true });

export default mongoose.model('PlatformReview', platformReviewSchema);
