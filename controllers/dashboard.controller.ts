import { Request, Response } from 'express';
import { getDB } from '../config/db';

export async function getDashboardSummary(req: Request, res: Response) {
  try {
    const db = getDB();

    // ১. মোট ব্যক্তি সংখ্যা
    const totalPersons = await db.collection('persons').countDocuments();

    // ২. মোট নির্ধারিত চাঁদা (Assigned Amount)
    const assignedResult = await db.collection('personFunds').aggregate([
      { $group: { _id: null, total: { $sum: '$assignedAmount' } } }
    ]).toArray();
    const totalAssigned = assignedResult.length > 0 ? assignedResult[0].total : 0;

    // ৩. ব্যক্তিদের কাছ থেকে মোট আদায়কৃত (Contributions)
    const contribResult = await db.collection('contributions').aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).toArray();
    const totalContributions = contribResult.length > 0 ? contribResult[0].total : 0;

    // ৪. মোট বাকি (Assigned - Contributions)
    const totalDue = totalAssigned - totalContributions;

    // ৫. সাপ্তাহিক মোট আদায়
    const weeklyResult = await db.collection('weeklyCollections').aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).toArray();
    const totalWeekly = weeklyResult.length > 0 ? weeklyResult[0].total : 0;

    // ৬. বিবিধ দান মোট
    const miscResult = await db.collection('miscDonations').aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).toArray();
    const totalMisc = miscResult.length > 0 ? miscResult[0].total : 0;

    // ৭. সর্বমোট আদায় (ব্যক্তি + সাপ্তাহিক + বিবিধ)
    const grandTotalCollection = totalContributions + totalWeekly + totalMisc;

    // রেসপন্স
    res.json({
      totalPersons,
      totalAssigned,
      totalContributions,
      totalDue,
      totalWeekly,
      totalMisc,
      grandTotalCollection
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dashboard summary' });
  }
}