import express from 'express';
import { getCollegeReviews, createReview, approveReview } from '../controller/review.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createReview);

router.route('/college/:collegeId')
  .get(getCollegeReviews);

router.route('/:id/approve')
  .put(protect, authorize('admin'), approveReview);

export default router;
