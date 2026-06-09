import mongoose from 'mongoose';
import slugify from 'slugify';

const scholarshipSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  provider: { type: String, required: true },
  type: {
    type: String,
    enum: ['Government', 'Private', 'NGO', 'University'],
    required: true,
  },
  category: {
    type: String,
    enum: ['Merit', 'SC/ST', 'OBC', 'Girls', 'Post Matric', 'Pre Matric', 'Other'],
    required: true,
  },
  level: [{ type: String, enum: ['12th', 'Undergraduate (UG)', 'Postgraduate (PG)', 'Diploma', 'Any'] }],
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

export default mongoose.model('Scholarship', scholarshipSchema);
