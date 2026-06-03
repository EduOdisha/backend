import mongoose from 'mongoose';

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

export default mongoose.model('Lead', leadSchema);
