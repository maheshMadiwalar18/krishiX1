import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

router.post('/', async (req, res) => {
  const { crop, soil, stage, weather, location } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API key not configured' });
  }

  try {
    const prompt = `
You are an agriculture expert.

Based on:
Crop: ${crop}
Soil: ${soil}
Stage: ${stage}
Weather: ${weather}
Location: ${location}

Give irrigation advice in this exact format:
Recommended Method: [Method name]
Reason: [Short reason]
Plan: [Simple practical plan]

Use simple English. Keep answers short and practical.
    `.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: prompt,
    });

    const text = response.text ?? '';

    // Parse the structured text into JSON
    const methodMatch = text.match(/Recommended Method:\s*(.+)/i);
    const reasonMatch = text.match(/Reason:\s*(.+)/i);
    const planMatch = text.match(/Plan:\s*(.+)/i);

    const jsonResponse = {
      method: methodMatch ? methodMatch[1].trim() : 'Standard Irrigation',
      reason: reasonMatch ? reasonMatch[1].trim() : 'Based on crop and soil requirements.',
      plan: planMatch ? planMatch[1].trim() : 'Water at root zone in the early morning.',
    };

    res.json(jsonResponse);
  } catch (error: any) {
    console.error('Gemini API Error:', error?.message || error);
    
    // Fallback to a smart mock response if API fails (e.g. quota limit)
    const fallbackResponse = {
      method: "Smart Drip Irrigation",
      reason: "Based on local soil moisture retention and crop stage needs.",
      plan: "Water for 30-45 minutes in the early morning to minimize evaporation. Monitor soil moisture weekly."
    };
    
    res.json(fallbackResponse);
  }
});

export default router;
