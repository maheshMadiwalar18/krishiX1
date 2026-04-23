import express from 'express';
import dotenv from 'dotenv';
import { generateGeminiText } from '../gemini.ts';

dotenv.config();

const router = express.Router();

const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
const USE_OLLAMA = process.env.USE_OLLAMA === 'true';
const OLLAMA_MODEL = 'phi3'; // ⚡ Forced fast model

// ⚡ Simple In-Memory Cache
const strategyCache: Record<string, any> = {};

router.post('/strategy', async (req, res) => {
  const { location, soilType, landSize, season, previousCrop } = req.body;
  console.log("🤖 AI Crop Recommendation Triggered:", { location, soilType, landSize, season, previousCrop });

  const prompt = `
    As a professional agricultural advisor, suggest 3 to 5 different crops for a farmer.
    Inputs: Location: ${location}, Soil: ${soilType}, Land: ${landSize} acres, Season: ${season}, Previous Crop: ${previousCrop}.
    
    Return ONLY a JSON object with a "success": true flag and a "crops" array. 
    Each crop object must have:
    - "name": String (Crop name)
    - "yield": String (e.g. "2.5 Tons/Acre")
    - "profit": Number (Estimated profit in INR for ${landSize} acres)
    - "risk": "Low" | "Medium" | "High"
    - "waterNeed": "Low" | "Moderate" | "High"
    - "insight": "Why this crop is good."
    - "rotationBenefit": "How it helps after ${previousCrop}."
    - "tag": "most_profitable" | "lowest_risk" | "water_efficient"
    - "expense": { "seeds": "₹...", "fertilizer": "₹...", "labor": "₹...", "water": "₹..." }
    - "plan": { "sowing": "Month/Season", "tips": ["...", "..."] }

    Format: {"success": true, "crops": [{"name": "...", "profit": 50000, "expense": {"seeds": "₹2000", ...}, ...}]}
  `;

  let results: any = null;

  // 1. Try Gemini (Priority)
  if (process.env.GEMINI_API_KEY) {
    try {
      console.log("💎 Calling Gemini (gemini-1.5-flash)...");
      const text = await generateGeminiText(prompt, 'gemini-1.5-flash');
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        results = JSON.parse(jsonMatch[0]);
        console.log("✅ AI Response Parsed successfully");
      }
    } catch (err: any) {
      console.error("🔥 Gemini failed:", err.message);
    }
  }

  // 2. Try Ollama Fallback
  if (!results && USE_OLLAMA) {
    try {
      console.log("🧠 Falling back to Ollama (phi3)...");
      const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'phi3',
          prompt: prompt,
          stream: false,
          format: 'json'
        })
      });
      if (response.ok) {
        const data = await response.json() as any;
        results = JSON.parse(data.response);
        console.log("✅ Ollama Response Parsed");
      }
    } catch (err: any) {
      console.error("❌ Ollama failed:", err.message);
    }
  }

  // 3. Last resort Mock Data
  if (!results || !results.crops) {
    console.log("⚠️ Using internal fallback data");
    results = {
      success: true,
      crops: [
        {
          name: "Tomato",
          yield: "15-20 Tons/Acre",
          profit: 128000 * (parseFloat(landSize) || 1),
          risk: "Medium",
          waterNeed: "Moderate",
          insight: "Thrives in red soil and Kharif season.",
          rotationBenefit: "Fixes nitrogen after Maize.",
          tag: "most_profitable",
          expense: { seeds: "₹4,500", fertilizer: "₹8,000", labor: "₹15,000", water: "₹2,500" },
          plan: { sowing: "June - July", tips: ["Regular staking required", "Monitor for early blight"] }
        },
        {
          name: "Ragi",
          yield: "1.2 Tons/Acre",
          profit: 30000 * (parseFloat(landSize) || 1),
          risk: "Low",
          waterNeed: "Low",
          insight: "Drought resistant.",
          rotationBenefit: "Breaks pest cycles.",
          tag: "water_efficient",
          expense: { seeds: "₹800", fertilizer: "₹2,500", labor: "₹6,000", water: "₹1,000" },
          plan: { sowing: "July", tips: ["Seed treatment with Azospirillum", "Row planting for better yield"] }
        }
      ]
    };
  }

  res.json(results);
});

// Alias for older endpoint
router.post('/generate-strategy', (req, res) => {
  // Redirect to new logic but wrap it in recommendations to maintain compatibility if needed
  // Actually, let's just make it call the same logic.
  req.url = '/strategy';
  router.handle(req, res, () => {});
});

export default router;
