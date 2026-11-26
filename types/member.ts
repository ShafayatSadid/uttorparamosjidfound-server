import { ObjectId } from 'mongodb';

export interface Member {
  _id?: ObjectId;
  name: string;
  designation: string; 
  profession: string;  
  phone: string;       
  category: 'advisory' | 'committee' | 'member';
  imageUrl: string;    
  imagePublicId: string; 
  isFeatured: boolean; 
  createdAt: Date;
}