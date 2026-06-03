import mongoose from 'mongoose';
import slugify from 'slugify';

const coachingSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  categories: [{
    type: String,
    enum: ['JEE', 'NEET', 'OJEE', 'SSC', 'Banking', 'UPSC', 'CUET', 'Board Exams', 'Skill Development', 'Other'],
  }],
  description: String,
  location: {
    address: String,
    city: String,
    district: String,
    pincode: String,
    coordinates: { lat: Number, lng: Number },
  },
  contact: { phone: [String], email: String, website: String },
  fees: { min: Number, max: Number, description: String },
  batchSize: Number,
  faculty: [{ name: String, qualification: String, experience: String, photo: String }],
  facilities: {
    onlineBatches: Boolean,
    offlineBatches: Boolean,
    studyMaterial: Boolean,
    mockTests: Boolean,
    doubtSessions: Boolean,
    hostel: Boolean,
  },
  timings: String,
  demoClasses: Boolean,
  demoLink: String,
  results: [{ year: Number, toppers: String, qualified: Number }],
  gallery: [{ public_id: String, url: String }],
  logo: { public_id: String, url: String },
  rating: { average: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
  faqs: [{ question: String, answer: String }],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  meta: { title: String, description: String },
  views: { type: Number, default: 0 },
}, { timestamps: true });

coachingSchema.pre('save', function (next) {
  if (this.isModified('name')) this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

export default mongoose.model('Coaching', coachingSchema);
