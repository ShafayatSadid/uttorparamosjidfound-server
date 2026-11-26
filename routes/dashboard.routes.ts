import { Router } from 'express';
import { getDashboardSummary } from '../controllers/dashboard.controller.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/',verifyAdmin, getDashboardSummary);

export default router;