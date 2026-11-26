import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import PDFDocument from 'pdfkit';
import path from 'path';
import { getDB } from '../config/db.js';
import { Person, PersonFund } from '../types/person.js';
import { Contribution } from '../types/contribution.js';
import { WeeklyCollection } from '../types/weekly.js';
import { MiscDonation } from '../types/miscDonation.js';

// বাংলা ফন্টের পাথ
const fontPath = path.join(process.cwd(), 'fonts', 'HindSiliguri-Regular.ttf');

// ১. নির্দিষ্ট ব্যক্তির রিপোর্ট (Individual)
export async function getPersonReport(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid ID' });
      return;
    }

    const db = getDB();
    const personId = new ObjectId(id);

    // ডেটা ফেচ
    const person = await db.collection<Person>('persons').findOne({ _id: personId });
    if (!person) {
      res.status(404).json({ error: 'Person not found' });
      return;
    }

    const funds = await db.collection<PersonFund>('personFunds').aggregate([
      { $match: { personId } },
      { $lookup: { from: 'fundTypes', localField: 'fundTypeId', foreignField: '_id', as: 'fundType' } },
      { $unwind: { path: '$fundType', preserveNullAndEmptyArrays: true } }
    ]).toArray();

    const contributions = await db.collection<Contribution>('contributions').find({ personId }).toArray();

    // PDF তৈরি
    const doc = new PDFDocument({ margin: 50 });
    
    // রেসপন্স হেডার সেট
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report-${person.name}.pdf`);
    
    doc.pipe(res);
    doc.font(fontPath);

    // হেডার
    doc.fontSize(20).text('মসজিদ হিসাব নিকাশ', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`নাম: ${person.name}`);
    doc.text(`মোবাইল: ${person.phone}`);
    doc.moveDown();

    // টেবিল হেডার
    doc.fontSize(12).text('ফান্ডের নাম', { width: 150, continued: true });
    doc.text('নির্ধারিত', { width: 100, continued: true });
    doc.text('আদায়কৃত', { width: 100, continued: true });
    doc.text('বাকি', { width: 100 });
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // টেবিল ডেটা
    for (const fund of funds) {
      const paid = contributions
        .filter(c => c.fundTypeId.toString() === fund.fundTypeId.toString())
        .reduce((sum, c) => sum + c.amount, 0);
      const due = fund.assignedAmount - paid;

      doc.text(fund.fundType?.name || 'Unknown', { width: 150, continued: true });
      doc.text(`${fund.assignedAmount} TK`, { width: 100, continued: true });
      doc.text(`${paid} TK`, { width: 100, continued: true });
      doc.text(`${due} TK`, { width: 100 });
      doc.moveDown(0.5);
    }

    doc.moveDown();
    doc.fontSize(14).text('আদায়ের বিস্তারিত:', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);

    contributions.forEach(c => {
      doc.text(`তারিখ: ${new Date(c.date).toLocaleDateString('bn-BD')} | রসিদ নং: ${c.receiptNo} | পরিমাণ: ${c.amount} TK`);
    });

    doc.end();
  } catch (error) {
    console.error(error);
    if (!res.headersSent) res.status(500).json({ error: 'Failed to generate PDF' });
  }
}

// ২. সামগ্রিক রিপোর্ট (Weekly, Monthly, Yearly, Total)
export async function getCombinedReport(req: Request, res: Response) {
  try {
    const { type, month, year } = req.query; // type = weekly | monthly | yearly | total
    const db = getDB();

    let startDate = new Date(0);
    let endDate = new Date();

    if (type === 'monthly' && month && year) {
      startDate = new Date(Number(year), Number(month) - 1, 1);
      endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);
    } else if (type === 'yearly' && year) {
      startDate = new Date(Number(year), 0, 1);
      endDate = new Date(Number(year), 11, 31, 23, 59, 59);
    } else if (type === 'weekly') {
      // গত ৭ দিনের রিপোর্ট
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    }

    const filterDate = { $gte: startDate, $lte: endDate };

    const weeklies = await db.collection<WeeklyCollection>('weeklyCollections').find({ date: filterDate }).toArray();
    const miscDonations = await db.collection<MiscDonation>('miscDonations').find({ date: filterDate }).toArray();

    const totalWeekly = weeklies.reduce((sum, w) => sum + w.amount, 0);
    const totalMisc = miscDonations.reduce((sum, m) => sum + m.amount, 0);

    // PDF তৈরি
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report-${type || 'total'}.pdf`);
    
    doc.pipe(res);
    doc.font(fontPath);

    // হেডার
    doc.fontSize(20).text('মসজিদ সামগ্রিক রিপোর্ট', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`রিপোর্টের ধরন: ${type || 'সর্বকালীন'}`);
    if (type === 'monthly') doc.text(`মাস: ${month}/${year}`);
    if (type === 'yearly') doc.text(`বছর: ${year}`);
    doc.moveDown();

    // সাপ্তাহিক আদায় সেকশন
    doc.fontSize(14).text('সাপ্তাহিক আদায়', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    weeklies.forEach(w => {
      doc.text(`তারিখ: ${new Date(w.date).toLocaleDateString('bn-BD')} - ${w.amount} TK`);
    });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`সাপ্তাহিক মোট: ${totalWeekly} TK`, { bold: true } as any);
    doc.moveDown();

    // বিবিধ দান সেকশন
    doc.fontSize(14).text('বিবিধ দান', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    miscDonations.forEach(m => {
      doc.text(`তারিখ: ${new Date(m.date).toLocaleDateString('bn-BD')} | দাতা: ${m.donorName} | উদ্দেশ্য: ${m.purpose} | টাকা: ${m.amount} TK`);
    });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`বিবিধ দান মোট: ${totalMisc} TK`, { bold: true } as any);
    
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();
    doc.fontSize(16).text(`সর্বমোট আদায়: ${totalWeekly + totalMisc} TK`, { align: 'right' });

    doc.end();
  } catch (error) {
    console.error(error);
    if (!res.headersSent) res.status(500).json({ error: 'Failed to generate PDF' });
  }
}