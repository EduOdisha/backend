import { Exam } from '../models/index.js';

// @desc    Get all exams
// @route   GET /api/exams
export const getExams = async (req, res, next) => {
  try {
    const { type, level, featured } = req.query;
    const q = { isActive: true };
    if (type) q.type = type;
    if (level) q.level = level;
    if (featured === 'true') q.isFeatured = true;
    const exams = await Exam.find(q).select('name slug shortName type level examDates image isFeatured').sort('-isFeatured').lean();
    res.json({ success: true, data: exams });
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
