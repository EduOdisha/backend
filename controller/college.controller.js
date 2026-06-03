import College from '../models/College.js';
import { Review, Course, Exam, Scholarship } from '../models/index.js';


// @desc    Get all colleges with filters
// @route   GET /api/colleges
export const getColleges = async (req, res, next) => {
  try {
    const {
      page = 1, limit = 12, search, city, type, category,
      minFees, maxFees, naacGrade, hostel, sort = '-isFeatured,-rating.average',
      featured, admin = false
    } = req.query;

    const query = admin === 'true' ? {} : { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortName: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } }
      ];
    }
    if (city) query['location.city'] = city;
    if (type) query.type = type;
    if (category) query.category = category;
    if (naacGrade) query.naacGrade = naacGrade;
    if (hostel === 'true') query['facilities.hostel'] = true;
    if (featured === 'true') query.isFeatured = true;

    if (minFees || maxFees) {
      query['fees.min'] = {};
      if (minFees) query['fees.min'].$gte = parseInt(minFees);
      if (maxFees) query['fees.max'] = { $lte: parseInt(maxFees) };
    }

    const total = await College.countDocuments(query);
    const colleges = await College.find(query)
      .sort(sort)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: colleges,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single college
// @route   GET /api/colleges/:slug
export const getCollege = async (req, res, next) => {
  try {
    // For detail page, we want ALL fields. Default .find() without .select() does this.
    const college = await College.findOne({ slug: req.params.slug, isActive: true })
      .populate({
        path: 'reviews',
        match: { isApproved: true },
        select: 'user rating title review pros cons batch course createdAt',
        populate: { path: 'user', select: 'name avatar' },
        options: { limit: 10, sort: { createdAt: -1 } },
      });

    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }

    // Increment views
    await College.findByIdAndUpdate(college._id, { $inc: { views: 1 } });

    res.status(200).json({ success: true, data: college });
  } catch (error) {
    next(error);
  }
};

// @desc    Create college (admin)
// @route   POST /api/colleges
export const createCollege = async (req, res, next) => {
  try {
    const college = await College.create(req.body);
    res.status(201).json({ success: true, message: 'College created successfully', data: college });
  } catch (error) {
    next(error);
  }
};

// @desc    Update college (admin)
// @route   PUT /api/colleges/:id
export const updateCollege = async (req, res, next) => {
  try {
    const college = await College.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!college) return res.status(404).json({ success: false, message: 'College not found' });
    res.status(200).json({ success: true, data: college });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete college (admin)
// @route   DELETE /api/colleges/:id
export const deleteCollege = async (req, res, next) => {
  try {
    // We do a hard delete in admin if requested, or just toggle active
    const college = await College.findByIdAndDelete(req.params.id);
    if (!college) return res.status(404).json({ success: false, message: 'College not found' });
    res.status(200).json({ success: true, message: 'College permanently deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Compare colleges
// @route   POST /api/colleges/compare
export const compareColleges = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || ids.length < 2 || ids.length > 4) {
      return res.status(400).json({ success: false, message: 'Please provide 2-4 college IDs to compare' });
    }

    const colleges = await College.find({ _id: { $in: ids }, isActive: true })
      .select('name slug logo banner location type category naacGrade fees placements facilities rating courses isFeatured isVerified nirfRanking');

    res.status(200).json({ success: true, data: colleges });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured colleges
// @route   GET /api/colleges/featured
export const getFeaturedColleges = async (req, res, next) => {
  try {
    const colleges = await College.find({ isFeatured: true, isActive: true })
      .select('name slug logo banner location rating fees placements type category isFeatured isVerified nirfRanking')
      .limit(10)
      .sort('-rating.average')
      .lean();
    res.status(200).json({ success: true, data: colleges });
  } catch (error) {
    next(error);
  }
};

// @desc    Get colleges by city
// @route   GET /api/colleges/city/:city
export const getCollegesByCity = async (req, res, next) => {
  try {
    const colleges = await College.find({
      'location.city': req.params.city,
      isActive: true,
    }).select('name slug logo banner location rating fees type category isFeatured isVerified nirfRanking placements').limit(8).lean();
    res.status(200).json({ success: true, data: colleges });
  } catch (error) {
    next(error);
  }
};

// @desc    Update college rating after review
export const updateCollegeRating = async (collegeId) => {
  const reviews = await Review.find({ college: collegeId, isApproved: true });
  if (reviews.length === 0) return;

  const avg = reviews.reduce((sum, r) => sum + r.rating.overall, 0) / reviews.length;
  const breakdown = {
    academics: reviews.reduce((s, r) => s + (r.rating.academics || 0), 0) / reviews.length,
    infrastructure: reviews.reduce((s, r) => s + (r.rating.infrastructure || 0), 0) / reviews.length,
    placements: reviews.reduce((s, r) => s + (r.rating.placements || 0), 0) / reviews.length,
    faculty: reviews.reduce((s, r) => s + (r.rating.faculty || 0), 0) / reviews.length,
    value: reviews.reduce((s, r) => s + (r.rating.value || 0), 0) / reviews.length,
  };

  await College.findByIdAndUpdate(collegeId, {
    'rating.average': Math.round(avg * 10) / 10,
    'rating.count': reviews.length,
    'rating.breakdown': breakdown,
  });
};

// @desc    Get public statistics for counts
// @route   GET /api/colleges/public-stats
export const getPublicStats = async (req, res, next) => {
  try {
    const [colleges, courses, exams, scholarships] = await Promise.all([
      College.countDocuments({ isActive: true }),
      Course.countDocuments({ isActive: true }),
      Exam.countDocuments({ isActive: true }),
      Scholarship.countDocuments({ isActive: true }),
    ]);
    res.status(200).json({
      success: true,
      data: {
        colleges,
        courses,
        exams,
        scholarships,
      },
    });
  } catch (error) {
    next(error);
  }
};