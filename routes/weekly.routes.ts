import { Router } from 'express';
import { createWeekly, getWeeklies, deleteWeekly } from '../controllers/weekly.controller.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/', verifyAdmin, createWeekly);
router.get('/', getWeeklies);
router.delete('/:id', verifyAdmin, deleteWeekly);

export default router;