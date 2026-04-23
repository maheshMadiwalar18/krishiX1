import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function listModels() {
  try {
    // We can't easily list models with the SDK without an authenticated request
    // but we can try a simple generation with a fallback model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("test");
    const response = await result.response;
    console.log("Gemini Pro Success:", response.text());
  } catch (e: any) {
    console.error("Gemini Pro Failed:", e.message);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("test");
    const response = await result.response;
    console.log("Gemini 1.5 Flash Success:", response.text());
  } catch (e: any) {
    console.error("Gemini 1.5 Flash Failed:", e.message);
  }
}

listModels();
