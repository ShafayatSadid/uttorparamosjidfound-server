import { Router } from 'express';
import { getMembers, createMember, updateMember, deleteMember } from '../controllers/member.controller.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = Router();

// Public route (যে কেউ দেখতে পারবে)
router.get('/', getMembers); 

// Protected routes (শুধু অ্যাডমিন)
router.post('/', verifyAdmin, createMember);
router.put('/:id', verifyAdmin, updateMember);
router.delete('/:id', verifyAdmin, deleteMember);

export default router;