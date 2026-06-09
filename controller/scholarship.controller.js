import { Scholarship } from '../models/index.js';

// @desc    Get all scholarships
// @route   GET /api/scholarships
export const getScholarships = async (req, res, next) => {
  try {
    const { category, type, level, course, search, admin } = req.query;
    const q = {};
    if (admin !== 'true') {
      q.isActive = true;
    }
    if (search) q.name = { $regex: search, $options: 'i' };
    if (category) q.category = { $in: category.split(',') };
    if (type) q.type = { $in: type.split(',') };

    // Handle levels and course subcategories
    const orConditions = [];
    if (level) {
      orConditions.push({ level: { $in: level.split(',') } });
    }
    if (course) {
      const courseList = course.split(',');
      orConditions.push({ 'eligibility.course': { $in: courseList } });

      // Automatically map courses to their parent levels for better matches
      const parents = [];
      const ugCourses = ['B.Tech', 'BCA', 'BBA', 'B.Sc'];
      const pgCourses = ['MBA', 'MCA', 'M.Tech'];
      
      if (courseList.some(c => ugCourses.includes(c))) {
        parents.push('Undergraduate (UG)');
      }
      if (courseList.some(c => pgCourses.includes(c))) {
        parents.push('Postgraduate (PG)');
      }
      if (parents.length > 0) {
        parents.push('Any');
        orConditions.push({ level: { $in: parents } });
      }
    }

    if (orConditions.length > 0) {
      q.$or = orConditions;
    }

    const scholarships = await Scholarship.find(q)
      .select('name slug provider category type amount lastDate image isFeatured isActive')
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
    const s = await Scholarship.findOne({ slug: req.params.slug });
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

// @desc    Update scholarship
// @route   PUT /api/scholarships/:id
export const updateScholarship = async (req, res, next) => {
  try {
    const s = await Scholarship.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!s) return res.status(404).json({ success: false, message: 'Scholarship not found' });
    res.json({ success: true, data: s });
  } catch (e) {
    next(e);
  }
};

// @desc    Delete scholarship
// @route   DELETE /api/scholarships/:id
export const deleteScholarship = async (req, res, next) => {
  try {
    const s = await Scholarship.findByIdAndDelete(req.params.id);
    if (!s) return res.status(404).json({ success: false, message: 'Scholarship not found' });
    res.json({ success: true, message: 'Scholarship deleted successfully' });
  } catch (e) {
    next(e);
  }
};
