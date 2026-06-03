import express from 'express';
import {
  getAnalytics,
  getAllUsers,
  toggleUserActive,
} from '../controller/admin.controller.js';
import { getLeads, updateLead } from '../controller/lead.controller.js';
import { getAdminReviews, deleteReview } from '../controller/review.controller.js';
import {
  getAdminPlatformReviews,
  approvePlatformReview,
  featurePlatformReview,
  deletePlatformReview,
} from '../controller/platformReview.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All admin routes require admin role
router.use(protect, authorize('admin'));

router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-active', toggleUserActive);
router.get('/leads', getLeads);
router.patch('/leads/:id/status', updateLead);
router.get('/reviews', getAdminReviews);
router.delete('/reviews/:id', deleteReview);

// Platform (EduOdisha itself) reviews
router.get('/platform-reviews', getAdminPlatformReviews);
router.put('/platform-reviews/:id/approve', approvePlatformReview);
router.put('/platform-reviews/:id/feature', featurePlatformReview);
router.delete('/platform-reviews/:id', deletePlatformReview);

export default router;

// Career Routes (Keeping here for now or can be moved to career controller)
export const careerRouter = express.Router();

const careerData = {
  after10: {
    science: {
      title: 'Science after 10th',
      paths: ['Engineering (PCM)', 'Medical (PCB)', 'Architecture', 'Research'],
      courses: ['Class 11-12 Science', 'Polytechnic Diploma', 'ITI'],
      exams: ['JEE Main', 'NEET', 'OJEE Diploma'],
      salary: 'Entry: ₹3-5 LPA | Mid: ₹6-12 LPA | Senior: ₹15+ LPA',
    },
    commerce: {
      title: 'Commerce after 10th',
      paths: ['CA/CS', 'MBA', 'Banking', 'Finance', 'Economics'],
      courses: ['Class 11-12 Commerce', 'BBA', 'B.Com'],
      exams: ['CUET', 'CA Foundation', 'CLAT'],
      salary: 'Entry: ₹2.5-4 LPA | Mid: ₹5-10 LPA | Senior: ₹12+ LPA',
    },
    arts: {
      title: 'Arts after 10th',
      paths: ['Law', 'Journalism', 'Social Work', 'Teaching', 'Design'],
      courses: ['Class 11-12 Arts', 'BA', 'Mass Communication'],
      exams: ['CUET', 'CLAT', 'NDA'],
      salary: 'Entry: ₹2-3.5 LPA | Mid: ₹4-8 LPA | Senior: ₹10+ LPA',
    },
  },
  after12: {
    engineering: {
      title: 'Engineering after 12th',
      paths: ['B.Tech/BE', 'B.Sc Engineering', 'Integrated M.Tech'],
      courses: ['B.Tech', 'B.Arch', 'B.Plan'],
      exams: ['JEE Main', 'JEE Advanced', 'OJEE', 'CUET'],
      salary: 'Entry: ₹3.5-6 LPA | Mid: ₹8-18 LPA | Senior: ₹20+ LPA',
    },
    medical: {
      title: 'Medical after 12th',
      paths: ['MBBS', 'BDS', 'BAMS', 'Nursing', 'Pharmacy', 'Physiotherapy'],
      courses: ['MBBS', 'BDS', 'B.Sc Nursing', 'B.Pharm'],
      exams: ['NEET-UG', 'AIIMS', 'JIPMER'],
      salary: 'Entry: ₹4-8 LPA | Mid: ₹10-25 LPA | Senior: ₹30+ LPA',
    },
    management: {
      title: 'Management & Commerce after 12th',
      paths: ['BBA', 'B.Com', 'CA', 'CMA', 'Banking'],
      courses: ['BBA', 'B.Com', 'BCA', 'B.Sc Economics'],
      exams: ['CUET', 'IPMAT', 'CA Foundation'],
      salary: 'Entry: ₹3-5 LPA | Mid: ₹7-15 LPA | Senior: ₹20+ LPA',
    },
  }
};

careerRouter.get('/', (req, res) => {
  res.json({ success: true, data: careerData });
});

careerRouter.get('/after10/:stream', (req, res) => {
  const data = careerData.after10[req.params.stream];
  if (!data) return res.status(404).json({ success: false, message: 'Career path not found' });
  res.json({ success: true, data });
});

careerRouter.get('/after12/:field', (req, res) => {
  const data = careerData.after12[req.params.field];
  if (!data) return res.status(404).json({ success: false, message: 'Career path not found' });
  res.json({ success: true, data });
});