import mongoose from 'mongoose';
import slugify from 'slugify';

// ─── EXAM MODEL ──────────────────────────────────────────────────────────────
const examSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, unique: true },
  shortName: String,
  type: {
    type: String,
    enum: ['State', 'National', 'University', 'Government Job', 'Banking', 'Other'],
    required: true,
  },
  conductedBy: String,
  level: { type: String, enum: ['10th', '12th', 'UG', 'PG', 'Diploma', 'Any'] },
  description: String,
  overview: String,
  eligibility: {
    age: String,
    qualification: String,
    percentage: String,
    domicile: String,
  },
  syllabus: [{
    subject: String,
    topics: [{ type: String }],
    marks: Number,
  }],
  examDates: {
    notification: Date,
    applicationStart: Date,
    applicationEnd: Date,
    examDate: Date,
    admitCard: Date,
    result: Date,
  },
  applicationFee: { general: Number, sc_st: Number },
  applicationLink: String,
  syllabusLink: String,
  officialWebsite: String,
  cutoffs: [{
    year: Number,
    category: String,
    cutoff: Number,
  }],
  preparationTips: [{ type: String }],
  faqs: [{ question: String, answer: String }],
  image: { public_id: String, url: String },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  meta: { title: String, description: String, keywords: [String] },
  views: { type: Number, default: 0 },
}, { timestamps: true });

examSchema.pre('save', function (next) {
  if (this.isModified('name')) this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

// ─── SCHOLARSHIP MODEL ────────────────────────────────────────────────────────
const scholarshipSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  provider: { type: String, required: true },
  type: {
    type: String,
    enum: ['Government', 'Private', 'NGO', 'University', 'International'],
    required: true,
  },
  category: {
    type: String,
    enum: ['Merit', 'SC/ST', 'OBC', 'Minority', 'Disability', 'Girls', 'Post Matric', 'Pre Matric', 'Other'],
    required: true,
  },
  level: [{ type: String, enum: ['10th', '12th', 'UG', 'PG', 'Diploma', 'PhD', 'Any'] }],
  amount: { value: Number, type: { type: String, enum: ['Full', 'Partial', 'Monthly', 'Annual'] } },
  description: String,
  eligibility: {
    income: String,
    percentage: String,
    category: [{ type: String }],
    state: { type: String, default: 'Odisha' },
    course: [{ type: String }],
  },
  documents: [{ type: String }],
  applicationProcess: String,
  applicationLink: String,
  lastDate: Date,
  faqs: [{ question: String, answer: String }],
  image: { public_id: String, url: String },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  meta: { title: String, description: String },
  views: { type: Number, default: 0 },
}, { timestamps: true });

scholarshipSchema.pre('save', function (next) {
  if (this.isModified('name')) this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

// ─── COURSE MODEL ─────────────────────────────────────────────────────────────
const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, unique: true },
  shortName: String,
  level: { type: String, enum: ['10th', '12th', 'UG', 'PG', 'Diploma', 'Certificate', 'Other'], required: true },
  stream: { type: String, enum: ['Science', 'Commerce', 'Arts', 'Technology', 'Medical', 'Law', 'Design', 'Vocational', 'Other'] },
  duration: String,
  description: String,
  overview: String,
  eligibility: String,
  admissionProcess: String,
  entranceExams: [{ type: String }],
  fees: { min: Number, max: Number },
  careerScope: String,
  jobRoles: [{ type: String }],
  averageSalary: { entry: Number, mid: Number, senior: Number },
  topColleges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'College' }],
  skills: [{ type: String }],
  image: { public_id: String, url: String },
  syllabus: [{ semester: Number, subjects: [String] }],
  faqs: [{ question: String, answer: String }],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  meta: { title: String, description: String, keywords: [String] },
  views: { type: Number, default: 0 },
}, { timestamps: true });

courseSchema.pre('save', function (next) {
  if (this.isModified('name')) this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

// ─── COACHING CENTER MODEL ────────────────────────────────────────────────────
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

// ─── BLOG MODEL ───────────────────────────────────────────────────────────────
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, maxlength: 300 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: {
    type: String,
    enum: ['Career Guidance', 'Exam Updates', 'Odisha Education News', 'Scholarship Updates', 'Placement News', 'College Reviews', 'Study Tips', 'Other'],
    required: true,
  },
  tags: [{ type: String }],
  image: { public_id: String, url: String },
  isPublished: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  meta: { title: String, description: String, keywords: [String] },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  relatedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
}, { timestamps: true });

blogSchema.pre('save', function (next) {
  if (this.isModified('title')) this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});

// ─── REVIEW MODEL ─────────────────────────────────────────────────────────────
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

// ─── LEAD MODEL ───────────────────────────────────────────────────────────────
const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, match: [/^[6-9]\d{9}$/, 'Invalid phone'] },
  email: { type: String, lowercase: true },
  interestedCourse: String,
  preferredCity: String,
  message: String,
  source: {
    type: String,
    default: 'Homepage',
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'In Progress', 'Converted', 'Closed'],
    default: 'New',
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  college: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
  notes: [{ note: String, addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, createdAt: { type: Date, default: Date.now } }],
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

export const Exam = mongoose.model('Exam', examSchema);
export const Scholarship = mongoose.model('Scholarship', scholarshipSchema);
export const Course = mongoose.model('Course', courseSchema);
export const Coaching = mongoose.model('Coaching', coachingSchema);
export const Blog = mongoose.model('Blog', blogSchema);
export const Review = mongoose.model('Review', reviewSchema);
export const Lead = mongoose.model('Lead', leadSchema);