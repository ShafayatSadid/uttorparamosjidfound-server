import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import fundTypeRoutes from './routes/fundType.routes.js';
import personRoutes from './routes/person.routes.js';
import contributionRoutes from './routes/contribution.routes.js';
import weeklyRoutes from './routes/weekly.routes.js';
import miscDonationRoutes from './routes/miscDonation.routes.js';
import reportRoutes from './routes/report.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import memberRoutes from './routes/member.routes.js';

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

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// লোকালহোস্টের listen() সম্পূর্ণ বাদ দেওয়া হলো
export default app;