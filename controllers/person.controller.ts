import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db';
import { Person, PersonFund } from '../types/person';

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

export async function createPerson(req: Request, res: Response) {
  try {
    const { name, phone, funds } = req.body;

    if (!name || !phone) {
      res.status(400).json({ error: 'Name and phone are required' });
      return;
    }

    const db = getDB();
    const newPerson: Person = { name, phone, createdAt: new Date() };
    const result = await db.collection<Person>('persons').insertOne(newPerson);
    const personId = result.insertedId;

    if (funds && Array.isArray(funds) && funds.length > 0) {
      const personFunds: PersonFund[] = funds.map((f: any) => ({
        personId: personId,
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

// নতুন: Person (নাম/ফোন) আপডেট
export async function updatePerson(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const { name, phone } = req.body;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid ID' });
      return;
    }

    const db = getDB();
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;

    const result = await db.collection<Person>('persons').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ error: 'Person not found' });
      return;
    }

    res.json({ message: 'Person updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update person' });
  }
}

// নতুন: Person Fund (নির্ধারিত চাঁদা) আপডেট
export async function updatePersonFund(req: Request, res: Response) {
  try {
    const fundId = req.params.fundId as string;
    const { assignedAmount } = req.body;

    if (!ObjectId.isValid(fundId)) {
      res.status(400).json({ error: 'Invalid Fund ID' });
      return;
    }

    const db = getDB();
    const result = await db.collection<PersonFund>('personFunds').updateOne(
      { _id: new ObjectId(fundId) },
      { $set: { assignedAmount: Number(assignedAmount) } }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ error: 'Fund record not found' });
      return;
    }

    res.json({ message: 'Assigned amount updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update assigned amount' });
  }
}