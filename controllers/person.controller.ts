import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db';
import { Person, PersonFund } from '../types/person';

// ১. সব ব্যক্তির লিস্ট (তাদের ফান্ড ডিটেইলসহ)
export async function getPersons(req: Request, res: Response) {
  try {
    const db = getDB();
    const persons = await db.collection<Person>('persons').aggregate([
      {
        $lookup: {
          from: 'personFunds',
          localField: '_id',
          foreignField: 'personId',
          as: 'funds'
        }
      },
      {
        $lookup: {
          from: 'fundTypes',
          localField: 'funds.fundTypeId',
          foreignField: '_id',
          as: 'fundTypeDetails'
        }
      }
    ]).toArray();

    res.json(persons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch persons' });
  }
}

// ২. নতুন ব্যক্তি যোগ করা (সাথে ডিফল্ট বা কাস্টম ফান্ড সেট করা)
export async function createPerson(req: Request, res: Response) {
  try {
    const { name, phone, funds } = req.body;
    // funds = [{ fundTypeId: "...", assignedAmount: 5000 }]

    if (!name || !phone) {
      res.status(400).json({ error: 'Name and phone are required' });
      return;
    }

    const db = getDB();
    
    // ১. Person তৈরি
    const newPerson: Person = { name, phone, createdAt: new Date() };
    const result = await db.collection<Person>('persons').insertOne(newPerson);
    const personId = result.insertedId;

    // ২. যদি ফান্ড ডিটেইলস পাঠানো হয়, তবে personFunds এ সেভ করা
    if (funds && Array.isArray(funds) && funds.length > 0) {
      const personFunds: PersonFund[] = funds.map((f: any) => ({
        personId: personId,
        // এখানে as string কাস্ট করা হলো যাতে টাইপস্ক্রিপ্ট এরর না দেয়
        fundTypeId: new ObjectId(f.fundTypeId as string), 
        assignedAmount: Number(f.assignedAmount) || 0,
        createdAt: new Date()
      }));
      await db.collection<PersonFund>('personFunds').insertMany(personFunds);
    }

    res.status(201).json({ message: 'Person created successfully', personId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create person' });
  }
}

// ৩. নির্দিষ্ট ব্যক্তির ডিটেইলস দেখা (ফান্ডসহ)
export async function getPersonById(req: Request, res: Response) {
  try {
    const id = req.params.id as string; 

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid ID' });
      return;
    }

    const db = getDB();
    const personId = new ObjectId(id);

    const person = await db.collection<Person>('persons').findOne({ _id: personId });
    if (!person) {
      res.status(404).json({ error: 'Person not found' });
      return;
    }

    const funds = await db.collection<PersonFund>('personFunds').aggregate([
      { $match: { personId } },
      {
        $lookup: {
          from: 'fundTypes',
          localField: 'fundTypeId',
          foreignField: '_id',
          as: 'fundType'
        }
      },
      { $unwind: { path: '$fundType', preserveNullAndEmptyArrays: true } }
    ]).toArray();

    res.json({ ...person, funds });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch person' });
  }
}