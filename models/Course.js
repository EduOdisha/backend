import mongoose from 'mongoose';
import slugify from 'slugify';

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, unique: true },
  shortName: String,
  level: { type: String, enum: ['10th', '12th', 'UG', 'PG', 'Diploma', 'Certificate', 'Other'], required: true },
  stream: { type: String, enum: ['Engineering', 'Medical', 'Management', 'Nursing', 'Other'] },
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

export default mongoose.model('Course', courseSchema);
