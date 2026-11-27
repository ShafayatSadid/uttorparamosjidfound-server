import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { Expense } from '../types/expense.js';

export async function createExpense(req: Request, res: Response) {
  try {
    const { date, description, amount } = req.body;
    if (!date || !description || !amount) {
      res.status(400).json({ error: 'সবগুলো ফিল্ড পূরণ করুন' });
      return;
    }

    const db = getDB();
    const newExpense: Expense = {
      date: new Date(date),
      description,
      amount: Number(amount),
      createdAt: new Date()
    };

    const result = await db.collection<Expense>('expenses').insertOne(newExpense);
    res.status(201).json({ message: 'Expense added', id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add expense' });
  }
}

export async function getExpenses(req: Request, res: Response) {
  try {
    const db = getDB();
    const expenses = await db.collection<Expense>('expenses')
      .find()
      .sort({ date: -1 })
      .toArray();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
}

export async function deleteExpense(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid ID' });
      return;
    }

    const db = getDB();
    const result = await db.collection<Expense>('expenses').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
}