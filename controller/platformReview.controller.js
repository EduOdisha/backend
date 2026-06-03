import PlatformReview from '../models/PlatformReview.js';

// @desc    Get approved platform reviews (public, for homepage)
// @route   GET /api/platform-reviews
export const getPlatformReviews = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const featured = req.query.featured === 'true';

    const query = { isApproved: true };
    if (featured) query.isFeatured = true;

    const reviews = await PlatformReview.find(query)
      .populate('user', 'name')
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    res.json({ success: true, data: reviews });
  } catch (e) {
    next(e);
  }
};

// @desc    Submit a platform review (authenticated users)
// @route   POST /api/platform-reviews
export const createPlatformReview = async (req, res, next) => {
  try {
    // One review per user
    const existing = await PlatformReview.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review. Thank you for your feedback!',
      });
    }

    const { rating, subRatings, usedFor, role, location, title, review } = req.body;

    const newReview = await PlatformReview.create({
      user: req.user._id,
      rating,
      subRatings,
      usedFor,
      role,
      location,
      title,
      review,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been submitted and will appear after moderation.',
      data: newReview,
    });
  } catch (e) {
    next(e);
  }
};

// @desc    Check if user already reviewed (authenticated)
// @route   GET /api/platform-reviews/my-review
export const getMyPlatformReview = async (req, res, next) => {
  try {
    const review = await PlatformReview.findOne({ user: req.user._id }).lean();
    res.json({ success: true, data: review || null });
  } catch (e) {
    next(e);
  }
};

// ─── ADMIN CONTROLLERS ────────────────────────────────────────────────────────

// @desc    Get all platform reviews for admin
// @route   GET /api/admin/platform-reviews
export const getAdminPlatformReviews = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status === 'pending') query.isApproved = false;
    else if (status === 'approved') query.isApproved = true;
    else if (status === 'featured') { query.isApproved = true; query.isFeatured = true; }

    const reviews = await PlatformReview.find(query)
      .populate('user', 'name email')
      .sort('-createdAt')
      .lean();

    res.json({ success: true, data: reviews });
  } catch (e) {
    next(e);
  }
};

// @desc    Approve a platform review
// @route   PUT /api/admin/platform-reviews/:id/approve
export const approvePlatformReview = async (req, res, next) => {
  try {
    const review = await PlatformReview.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, data: review });
  } catch (e) {
    next(e);
  }
};

// @desc    Toggle featured status
// @route   PUT /api/admin/platform-reviews/:id/feature
export const featurePlatformReview = async (req, res, next) => {
  try {
    const review = await PlatformReview.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    review.isFeatured = !review.isFeatured;
    await review.save();
    res.json({ success: true, data: review });
  } catch (e) {
    next(e);
  }
};

// @desc    Delete a platform review
// @route   DELETE /api/admin/platform-reviews/:id
export const deletePlatformReview = async (req, res, next) => {
  try {
    const review = await PlatformReview.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, message: 'Review deleted' });
  } catch (e) {
    next(e);
  }
};
