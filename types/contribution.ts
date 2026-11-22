import { ObjectId } from 'mongodb';

export interface Contribution {
  _id?: ObjectId;
  personId: ObjectId;
  fundTypeId: ObjectId;
  amount: number;
  date: Date;
  receiptNo: string; // হাতে লেখা রসিদ নম্বর
  createdAt: Date;
}