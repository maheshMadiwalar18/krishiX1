import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function findWorkingModel() {
  console.log("Fetching available models...");
  try {
    // We'll use a raw fetch to bypass SDK defaults if necessary
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    
    if (data.models) {
      console.log("Available Models:");
      data.models.forEach((m: any) => {
        if (m.supportedGenerationMethods.includes('generateContent')) {
          console.log(`- ${m.name}`);
        }
      });
    } else {
      console.log("No models returned. Response:", JSON.stringify(data));
    }
  } catch (e: any) {
    console.error("Fetch failed:", e.message);
  }
}

findWorkingModel();
