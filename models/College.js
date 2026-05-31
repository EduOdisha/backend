import mongoose from 'mongoose';
import slugify from 'slugify';

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'College name is required'],
    unique: true,
    trim: true,
    maxlength: [200, 'College name too long'],
  },
  slug: { type: String, unique: true },
  shortName: String,
  type: {
    type: String,
    enum: ['Government', 'Private', 'Deemed', 'Autonomous', 'Central'],
    required: true,
  },
  category: {
    type: String,
    enum: ['Engineering', 'Medical', 'Management', 'Arts & Science', 'Law', 'Pharmacy', 'Nursing', 'Polytechnic', 'Other'],
    required: true,
  },
  logo: {
    public_id: String,
    url: { type: String, default: '' },
  },
  banner: {
    public_id: String,
    url: { type: String, default: '' },
  },
  gallery: [{
    public_id: String,
    url: String,
  }],
  location: {
    address: String,
    city: {
      type: String,
      required: true,
      enum: ['Bhubaneswar', 'Cuttack', 'Berhampur', 'Rourkela', 'Sambalpur', 'Puri', 'Balasore', 'Koraput', 'Jharsuguda', 'Baripada', 'Other'],
    },
    district: String,
    state: { type: String, default: 'Odisha' },
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  established: Number,
  affiliation: String,
  naacGrade: {
    type: String,
    enum: ['A++', 'A+', 'A', 'B++', 'B+', 'B', 'C', 'Not Accredited', ''],
  },
  nirfRanking: Number,
  approvals: [{ type: String }], // UGC, AICTE, MCI etc.

  about: { type: String, maxlength: 5000 },
  highlights: [{ type: String }],

  courses: [{
    name: String,
    duration: String,
    fees: { min: Number, max: Number },
    seats: Number,
    eligibility: String,
  }],

  fees: {
    min: Number,
    max: Number,
    description: String,
  },

  admissions: {
    process: String,
    entranceExams: [{ type: String }],
    applicationLink: String,
    lastDate: Date,
  },

  placements: {
    averagePackage: Number,
    highestPackage: Number,
    placementPercentage: Number,
    topRecruiters: [{ type: String }],
    description: String,
  },

  facilities: {
    hostel: { type: Boolean, default: false },
    hostelFees: { boys: Number, girls: Number },
    library: { type: Boolean, default: false },
    sports: { type: Boolean, default: false },
    canteen: { type: Boolean, default: false },
    wifi: { type: Boolean, default: false },
    lab: { type: Boolean, default: false },
    transport: { type: Boolean, default: false },
    medicalFacility: { type: Boolean, default: false },
    gym: { type: Boolean, default: false },
  },

  contact: {
    phone: [{ type: String }],
    email: String,
    website: String,
    admissionHelpline: String,
  },

  brochure: {
    public_id: String,
    url: String,
  },

  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String,
    linkedin: String,
  },

  faqs: [{
    question: String,
    answer: String,
  }],

  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
    breakdown: {
      academics: { type: Number, default: 0 },
      infrastructure: { type: Number, default: 0 },
      placements: { type: Number, default: 0 },
      faculty: { type: Number, default: 0 },
      value: { type: Number, default: 0 },
    },
  },

  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },

  meta: {
    title: String,
    description: String,
    keywords: [{ type: String }],
  },

  views: { type: Number, default: 0 },
  inquiries: { type: Number, default: 0 },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

collegeSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

collegeSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'college',
  justOne: false,
});

collegeSchema.index({ name: 'text', 'location.city': 1, type: 1, category: 1 });
collegeSchema.index({ isFeatured: 1, isActive: 1 });

export default mongoose.model('College', collegeSchema);