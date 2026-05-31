import express from 'express';
import { createLead, getLeads, updateLead } from '../controller/lead.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin', 'counselor'), getLeads)
  .post(createLead);

router.route('/:id')
  .put(protect, authorize('admin', 'counselor'), updateLead);

export default router;
