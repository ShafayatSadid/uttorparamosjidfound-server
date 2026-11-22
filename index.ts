import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { connectDB } from './config/db';

const app = express();

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Local development server start
async function start() {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${env.PORT}`);
    });
  } catch (err) {
    console.error('❌ Server start failed:', err);
    process.exit(1);
  }
}

start();

export default app;