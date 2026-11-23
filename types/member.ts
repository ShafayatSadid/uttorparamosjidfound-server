import { ObjectId } from 'mongodb';

export interface Member {
  _id?: ObjectId;
  name: string;
  designation: string; // পদবী
  profession: string;  // পেশা
  phone: string;       // মোবাইল নাম্বার
  category: 'advisory' | 'committee' | 'member'; // উপদেষ্টা, কমিটি, সদস্য
  imageUrl: string;    // Cloudinary থেকে আসা ছবির লিংক
  imagePublicId: string; // ভবিষ্যতে ছবি ডিলিট করার জন্য
  isFeatured: boolean; // হোমপেজে দেখাবে কি না
  createdAt: Date;
}