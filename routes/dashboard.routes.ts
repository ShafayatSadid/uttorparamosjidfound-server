import { Router } from 'express';
import { getDashboardSummary } from '../controllers/dashboard.controller';
import { verifyAdmin } from '../middleware/auth';

const router = Router();

router.get('/',verifyAdmin, getDashboardSummary);

export default router;