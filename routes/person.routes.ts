import { Router } from 'express';
import { getPersons, createPerson, getPersonById } from '../controllers/person.controller';
import { verifyAdmin } from '../middleware/auth';

const router = Router();

router.get('/', verifyAdmin, getPersons); // অ্যাডমিন সব লিস্ট দেখবে
router.post('/', verifyAdmin, createPerson); // নতুন ব্যক্তি যোগ
router.get('/:id', verifyAdmin, getPersonById); // নির্দিষ্ট ব্যক্তির ডিটেইলস

export default router;