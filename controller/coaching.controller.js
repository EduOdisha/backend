import { Coaching } from '../models/index.js';

// @desc    Get all coaching centers
// @route   GET /api/coaching
export const getAllCoaching = async (req, res, next) => {
  try {
    const { city, category, featured } = req.query;
    const q = { isActive: true };
    if (city) q['location.city'] = city;
    if (category) q.categories = category;
    if (featured === 'true') q.isFeatured = true;
    const coaching = await Coaching.find(q)
      .select('name slug categories location fees rating logo isFeatured isVerified')
      .sort('-isFeatured -rating.average').lean();
    res.json({ success: true, data: coaching });
  } catch (e) {
    next(e);
  }
};

// @desc    Get single coaching center
// @route   GET /api/coaching/:slug
export const getCoaching = async (req, res, next) => {
  try {
    const c = await Coaching.findOne({ slug: req.params.slug, isActive: true });
    if (!c) return res.status(404).json({ success: false, message: 'Coaching center not found' });
    await Coaching.findByIdAndUpdate(c._id, { $inc: { views: 1 } });
    res.json({ success: true, data: c });
  } catch (e) {
    next(e);
  }
};

// @desc    Create coaching center
// @route   POST /api/coaching
export const createCoaching = async (req, res, next) => {
  try {
    const c = await Coaching.create(req.body);
    res.status(201).json({ success: true, data: c });
  } catch (e) {
    next(e);
  }
};
