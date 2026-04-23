import express from 'express';
import dotenv from 'dotenv';
import { generateGeminiText, toGeminiError } from '../gemini.ts';

dotenv.config();

const router = express.Router();

router.post('/plan', async (req, res) => {
  const { crop, stage, method } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.json([]);
  }

  try {
    const prompt = `
      As an irrigation expert, generate a 7-day watering schedule.
      Crop: ${crop}
      Growth Stage: ${stage}
      Irrigation Method: ${method}

      Return ONLY a JSON array of 7 objects. Each object should have:
      - day: String (e.g. "Monday")
      - waterAmount: String (e.g. "12 Liters/m2")
      - duration: String (e.g. "45 mins")
      - time: String (e.g. "06:00 AM")
      - note: String (Advice for that day)
    `;

    const text = await generateGeminiText(prompt, 'gemini-1.5-flash');
    
    // Extract JSON from potential markdown code blocks
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const results = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    res.json(results);
  } catch (error) {
    const gemErr = toGeminiError(error);
    console.error('Irrigation AI Error:', gemErr.message);
    res.json([]);
  }
});

export default router;
