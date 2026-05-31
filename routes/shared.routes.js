import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { getExams, getExam, createExam, updateExam } from '../controller/exam.controller.js';
import { getScholarships, getScholarship, createScholarship } from '../controller/scholarship.controller.js';
import { getAllCoaching, getCoaching, createCoaching } from '../controller/coaching.controller.js';
import { getBlogs, getBlog, createBlog, updateBlog } from '../controller/blog.controller.js';
import { getCollegeReviews, createReview, approveReview } from '../controller/review.controller.js';
import { createLead, getLeads, updateLead } from '../controller/lead.controller.js';

// ─── EXAM ROUTES ──────────────────────────────────────────────────────────────
export const examRouter = express.Router();
examRouter.get('/', getExams);
examRouter.get('/:slug', getExam);
examRouter.post('/', protect, authorize('admin'), createExam);
examRouter.put('/:id', protect, authorize('admin'), updateExam);

// ─── SCHOLARSHIP ROUTES ───────────────────────────────────────────────────────
export const scholarshipRouter = express.Router();
scholarshipRouter.get('/', getScholarships);
scholarshipRouter.get('/:slug', getScholarship);
scholarshipRouter.post('/', protect, authorize('admin'), createScholarship);

// ─── COACHING ROUTES ──────────────────────────────────────────────────────────
export const coachingRouter = express.Router();
coachingRouter.get('/', getAllCoaching);
coachingRouter.get('/:slug', getCoaching);
coachingRouter.post('/', protect, authorize('admin'), createCoaching);

// ─── BLOG ROUTES ──────────────────────────────────────────────────────────────
export const blogRouter = express.Router();
blogRouter.get('/', getBlogs);
blogRouter.get('/:slug', getBlog);
blogRouter.post('/', protect, authorize('admin', 'counselor'), createBlog);
blogRouter.put('/:id', protect, authorize('admin', 'counselor'), updateBlog);

// ─── REVIEW ROUTES ────────────────────────────────────────────────────────────
export const reviewRouter = express.Router();
reviewRouter.get('/college/:collegeId', getCollegeReviews);
reviewRouter.post('/', protect, createReview);
reviewRouter.put('/:id/approve', protect, authorize('admin'), approveReview);

// ─── LEAD ROUTES ──────────────────────────────────────────────────────────────
export const leadRouter = express.Router();
leadRouter.post('/', createLead);
leadRouter.get('/', protect, authorize('admin', 'counselor'), getLeads);
leadRouter.put('/:id', protect, authorize('admin', 'counselor'), updateLead);
