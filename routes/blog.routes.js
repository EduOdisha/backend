import express from 'express';
import { getBlogs, getBlog, createBlog, updateBlog } from '../controller/blog.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(getBlogs)
  .post(protect, authorize('admin', 'counselor'), createBlog);

router.route('/:slug')
  .get(getBlog);

router.route('/:id')
  .put(protect, authorize('admin', 'counselor'), updateBlog);

export default router;
