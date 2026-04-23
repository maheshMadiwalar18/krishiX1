import express from 'express';
import dotenv from 'dotenv';
import { generateGeminiText, toGeminiError } from '../gemini.ts';

dotenv.config();

const router = express.Router();

router.post('/auto-reply', async (req, res) => {
  const { question } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.json({ reply: "Thanks for sharing! Our experts will get back to you soon." });
  }

  try {
    const prompt = `
      You are an expert agronomist in the KrishiX community. 
      A farmer asked: "${question}"
      
      Provide a helpful, expert first response.
      Keep it short (2-3 sentences).
    `;

    const text = await generateGeminiText(prompt, 'gemini-1.5-flash');

    res.json({ reply: text });
  } catch (error) {
    const gemErr = toGeminiError(error);
    console.error('Community AI Error:', gemErr.message);
    res.json({ reply: "Great question! Let's wait for other community members to share their experience too." });
  }
});

export default router;
