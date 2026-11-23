import { Router } from 'express';
import { getPersons, createPerson, getPersonById, updatePerson, updatePersonFund } from '../controllers/person.controller';
import { verifyAdmin } from '../middleware/auth';

const router = Router();

router.get('/', verifyAdmin, getPersons);
router.post('/', verifyAdmin, createPerson);
router.get('/:id', verifyAdmin, getPersonById);
router.put('/:id', verifyAdmin, updatePerson); // নতুন রাউট: Person এডিট
router.put('/funds/:fundId', verifyAdmin, updatePersonFund); // নতুন রাউট: নির্ধারিত চাঁদা এডিট

export default router;