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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

app.use((err: any, _req: any, res: any, next: any) => {
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  return next(err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/irrigation', irrigationRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/planning', planningRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the AgriGuru API' });
});

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('Unhandled API Error:', err?.message || err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
