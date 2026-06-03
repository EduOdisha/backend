import { Review } from '../models/index.js';
import College from '../models/College.js';
import { updateCollegeRating } from './college.controller.js';

// @desc    Get college reviews (public — approved only)
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

// @desc    Approve review (admin)
// @route   PUT /api/reviews/:id/approve
export const approveReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    // Recalculate college rating
    if (review.college) await updateCollegeRating(review.college);
    res.json({ success: true, data: review });
  } catch (e) {
    next(e);
  }
};

// @desc    Get all reviews for admin (with optional status filter)
// @route   GET /api/admin/reviews
export const getAdminReviews = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status === 'pending') query.isApproved = false;
    else if (status === 'approved') query.isApproved = true;

    const reviews = await Review.find(query)
      .populate('user', 'name email')
      .populate('college', 'name slug')
      .sort('-createdAt')
      .lean();

    res.json({ success: true, data: reviews });
  } catch (e) {
    next(e);
  }
};

// @desc    Delete review (admin)
// @route   DELETE /api/admin/reviews/:id
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    // Recalculate college rating after deletion
    if (review.college) await updateCollegeRating(review.college);
    res.json({ success: true, message: 'Review deleted' });
  } catch (e) {
    next(e);
  }
};
