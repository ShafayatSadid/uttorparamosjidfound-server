import { Router } from 'express';
import { getFundTypes, createFundType } from '../controllers/fundType.controller';
import { verifyAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getFundTypes); // সবাই দেখতে পারবে (বা আপনার লগইন করা অ্যাডমিন)
router.post('/', verifyAdmin, createFundType); // শুধু অ্যাডমিন তৈরি করতে পারবে

export default router;