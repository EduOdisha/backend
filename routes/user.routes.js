import express from 'express';
import {
  getUserDashboard,
  updateUserProfile,
  saveCollege,
  saveCourse,
  examReminder,
  readNotification,
} from '../controller/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard', getUserDashboard);
router.put('/profile', updateUserProfile);
router.post('/save-college/:id', saveCollege);
router.post('/save-course/:id', saveCourse);
router.post('/exam-reminder/:id', examReminder);
router.put('/notifications/:id/read', readNotification);

export default router;