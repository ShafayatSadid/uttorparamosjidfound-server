import { Router } from 'express';
import { getFundTypes, createFundType, updateFundType } from '../controllers/fundType.controller.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getFundTypes);
router.post('/', verifyAdmin, createFundType);
router.put('/:id', verifyAdmin, updateFundType); // নতুন রাউট

export default router;