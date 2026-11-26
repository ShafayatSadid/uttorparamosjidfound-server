import { connectDB } from './config/db';

async function seed() {
  try {
    const db = await connectDB();
    const collection = db.collection('fundTypes');

    // চেক করা হচ্ছে ডাটাবেসে আগে থেকেই ফান্ড টাইপ আছে কি না
    const count = await collection.countDocuments();
    if (count > 0) {
      console.log('⚠️ Fund types already exist. Skipping seed to avoid duplicates.');
      process.exit(0);
    }

    const defaultFundTypes = [
      {
        name: 'নির্মাণ কাজ',
        isActive: true,
        order: 1,
        createdAt: new Date(), // অটোমেটিক আজকের তারিখ বসবে
      },
      {
        name: 'বাৎসরিক চাঁদা',
        isActive: true,
        order: 2,
        createdAt: new Date(),
      },
    ];

    const result = await collection.insertMany(defaultFundTypes);
    console.log(`✅ Successfully inserted ${result.insertedCount} fund types!`);
    
    process.exit(0); // স্ক্রিপ্ট সফলভাবে শেষ হলে বন্ধ হয়ে যাবে
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seed();