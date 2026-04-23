import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

router.post('/ai-reply', async (req, res) => {
  const { crop, issue, text } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.json({ 
      author: "Krishi AI",
      text: "Neem oil spray is recommended for most pests. Keep the soil moist but not soggy.",
      isAI: true
    });
  }

  try {
    const prompt = `
      You are an agricultural expert named Krishi AI. 
      A farmer has a problem with their ${crop}. 
      Category: ${issue}
      Description: ${text}

      Provide a short, helpful solution (max 2 sentences). 
      Be practical and encouraging.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: prompt,
    });

    res.json({
      author: "Krishi AI",
      text: response.text || "Apply organic fertilizer and check for pests regularly.",
      isAI: true
    });
  } catch (error) {
    console.error('Community AI Error:', error);
    res.json({
      author: "Krishi AI",
      text: "I recommend checking the moisture levels and applying natural pesticides if needed.",
      isAI: true
    });
  }
});

export default router;
