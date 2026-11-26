import app from '../index.js';
import { connectDB } from '../config/db.js';

export default async function handler(req: any, res: any) {
  // প্রতিবার রিকোয়েস্ট আসলে ডাটাবেস কানেক্ট নিশ্চিত করবে (আপনার config/db.ts এ ক্যাশড থাকে)
  await connectDB(); 
  return app(req, res);
}