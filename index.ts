import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { connectDB } from './config/db.js'; // লোকাল কানেকশনের জন্য ইম্পোর্ট করা হলো
import fundTypeRoutes from './routes/fundType.routes.js';
import personRoutes from './routes/person.routes.js';
import contributionRoutes from './routes/contribution.routes.js';
import weeklyRoutes from './routes/weekly.routes.js';
import miscDonationRoutes from './routes/miscDonation.routes.js';
import reportRoutes from './routes/report.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import memberRoutes from './routes/member.routes.js';
import expenseRoutes from './routes/expense.routes.js';

const app = express();

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Routes
app.use('/api/fund-types', fundTypeRoutes);
app.use('/api/persons', personRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/weekly', weeklyRoutes);
app.use('/api/misc-donations', miscDonationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/expenses', expenseRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 👇 শুধুমাত্র লোকালহোস্টে সার্ভার চালু হবে (Vercel-এ এটি স্কিপ হবে)
// if (process.env.NODE_ENV !== 'production') {
//   async function start() {
//     try {
//       await connectDB(); // লোকালহোস্টে ডাটাবেস কানেক্ট
//       app.listen(env.PORT, () => {
//         console.log(`🚀 Server running on http://localhost:${env.PORT}`);
//       });
//     } catch (err) {
//       console.error('❌ Server start failed:', err);
//       process.exit(1);
//     }
//   }
//   start();
// }

// Vercel Serverless ফাংশনের জন্য app এক্সপোর্ট
export default app;