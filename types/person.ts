import { ObjectId } from 'mongodb';

export interface Person {
  _id?: ObjectId;
  name: string;
  phone: string;
  createdAt: Date;
}

export interface PersonFund {
  _id?: ObjectId;
  personId: ObjectId;
  fundTypeId: ObjectId;
  assignedAmount: number; // নির্ধারিত চাঁদা
  createdAt: Date;
}