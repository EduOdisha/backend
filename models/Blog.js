import mongoose from 'mongoose';
import slugify from 'slugify';

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

export default mongoose.model('Blog', blogSchema);
