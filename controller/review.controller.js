import { Review } from '../models/index.js';

// @desc    Get college reviews
// @route   GET /api/reviews/college/:collegeId
export const getCollegeReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ college: req.params.collegeId, isApproved: true })
      .populate('user', 'name avatar')
      .sort('-createdAt').lean();
    res.json({ success: true, data: reviews });
  } catch (e) {
    next(e);
  }
};

// @desc    Create review
// @route   POST /api/reviews
export const createReview = async (req, res, next) => {
  try {
    const existing = await Review.findOne({ user: req.user._id, college: req.body.college });
    if (existing) return res.status(400).json({ success: false, message: 'You have already reviewed this college' });
    const review = await Review.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, message: 'Review submitted for approval', data: review });
  } catch (e) {
    next(e);
  }
};

// @desc    Approve review
// @route   PUT /api/reviews/:id/approve
export const approveReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json({ success: true, data: review });
  } catch (e) {
    next(e);
  }
};
