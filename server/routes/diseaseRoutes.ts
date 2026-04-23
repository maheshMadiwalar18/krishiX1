import express from 'express';
import dotenv from 'dotenv';
import { generateGeminiTextFromContent } from '../gemini.ts';

dotenv.config();

const router = express.Router();

const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
const USE_OLLAMA = process.env.USE_OLLAMA === 'true';

// ✅ SHARED SCAN LOGIC
async function performDetection(image: string) {
  const base64Data = image.includes(',') ? image.split(',')[1] : image;

  const prompt = `
    You are a high-precision plant analysis system. 
    Accuracy is more important than answering. 
    It is OK to say NOT SURE.

    FOLLOW THESE STEPS:

    Step 1: Describe visible features in the image (Color, Spots, Damage, Leaf condition).
    Step 2: Based ONLY on visible features, classify: HEALTHY, DISEASED, PEST, or NOT SURE.
    Step 3: Apply "HEALTHY BIAS" - If there are no strong, clear symptoms of disease or pests, you MUST default to HEALTHY.
    Step 4: Only if DISEASED or PEST: Provide Disease/Pest name, Symptoms (from image only), Treatment, and Prevention.

    Return ONLY a JSON object with this exact structure:
    {
      "observation": "Detailed visual description from Step 1",
      "status": "HEALTHY / DISEASED / PEST / NOT SURE",
      "confidence": "LOW / MEDIUM / HIGH",
      "disease": "Name (only if confident)",
      "symptoms": "Visible symptoms only",
      "treatment": "Practical steps",
      "prevention": "Prevention tips",
      "message": "Final advice to farmer",
      "actionLevel": "Low/Medium/High"
    }
  `;

  let resultData = null;

  if (USE_OLLAMA) {
    console.log("📸 [Ollama] Analyzing plant image...");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout for vision

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
            num_predict: 300, // Limit tokens for speed
            num_thread: 4    // Use more threads if available
          }
        })
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const ollamaRes = await response.json() as any;
        const rawResponse = ollamaRes.response;
        console.log("✅ [Ollama] Vision analysis complete");
        const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
        resultData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      }
    } catch (err: any) {
      console.error("❌ [Ollama] Vision failed/timeout:", err.message);
    }
  }

  // Gemini Fallback (Faster Model)
  if (!resultData && process.env.GEMINI_API_KEY) {
    console.log("💎 [Gemini] Falling back to Gemini 2.0 Flash Vision...");
    try {
      const text = await generateGeminiTextFromContent(
        [
          prompt,
          { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
        ],
        'gemini-2.0-flash' // Upgraded to 2.0-flash for speed
      );
      console.log("✅ [Gemini] Vision analysis complete");
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      resultData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (err: any) {
      console.error("🔥 [Gemini] Vision failed:", err.message);
    }
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
