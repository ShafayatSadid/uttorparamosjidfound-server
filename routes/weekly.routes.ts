import { Router } from 'express';
import { createWeekly, getWeeklies, deleteWeekly } from '../controllers/weekly.controller';
import { verifyAdmin } from '../middleware/auth';

const router = Router();

router.post('/', verifyAdmin, createWeekly);
router.get('/', verifyAdmin, getWeeklies);
router.delete('/:id', verifyAdmin, deleteWeekly);

export default router;