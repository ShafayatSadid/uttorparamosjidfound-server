import { Router } from 'express';
import { getPersonReport, getCombinedReport } from '../controllers/report.controller';
import { verifyAdmin } from '../middleware/auth';

const router = Router();

// নির্দিষ্ট ব্যক্তির রিপোর্ট
router.get('/person/:id', verifyAdmin, getPersonReport);

// সামগ্রিক রিপোর্ট (Query: ?type=weekly|monthly|yearly|total&month=1&year=2024)
router.get('/combined', verifyAdmin, getCombinedReport);

export default router;