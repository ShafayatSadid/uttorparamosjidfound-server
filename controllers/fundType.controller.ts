import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db';
import { FundType } from '../types/fundType';

export async function getFundTypes(req: Request, res: Response) {
  try {
    const db = getDB();
    const fundTypes = await db.collection<FundType>('fundTypes')
      .find({ isActive: true })
      .sort({ order: 1 })
      .toArray();
    
    res.json(fundTypes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fund types' });
  }
}

export async function createFundType(req: Request, res: Response) {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const db = getDB();
    const count = await db.collection('fundTypes').countDocuments();

    const newFundType: FundType = {
      name,
      isActive: true,
      order: count + 1,
      createdAt: new Date(),
    };

    const result = await db.collection('fundTypes').insertOne(newFundType);
    res.status(201).json({ ...newFundType, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create fund type' });
  }
}

// নতুন: Fund Type আপডেট
export async function updateFundType(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const { name, isActive } = req.body;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid ID' });
      return;
    }

    const db = getDB();
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (isActive !== undefined) updateData.isActive = isActive;

    const result = await db.collection<FundType>('fundTypes').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ error: 'Fund Type not found' });
      return;
    }

    res.json({ message: 'Fund Type updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update fund type' });
  }
}