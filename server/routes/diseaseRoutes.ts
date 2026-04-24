import express from 'express';
import dotenv from 'dotenv';
import { generateGeminiTextFromContent } from '../gemini.ts';

dotenv.config();

const router = express.Router();

const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
const USE_OLLAMA = process.env.USE_OLLAMA === 'true';

import crypto from 'crypto';

// ✅ PERFORMANCE: Cache for disease detection results
const detectionCache: Record<string, any> = {};

// ✅ SHARED SCAN LOGIC
async function performDetection(image: string) {
  const base64Data = image.includes(',') ? image.split(',')[1] : image;
  
  // Create a unique key for the image to support instant caching
  const imageHash = crypto.createHash('md5').update(base64Data).digest('hex');
  if (detectionCache[imageHash]) {
    console.log("⚡ [Cache] Instant result for identical image");
    return detectionCache[imageHash];
  }

  // MINIMAL PROMPT: Reduced instructions for faster inference
  const prompt = `
    Analyze this plant image. Detect disease ONLY if clearly visible.
    Return ONLY JSON:
    {
      "observation": "Short description of what you see",
      "status": "HEALTHY / DISEASED / PEST / NOT SURE",
      "confidence": "LOW / MEDIUM / HIGH",
      "disease": "Specific Name",
      "elaborateIssue": "2-sentence issue explanation",
      "damageExtent": "Percentage of damage",
      "treatment": "3-step recovery plan",
      "prevention": "1 prevention tip",
      "message": "Advice for farmer",
      "actionLevel": "Low/Medium/High"
    }
  `;

  let resultData = null;

  if (USE_OLLAMA) {
    console.log("📸 [Ollama] Fast-track vision analysis...");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); 

      const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'llava',
          prompt: prompt,
          images: [base64Data],
          stream: false,
          options: { 
            temperature: 0.1,
            num_predict: 120, // REDUCED for speed
            num_thread: 4
          }
        })
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const ollamaRes = await response.json() as any;
        const rawResponse = ollamaRes.response;
        const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
        resultData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      }
    } catch (err: any) {
      console.error("❌ [Ollama] Vision timeout/failed");
    }
  }

  if (!resultData && process.env.GEMINI_API_KEY) {
    console.log("💎 [Gemini] High-speed flash analysis...");
    try {
      const text = await generateGeminiTextFromContent(
        [
          prompt,
          { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
        ],
        'gemini-2.0-flash'
      );
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      resultData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (err: any) {
      console.error("🔥 [Gemini] failed");
    }
  }

  // Cache the successful result
  if (resultData) {
    detectionCache[imageHash] = resultData;
  }

  return resultData;
}

// ✅ SUPPORT BOTH ENDPOINTS
router.post('/scan', async (req, res) => {
  const { image } = req.body;
  const result = await performDetection(image);
  
  if (!result) {
    return res.status(500).json({ error: "Failed to detect disease" });
  }

  // ✅ RULE-BASED FILTER (Game Changer)
  const rawText = JSON.stringify(result).toLowerCase();
  if (
    rawText.includes("not sure") || 
    rawText.includes("unclear") || 
    rawText.includes("low confidence") ||
    result.status === 'NOT SURE'
  ) {
    result.status = 'NOT SURE';
    result.message = "⚠️ Please upload a clearer image. The current image is too blurry or symptoms are weak.";
  }

  // Map to legacy UI format for compatibility
  const mappedResult = {
    name: result.status === 'HEALTHY' ? 'Plant is Healthy' : 
          result.status === 'PEST' ? 'Pest Attack Detected' : (result.disease || result.status),
    status: result.status,
    message: result.message,
    observation: result.observation,
    confidence: result.confidence || "MEDIUM",
    medicine: {
      name: (result.status === 'DISEASED' || result.status === 'PEST') ? (result.treatment?.split('.')[0] || "Consult expert") : "None needed",
      dosage: (result.status === 'DISEASED' || result.status === 'PEST') ? "As per label" : "N/A",
      method: (result.status === 'DISEASED' || result.status === 'PEST') ? "Apply as directed" : "N/A",
      frequency: (result.status === 'DISEASED' || result.status === 'PEST') ? "See instructions" : "N/A"
    },
    prevention: result.prevention ? [result.prevention] : ["Continue regular care"],
    actionLevel: (result.status === 'DISEASED' || result.status === 'PEST') ? (result.actionLevel || "Medium") : "Low",
    details: result
  };

  res.json(mappedResult);
});

router.post('/detect', async (req, res) => {
  const { image } = req.body;
  const result = await performDetection(image);
  res.json(result);
});

export default router;
