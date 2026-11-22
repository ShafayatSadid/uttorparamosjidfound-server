import { Router } from 'express';
import { createContribution, getContributionsByPerson, deleteContribution } from '../controllers/contribution.controller';
import { verifyAdmin } from '../middleware/auth';

const router = Router();

router.post('/', verifyAdmin, createContribution);
router.get('/person/:personId', verifyAdmin, getContributionsByPerson);
router.delete('/:id', verifyAdmin, deleteContribution);

export default router;