import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db';
import { WeeklyCollection } from '../types/weekly';

export async function createWeekly(req: Request, res: Response) {
  try {
    const { date, amount } = req.body;
    if (!date || !amount) {
      res.status(400).json({ error: 'Date and amount are required' });
      return;
    }

    const db = getDB();
    const newWeekly: WeeklyCollection = {
      date: new Date(date),
      amount: Number(amount),
      createdAt: new Date()
    };

    const result = await db.collection<WeeklyCollection>('weeklyCollections').insertOne(newWeekly);
    res.status(201).json({ message: 'Weekly collection added', id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add weekly collection' });
  }
}

export async function getWeeklies(req: Request, res: Response) {
  try {
    const db = getDB();
    // নতুন তারিখ আগে দেখাবে
    const weeklies = await db.collection<WeeklyCollection>('weeklyCollections')
      .find()
      .sort({ date: -1 })
      .toArray();
    res.json(weeklies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weekly collections' });
  }
}

export async function deleteWeekly(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid ID' });
      return;
    }

    const db = getDB();
    const result = await db.collection<WeeklyCollection>('weeklyCollections').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete' });
  }
}