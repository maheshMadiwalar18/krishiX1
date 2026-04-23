import { Router } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// Ollama connection setup for analysis
const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
const USE_OLLAMA = process.env.USE_OLLAMA === 'true';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3:8b';

// Get dashboard analytics
router.get('/dashboard', (req, res) => {
  res.json({
    stats: {
      totalYield: '14.2 Tons',
      healthScore: '94%',
      activeAlerts: '0',
      estProfit: '₹89,200'
    },
    yieldData: [
      { month: 'Jan', amount: 4000 },
      { month: 'Feb', amount: 3000 },
      { month: 'Mar', amount: 2000 },
      { month: 'Apr', amount: 2780 },
      { month: 'May', amount: 1890 },
      { month: 'Jun', amount: 2390 },
    ]
  });
});

// AI Analyst Route
router.post('/analyze', async (req, res) => {
  const { data } = req.body;
  
  const prompt = `
    Analyze this farm data and provide 3 short, actionable insights for the farmer. 
    Keep them very brief (1 sentence each).
    Data: ${JSON.stringify(data)}
    
    Insights should be professional, encouraging, and focused on improving yield or profit.
  `;

  let insight = "";

  // Try Ollama
  if (USE_OLLAMA) {
    console.log("📊 Analyzing data with local AI...");
    try {
      const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          model: OLLAMA_MODEL, 
          prompt: prompt, 
          stream: false 
        })
      });
      if (response.ok) {
        const resData = await response.json() as any;
        insight = resData.response;
        console.log("✅ Analysis complete");
      }
    } catch (e) {
      console.error("❌ Local Analyst failed");
    }
  }

  // Fallback
  if (!insight) {
    insight = "1. Your yield trend is positive; maintain current irrigation levels. 2. Health score is excellent; monitor for pests weekly. 3. Profit projection is on track for year-end goals.";
  }

  res.json({ insight });
});

export default router;
