import { Exam, Course } from '../models/index.js';

// @desc    Get all exams
// @route   GET /api/exams
export const getExams = async (req, res, next) => {
  try {
    const { search, type, level, course, featured, admin, page = 1, limit } = req.query;
    const q = {};
    if (admin !== 'true') {
      q.isActive = true;
    }
    if (search) q.name = { $regex: search, $options: 'i' };
    if (type) q.type = { $in: type.split(',') };

    // Handle levels and course subcategories
    const orConditions = [];
    if (level) {
      orConditions.push({ level: { $in: level.split(',') } });
    }
    if (course) {
      const courseList = course.split(',');
      // Find courses with these shortNames
      const courses = await Course.find({ shortName: { $in: courseList } }).select('entranceExams');
      const examNames = courses.flatMap(c => c.entranceExams || []);
      
      // Match any exam whose name or shortName is in the course entranceExams list
      orConditions.push({
        $or: [
          { name: { $in: examNames } },
          { shortName: { $in: examNames } }
        ]
      });

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

    if (featured === 'true') q.isFeatured = true;

    // Handle pagination limits
    let finalLimit = parseInt(limit);
    if (!finalLimit) {
      finalLimit = admin === 'true' ? 100 : 6;
    }

    const total = await Exam.countDocuments(q);
    const exams = await Exam.find(q)
      .select('name slug shortName type level examDates image isFeatured conductedBy isActive')
      .sort('-isFeatured')
      .skip((parseInt(page) - 1) * finalLimit)
      .limit(finalLimit)
      .lean();

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / finalLimit),
      data: exams
    });
  } catch (e) {
    next(e);
  }
};

// @desc    Get single exam
// @route   GET /api/exams/:slug
export const getExam = async (req, res, next) => {
  try {
    const exam = await Exam.findOne({ slug: req.params.slug, isActive: true });
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    await Exam.findByIdAndUpdate(exam._id, { $inc: { views: 1 } });
    res.json({ success: true, data: exam });
  } catch (e) {
    next(e);
  }
};

// @desc    Create exam
// @route   POST /api/exams
export const createExam = async (req, res, next) => {
  try {
    const exam = await Exam.create(req.body);
    res.status(201).json({ success: true, data: exam });
  } catch (e) {
    next(e);
  }
};

// @desc    Update exam
// @route   PUT /api/exams/:id
export const updateExam = async (req, res, next) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: exam });
  } catch (e) {
    next(e);
  }
};
