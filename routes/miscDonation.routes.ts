import { Router } from 'express';
import { createMiscDonation, getMiscDonations, deleteMiscDonation } from '../controllers/miscDonation.controller.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/', verifyAdmin, createMiscDonation);
router.get('/', getMiscDonations);
router.delete('/:id', verifyAdmin, deleteMiscDonation);

export default router;