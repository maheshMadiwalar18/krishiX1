import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

router.post('/', async (req, res) => {
  const { crop, soil, stage, weather, location } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API key not configured' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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

      Use simple English.
      Keep answers short and practical.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the structured text into JSON
    const methodMatch = text.match(/Recommended Method:\s*(.*)/i);
    const reasonMatch = text.match(/Reason:\s*(.*)/i);
    const planMatch = text.match(/Plan:\s*(.*)/i);

    const jsonResponse = {
      method: methodMatch ? methodMatch[1].trim() : "Optimal Method",
      reason: reasonMatch ? reasonMatch[1].trim() : "Custom irrigation based on soil and crop requirements.",
      plan: planMatch ? planMatch[1].trim() : "Check soil moisture and apply water as per stage."
    };

    res.json(jsonResponse);
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to generate irrigation advice' });
  }
});

export default router;
