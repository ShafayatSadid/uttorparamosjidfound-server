import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { MiscDonation } from '../types/miscDonation.js';

export async function createMiscDonation(req: Request, res: Response) {
  try {
    const { donorName, phone, purpose, receivedBy, amount, date } = req.body;
    
    if (!donorName || !phone || !purpose || !receivedBy || !amount || !date) {
      res.status(400).json({ error: 'সবগুলো ফিল্ড পূরণ করুন' });
      return;
    }

    const db = getDB();
    const newDonation: MiscDonation = {
      donorName,
      phone,
      purpose,
      receivedBy,
      amount: Number(amount),
      date: new Date(date),
      createdAt: new Date()
    };

    const result = await db.collection<MiscDonation>('miscDonations').insertOne(newDonation);
    res.status(201).json({ message: 'Donation added', id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add donation' });
  }
}

export async function getMiscDonations(req: Request, res: Response) {
  try {
    const db = getDB();
    const donations = await db.collection<MiscDonation>('miscDonations')
      .find()
      .sort({ date: -1 })
      .toArray();
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
}

export async function deleteMiscDonation(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid ID' });
      return;
    }

    const db = getDB();
    const result = await db.collection<MiscDonation>('miscDonations').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete' });
  }
}