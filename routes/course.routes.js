import express from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
} from '../controller/course.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/:slug', getCourse);

// Admin routes
router.post('/', protect, authorize('admin'), createCourse);
router.put('/:id', protect, authorize('admin'), updateCourse);

export default router;