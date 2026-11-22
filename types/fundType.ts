import { ObjectId } from 'mongodb';

export interface FundType {
  _id?: ObjectId;
  name: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
}