import { ObjectId } from 'mongodb';

export interface Expense {
  _id?: ObjectId;
  date: Date;
  description: string; // কী বাবদ খরচ
  amount: number;
  createdAt: Date;
}