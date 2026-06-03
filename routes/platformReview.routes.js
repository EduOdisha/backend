import express from 'express';
import {
  getPlatformReviews,
  createPlatformReview,
  getMyPlatformReview,
} from '../controller/platformReview.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public — get approved reviews for homepage
router.get('/', getPlatformReviews);

// Auth required
router.post('/', protect, createPlatformReview);
router.get('/my-review', protect, getMyPlatformReview);

export default router;
