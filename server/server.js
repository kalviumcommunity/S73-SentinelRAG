import express from 'express';
import cors from 'cors';
import alertsRouter from './routes/alerts.js';
import runbooksRouter from './routes/runbooks.js';
import copilotRouter from './routes/copilot.js';
import mitreRouter from './routes/mitre.js';
import auditRouter from './routes/audit.js';
import ragRouter from './routes/rag.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/alerts', alertsRouter);
app.use('/api/runbooks', runbooksRouter);
app.use('/api/copilot', copilotRouter);
app.use('/api/mitre', mitreRouter);
app.use('/api/audit', auditRouter);
app.use('/api/rag', ragRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'AegisOps Rapid Threat Intelligence & Incident Mitigation Engine',
    timestamp: new Date().toISOString(),
    version: '2.4.0-Enterprise'
  });
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`⚡ [AegisOps Backend API] Running on http://localhost:5000`);
  });
}

export default app;
