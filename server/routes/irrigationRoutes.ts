import express from 'express';
import dotenv from 'dotenv';
import { generateGeminiText } from '../gemini.ts';

dotenv.config();

const router = express.Router();

// ✅ PERFORMANCE: Simple in-memory cache for irrigation strategies
const cache: Record<string, any> = {};

router.post('/strategy', async (req, res) => {
  try {
    const { crop, soilType, irrigationType, plantStage, landSize } = req.body;

    if (!crop || !soilType || !irrigationType || !plantStage || !landSize) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    // ✅ PERFORMANCE: Cache check
    const cacheKey = `${crop}-${soilType}-${irrigationType}-${plantStage}-${landSize}`;
    if (cache[cacheKey]) {
      console.log("⚡ [Irrigation Cache] Serving instant strategy");
      return res.json(cache[cacheKey]);
    }

    const prompt = `
      You are an agricultural irrigation expert.
      Crop: ${crop}, Soil: ${soilType}, System: ${irrigationType}, Stage: ${plantStage}, Size: ${landSize} acres.
      Return ONLY a JSON object: {"recommendedMethod": "...", "reason": "...", "plan": "..."}
      Keep it practical for a farmer.
    `;

    let resultData = null;

    // 1. Try Ollama (Master Dual-Stack Connection)
    if (process.env.USE_OLLAMA === 'true') {
      const ollamaModel = process.env.OLLAMA_MODEL || 'phi3:latest';
      console.log(`🤖 [Irrigation] Querying Ollama (${ollamaModel})...`);
      
      const urls = ['http://127.0.0.1:11434/api/generate', 'http://localhost:11434/api/generate'];
      
      for (const url of urls) {
        if (resultData) break;
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(15000), // 15s timeout for text
            body: JSON.stringify({
              model: ollamaModel,
              prompt: prompt,
              stream: false,
              options: { temperature: 0.3, num_predict: 250, keep_alive: "15m" }
            })
          });

          if (response.ok) {
            const data = await response.json() as any;
            const text = data.response;
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              resultData = JSON.parse(jsonMatch[0]);
              console.log(`✅ [Irrigation] Success from ${url}`);
            }
          }
        } catch (err: any) {
          console.error(`❌ [Irrigation] Failed on ${url}:`, err.message);
        }
      }
    }

    // 2. Try Gemini Fallback
    if (!resultData && process.env.GEMINI_API_KEY) {
      console.log("💎 [Gemini] Calling cloud fallback (2.0-flash)...");
      try {
        const text = await generateGeminiText(prompt, 'gemini-2.0-flash');
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          resultData = JSON.parse(jsonMatch[0]);
          console.log("✅ [Gemini] Success");
        }
      } catch (err: any) {
        console.error("🔥 [Gemini] Failed:", err.message);
      }
    }

    // 3. Final Safe Response
    if (!resultData) {
      resultData = {
        recommendedMethod: irrigationType || "Precision Drip Irrigation",
        reason: `Based on your ${crop} crop and ${soilType} soil, we recommend an efficient watering schedule to maximize yield.`,
        plan: "Water early morning for 45 minutes every 2 days. Monitor soil moisture at root level."
      };
    }

    // ✅ STABILITY: Ensure all fields are strings to prevent React crashes
    const sanitizedResult = {
      recommendedMethod: typeof resultData.recommendedMethod === 'string' 
        ? resultData.recommendedMethod 
        : (resultData.method || irrigationType || "Smart Irrigation"),
      reason: typeof resultData.reason === 'string' 
        ? resultData.reason 
        : "Optimized for your specific crop and soil conditions.",
      plan: typeof resultData.plan === 'string' 
        ? resultData.plan 
        : (typeof resultData.plan === 'object' 
            ? Object.entries(resultData.plan).map(([k, v]) => `${k}: ${v}`).join('. ') 
            : "Follow a consistent watering schedule.")
    };

    // ✅ PERFORMANCE: Cache result
    cache[cacheKey] = sanitizedResult;
    res.json(sanitizedResult);

  } catch (error: any) {
    console.error("🔥 [Critical] Irrigation Error:", error.message);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
