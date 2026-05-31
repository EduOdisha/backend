import express from 'express';
import { getAllCoaching, getCoaching, createCoaching } from '../controller/coaching.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(getAllCoaching)
  .post(protect, authorize('admin'), createCoaching);

router.route('/:slug')
  .get(getCoaching);

export default router;
