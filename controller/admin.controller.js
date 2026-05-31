import User from '../models/User.js';
import College from '../models/College.js';
import { Exam, Scholarship, Course, Coaching, Blog, Lead } from '../models/index.js';

// @desc    Get analytics for dashboard
// @route   GET /api/admin/analytics
export const getAnalytics = async (req, res, next) => {
  try {
    const [
      totalUsers, totalColleges, totalCourses, totalExams,
      totalScholarships, totalLeads, recentLeads, topColleges
    ] = await Promise.all([
      User.countDocuments(),
      College.countDocuments({ isActive: true }),
      Course.countDocuments({ isActive: true }),
      Exam.countDocuments({ isActive: true }),
      Scholarship.countDocuments({ isActive: true }),
      Lead.countDocuments(),
      Lead.find().sort('-createdAt').limit(5).lean(),
      College.find({ isActive: true }).sort('-views').limit(5).select('name views inquiries').lean(),
    ]);

    res.json({
      success: true,
      data: {
        stats: { totalUsers, totalColleges, totalCourses, totalExams, totalScholarships, totalLeads },
        recentLeads,
        topColleges,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role } = req.query;
    const q = {};
    if (role) q.role = role;
    const total = await User.countDocuments(q);
    const users = await User.find(q)
      .select('-password')
      .sort('-createdAt')
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    res.json({ success: true, total, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle-active
export const toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}` });
  } catch (error) {
    next(error);
  }
};