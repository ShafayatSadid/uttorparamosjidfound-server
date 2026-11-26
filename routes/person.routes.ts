import { Router } from 'express';
import { getPersons, createPerson, getPersonById, updatePerson, updatePersonFund } from '../controllers/person.controller.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getPersons);
router.post('/', verifyAdmin, createPerson);
router.get('/:id', verifyAdmin, getPersonById);
router.put('/:id', verifyAdmin, updatePerson); // নতুন রাউট: Person এডিট
router.put('/funds/:fundId', verifyAdmin, updatePersonFund); // নতুন রাউট: নির্ধারিত চাঁদা এডিট

export default router;