import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { Member } from '../types/member.js';

// ১. সব মেম্বার আনা (ফিল্টার সহ)
export async function getMembers(req: Request, res: Response) {
  try {
    const { category, featured, limit } = req.query;
    const db = getDB();
    
    // কুয়েরি অবজেক্ট তৈরি
    let query: any = {};
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;

    let cursor = db.collection<Member>('members').find(query).sort({ createdAt: -1 });
    
    // লিমিট সেট করা (হোমপেজের জন্য ৩ জন)
    if (limit) {
      cursor = cursor.limit(Number(limit));
    }

    const members = await cursor.toArray();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
}

// ২. নতুন মেম্বার যোগ করা
export async function createMember(req: Request, res: Response) {
  try {
    const { name, designation, profession, phone, category, imageUrl, imagePublicId, isFeatured } = req.body;

    if (!name || !designation || !category) {
      res.status(400).json({ error: 'Name, designation, and category are required' });
      return;
    }

    const db = getDB();
    
    const newMember: Member = {
      name,
      designation,
      profession: profession || '',
      phone: phone || '',
      category,
      imageUrl: imageUrl || '',
      imagePublicId: imagePublicId || '',
      isFeatured: Boolean(isFeatured),
      createdAt: new Date()
    };

    const result = await db.collection<Member>('members').insertOne(newMember);
    res.status(201).json({ message: 'Member added successfully', id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add member' });
  }
}

// ৩. মেম্বার আপডেট করা
export async function updateMember(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid ID' });
      return;
    }

    const db = getDB();
    const updateData = req.body;
    
    // যেসব ফিল্ড আপডেট করা যাবে
    const allowedUpdates = ['name', 'designation', 'profession', 'phone', 'category', 'imageUrl', 'imagePublicId', 'isFeatured'];
    const finalUpdate: any = {};
    
    for (const key of Object.keys(updateData)) {
      if (allowedUpdates.includes(key)) {
        finalUpdate[key] = updateData[key];
      }
    }

    const result = await db.collection<Member>('members').updateOne(
      { _id: new ObjectId(id) },
      { $set: finalUpdate }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ error: 'Member not found' });
      return;
    }

    res.json({ message: 'Member updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update member' });
  }
}

// ৪. মেম্বার ডিলিট করা
export async function deleteMember(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid ID' });
      return;
    }

    const db = getDB();
    const result = await db.collection<Member>('members').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Member not found' });
      return;
    }

    // এখানে চাইলে Cloudinary থেকে ছবি ডিলিট করার লজিক বসাতে পারেন (পরে করব)
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete member' });
  }
}