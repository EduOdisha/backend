import express from 'express';
import {
  getColleges, getCollege, createCollege, updateCollege,
  deleteCollege, compareColleges, getFeaturedColleges, getCollegesByCity,
  getPublicStats
} from '../controller/college.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getColleges);
router.get('/featured', getFeaturedColleges);
router.post('/compare', compareColleges);
router.get('/city/:city', getCollegesByCity);
router.get('/public-stats', getPublicStats);
router.get('/:slug', getCollege);
router.post('/', protect, authorize('admin'), createCollege);
router.put('/:id', protect, authorize('admin'), updateCollege);
router.delete('/:id', protect, authorize('admin'), deleteCollege);

export default router;