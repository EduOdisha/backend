import express from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controller/course.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public
router.get('/',      getCourses);
router.get('/:slug', getCourse);

// Admin protected
router.post('/',    protect, authorize('admin'), createCourse);
router.put('/:id',  protect, authorize('admin'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);

export default router;