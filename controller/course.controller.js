import { Course } from '../models/index.js';

// @desc    Get all courses
// @route   GET /api/courses
export const getCourses = async (req, res, next) => {
  try {
    const { level, stream, search, featured, limit = 100, page = 1 } = req.query;
    const query = { isActive: true };

    if (level)    query.level  = level;
    if (stream)   query.stream = stream;
    if (featured === 'true') query.isFeatured = true;
    if (search)   query.$or = [
      { name:        { $regex: search, $options: 'i' } },
      { shortName:   { $regex: search, $options: 'i' } },
      { stream:      { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];

    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const total = await Course.countDocuments(query);

    const courses = await Course.find(query)
      .select('name shortName slug level stream duration fees careerScope image isFeatured isActive entranceExams jobRoles averageSalary views description')
      .sort('-isFeatured -views')
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    res.json({ success: true, total, data: courses });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by slug
// @route   GET /api/courses/:slug
export const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug, isActive: true })
      .populate('topColleges', 'name slug logo location rating fees');

    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    await Course.findByIdAndUpdate(course._id, { $inc: { views: 1 } });
    res.json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

// @desc    Create course (admin)
// @route   POST /api/courses
export const createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course (admin)
// @route   PUT /api/courses/:id
export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course (admin)
// @route   DELETE /api/courses/:id
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    next(error);
  }
};
