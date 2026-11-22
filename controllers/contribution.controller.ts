import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db';
import { Contribution } from '../types/contribution';

// ১. নতুন পেমেন্ট (আদায়) যোগ করা
export async function createContribution(req: Request, res: Response) {
  try {
    const { personId, fundTypeId, amount, date, receiptNo } = req.body;

    if (!personId || !fundTypeId || !amount || !date || !receiptNo) {
      res.status(400).json({ error: 'সবগুলো ফিল্ড (personId, fundTypeId, amount, date, receiptNo) দিতে হবে' });
      return;
    }

    const db = getDB();

    const newContribution: Contribution = {
      personId: new ObjectId(personId as string),
      fundTypeId: new ObjectId(fundTypeId as string),
      amount: Number(amount),
      date: new Date(date),
      receiptNo: String(receiptNo),
      createdAt: new Date()
    };

    const result = await db.collection<Contribution>('contributions').insertOne(newContribution);
    res.status(201).json({ message: 'Payment added successfully', id: result.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add contribution' });
  }
}

// ২. নির্দিষ্ট ব্যক্তির সব পেমেন্ট দেখা (হিসাবের জন্য)
export async function getContributionsByPerson(req: Request, res: Response) {
  try {
    const personId = req.params.personId as string;
    
    if (!ObjectId.isValid(personId)) {
      res.status(400).json({ error: 'Invalid Person ID' });
      return;
    }

    const db = getDB();
    const contributions = await db.collection<Contribution>('contributions')
      .find({ personId: new ObjectId(personId) })
      .sort({ date: -1 }) // নতুন পেমেন্ট আগে দেখাবে
      .toArray();

    res.json(contributions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contributions' });
  }
}

// ৩. ভুল পেমেন্ট ডিলিট করা
export async function deleteContribution(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid ID' });
      return;
    }

    const db = getDB();
    const result = await db.collection<Contribution>('contributions').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Contribution not found' });
      return;
    }

    res.json({ message: 'Contribution deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete contribution' });
  }
}