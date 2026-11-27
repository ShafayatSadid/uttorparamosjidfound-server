import { Router } from 'express';
import { createExpense, getExpenses, deleteExpense } from '../controllers/expense.controller.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getExpenses); // পাবলিক পেজে দেখার জন্য
router.post('/', verifyAdmin, createExpense);
router.delete('/:id', verifyAdmin, deleteExpense);

export default router;