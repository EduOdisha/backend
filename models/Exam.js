import mongoose from 'mongoose';
import slugify from 'slugify';

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

export default mongoose.model('Exam', examSchema);
