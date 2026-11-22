import { Request, Response } from 'express';
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

        // নতুন ফান্ডের অর্ডার বের করা (সবচেয়ে শেষে যোগ হওয়ার জন্য)
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