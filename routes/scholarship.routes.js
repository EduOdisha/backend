import express from 'express';
import { getScholarships, getScholarship, createScholarship } from '../controller/scholarship.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(getScholarships)
  .post(protect, authorize('admin'), createScholarship);

router.route('/:slug')
  .get(getScholarship);

export default router;
