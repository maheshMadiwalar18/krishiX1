import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import diseaseRoutes from './routes/diseaseRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import assistantRoutes from './routes/assistantRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import irrigationRoutes from './routes/irrigationRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import planningRoutes from './routes/planningRoutes.js';

import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ 1. ENABLE CORS
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ✅ 2. LOG REQUESTS FOR DEBUGGING
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

app.use((err: any, _req: any, res: any, next: any) => {
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  return next(err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/disease-detect', diseaseRoutes); // Alias for new feature
app.use('/api/weather', weatherRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/irrigation', irrigationRoutes);
app.use('/api/irrigation-strategy', irrigationRoutes); // Alias for robustness
app.use('/api/community', communityRoutes);
app.use('/api/planning', planningRoutes);
app.use('/api/crop', planningRoutes); // ⚡ Alias for standardized access

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the AgriGuru API' });
});

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('Unhandled API Error:', err?.message || err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ✅ 3. LISTEN ON 0.0.0.0 FOR NETWORK ACCESS
app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`🚀 Server ready on http://0.0.0.0:${PORT}`);
  console.log(`🔗 Local access: http://localhost:${PORT}`);
});
