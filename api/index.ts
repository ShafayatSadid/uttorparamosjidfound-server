// api/index.ts
import app from '../index.js';
import { connectDB } from '../config/db.js';

export default async function handler(req: any, res: any) {
  try {
    // ডাটাবেস কানেক্ট করার চেষ্টা কর
    await connectDB();
    // সফল হলে Express অ্যাপে রিকোয়েস্ট পাঠা
    return app(req, res);
  } catch (error) {
    // এরর হলে Vercel-কে ক্র্যাশ না করতে দিয়ে, ক্লায়েন্টকে মেসেজ পাঠা
    console.error('Function Invocation Error:', error);
    return res.status(500).json({
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}