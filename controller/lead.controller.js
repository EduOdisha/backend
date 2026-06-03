import { Lead } from '../models/index.js';
import College from '../models/College.js';

// @desc    Create lead
// @route   POST /api/leads
export const createLead = async (req, res, next) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json({ success: true, message: 'Thank you! Our counselor will contact you shortly.', data: lead });
  } catch (e) {
    next(e);
  }
};

// @desc    Get all leads
// @route   GET /api/leads
export const getLeads = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const q = {};
    if (status) q.status = status;

    if (search) {
      // Find matching colleges
      const matchingColleges = await College.find({
        name: { $regex: search, $options: 'i' }
      }).select('_id');
      const collegeIds = matchingColleges.map(c => c._id);

      q.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { college: { $in: collegeIds } }
      ];
    }

    const total = await Lead.countDocuments(q);
    const leads = await Lead.find(q)
      .populate('assignedTo', 'name')
      .populate('college', 'name')
      .sort('-createdAt')
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    res.json({ success: true, total, data: leads, leads });
  } catch (e) {
    next(e);
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
export const updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: lead });
  } catch (e) {
    next(e);
  }
};
