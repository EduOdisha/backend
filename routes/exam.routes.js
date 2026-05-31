import express from 'express';
import { getExams, getExam, createExam, updateExam } from '../controller/exam.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(getExams)
  .post(protect, authorize('admin'), createExam);

router.route('/:slug')
  .get(getExam);

router.route('/:id')
  .put(protect, authorize('admin'), updateExam);

export default router;
