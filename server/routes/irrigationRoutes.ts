import express from 'express';
import dotenv from 'dotenv';
import { generateGeminiText, toGeminiError } from '../gemini.ts';

dotenv.config();

const router = express.Router();

router.get('/ping', (req, res) => {
  res.json({ message: "Irrigation router is alive" });
});

router.post('/strategy', async (req, res) => {
  try {
    console.log("🌊 [Irrigation API] Incoming Request:", req.body);
    const { crop, soilType, irrigationType, plantStage, landSize } = req.body;

    // 1. VALIDATE REQUEST BODY
    if (!crop || !soilType || !irrigationType || !plantStage || !landSize) {
      console.warn("⚠️ Missing required fields in request:", req.body);
      return res.status(400).json({
        success: false,
        error: "All fields are required"
      });
    }

    const prompt = `
      You are an agricultural irrigation expert.
      
      Farmer Details:
      Crop: ${crop}
      Soil Type: ${soilType}
      Irrigation Type: ${irrigationType}
      Plant Stage: ${plantStage}
      Land Size: ${landSize} acres
      
      Generate:
      1. Recommended irrigation method
      2. Reason
      3. Watering plan
      
      Return ONLY a JSON object with:
      - recommendedMethod: String
      - reason: String
      - plan: String
      
      Keep response short and practical.
      Format: {"recommendedMethod": "...", "reason": "...", "plan": "..."}
    `;

    let text = "";

    // 1. Try Ollama if enabled
    if (process.env.USE_OLLAMA === 'true') {
      const ollamaModel = process.env.OLLAMA_MODEL || 'phi3';
      console.log(`🤖 Using Ollama (${ollamaModel}) for Irrigation...`);
      try {
        const response = await fetch('http://127.0.0.1:11434/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: ollamaModel,
            prompt: prompt,
            stream: false
          })
        });

        if (response.ok) {
          const data = await response.json() as any;
          text = data.response;
          console.log("✅ Ollama success");
        }
      } catch (ollamaErr: any) {
        console.error("❌ Ollama failed:", ollamaErr.message);
      }
    }

    // 2. Try Gemini Fallback
    if (!text && process.env.GEMINI_API_KEY) {
      console.log("💎 Calling Gemini for Irrigation...");
      try {
        text = await generateGeminiText(prompt, 'gemini-2.0-flash');
        console.log("✅ Gemini success");
      } catch (geminiErr: any) {
        console.error("🔥 Gemini failed:", geminiErr.message);
      }
    }

    // 3. Final Fallback if AI fails
    if (!text || text.trim() === "") {
      console.warn("⚠️ All AI services failed - using static fallback");
      return res.json({
        recommendedMethod: irrigationType || "Drip Irrigation",
        reason: "Suitable for efficient water usage in this soil type.",
        plan: "Water early morning every alternate day for 30-40 minutes."
      });
    }
    
    let results;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      results = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (parseError) {
      console.error("❌ JSON Parse Error:", parseError);
    }

    if (!results) {
      return res.json({
        recommendedMethod: irrigationType || "Standard Irrigation",
        reason: "General irrigation logic for this crop type.",
        plan: "Check soil moisture daily and water when dry."
      });
    }

    console.log("✅ Sending irrigation strategy:", results);
    res.json({
      recommendedMethod: results.recommendedMethod || results.method || "Smart Irrigation",
      reason: results.reason || "Optimized for your current farm conditions.",
      plan: results.plan || "Follow a consistent schedule based on soil dampness."
    });

  } catch (error: any) {
    console.error("❌ IRRIGATION API ERROR:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Unknown server error"
    });
  }
});

export default router;
