import { ObjectId } from 'mongodb';

export interface WeeklyCollection {
  _id?: ObjectId;
  date: Date;
  amount: number;
  createdAt: Date;
}