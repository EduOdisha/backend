import { Scholarship } from '../models/index.js';

// @desc    Get all scholarships
// @route   GET /api/scholarships
export const getScholarships = async (req, res, next) => {
  try {
    const { category, type, level } = req.query;
    const q = { isActive: true };
    if (category) q.category = category;
    if (type) q.type = type;
    if (level) q.level = level;
    const scholarships = await Scholarship.find(q)
      .select('name slug provider category type amount lastDate image isFeatured')
      .sort('-isFeatured lastDate').lean();
    res.json({ success: true, data: scholarships });
  } catch (e) {
    next(e);
  }
};

// @desc    Get single scholarship
// @route   GET /api/scholarships/:slug
export const getScholarship = async (req, res, next) => {
  try {
    const s = await Scholarship.findOne({ slug: req.params.slug, isActive: true });
    if (!s) return res.status(404).json({ success: false, message: 'Scholarship not found' });
    await Scholarship.findByIdAndUpdate(s._id, { $inc: { views: 1 } });
    res.json({ success: true, data: s });
  } catch (e) {
    next(e);
  }
};

// @desc    Create scholarship
// @route   POST /api/scholarships
export const createScholarship = async (req, res, next) => {
  try {
    const s = await Scholarship.create(req.body);
    res.status(201).json({ success: true, data: s });
  } catch (e) {
    next(e);
  }
};
