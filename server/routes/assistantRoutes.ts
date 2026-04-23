import express from 'express';
import dotenv from 'dotenv';
import { generateGeminiText, toGeminiError } from '../gemini.ts';

dotenv.config();

const router = express.Router();

router.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ reply: 'Please enter a message.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.json({ reply: "I'm in offline mode right now, but I can still help with general farming tips!" });
  }

  try {
    const prompt = `
      You are Krishi AI, a helpful agricultural assistant. 
      The farmer says: "${message}"
      
      Provide a helpful, professional, and culturally appropriate response.
      Keep the answer concise (max 3-4 sentences).
    `;

    const text = await generateGeminiText(prompt, 'gemini-1.5-flash');

    console.log('Gemini Chat Response:', text);
    res.json({ reply: text });
  } catch (error: any) {
    const gemErr = toGeminiError(error);
    console.error('Chatbot API Error:', gemErr.message);

    if (gemErr.kind === 'quota') {
      return res.json({ reply: "I'm processing a lot of requests right now! While I catch my breath, remember that soil health is the foundation of a good harvest. Try asking again in 60 seconds!" });
    }

    if (gemErr.kind === 'auth') {
      return res.json({ reply: "My connection to the main knowledge base is being updated. I'll be back in full capacity shortly!" });
    }

    if (gemErr.kind === 'network') {
      return res.json({ reply: "I'm having trouble reaching my knowledge service due to a network issue. Please try again in a moment." });
    }

    res.json({ reply: "I'm having a bit of trouble connecting to my brain. Please try asking again in a moment." });
  }
});

export default router;
