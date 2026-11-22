import { ObjectId } from 'mongodb';

export interface MiscDonation {
  _id?: ObjectId;
  donorName: string;
  phone: string;
  purpose: string;
  receivedBy: string;
  amount: number;
  date: Date;
  createdAt: Date;
}