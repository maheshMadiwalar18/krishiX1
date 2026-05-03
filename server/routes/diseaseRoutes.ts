import express from 'express';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { generateOpenRouterMultimodal } from '../openrouter.js';

dotenv.config();

const router = express.Router();

// ✅ Cache
const detectionCache: Record<string, any> = {};
const CACHE_VERSION = 'v11-PROPER-FIX';

// ✅ SHARED SCAN LOGIC
async function performDetection(image: string) {
  const base64Data = image.includes(',') ? image.split(',')[1] : image;
  const imageHash = crypto.createHash('md5').update(base64Data + CACHE_VERSION).digest('hex');

  if (detectionCache[imageHash]) {
    console.log("⚡ [Cache] Purging old results...");
    // delete detectionCache[imageHash]; // Optional: Force fresh every time
  }

  let resultData = null;

  if (process.env.USE_OLLAMA === 'true') {
    console.log("🚀 [Ollama] Deep-scanning plant image...");
    const urls = ['http://127.0.0.1:11434/api/generate', 'http://localhost:11434/api/generate'];
    
    for (const url of urls) {
      if (resultData) break;

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(60000),
          body: JSON.stringify({
            model: 'llava',
            prompt: `Expert Pathologist Scan. Identify plant and issue. Status: HEALTHY/DISEASED/PEST. 
Return ONLY JSON: {"name": "Plant - Issue", "status": "...", "observation": "...", "confidence": "HIGH/MEDIUM/LOW", "details": {"elaborateIssue": "...", "damageExtent": "...", "treatment": "..."}, "medicine": {"name": "...", "dosage": "...", "method": "...", "frequency": "..."}, "prevention": ["...", "...", "..."]}`,
            images: [base64Data],
            stream: false,
            options: { temperature: 0.1, num_predict: 300, keep_alive: "30m" }
          })
        });

        if (response.ok) {
          const ollamaRes = await response.json() as any;
          const rawResponse = ollamaRes.response || "";
          console.log("✅ [Ollama] Finished thinking");
          
          const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              const parsed = JSON.parse(jsonMatch[0]);
              if (parsed.status && !parsed.status.includes("|")) {
                resultData = parsed;
              }
            } catch (e) {
              console.warn("⚠️ JSON parse error");
            }
          }
        }
      } catch (err: any) {
        console.error(`❌ Connection error:`, err.message);
      }
    }
  }

  // Fallback to OpenRouter
  if (!resultData && process.env.USE_OPENROUTER === 'true') {
    console.log("🚀 [OpenRouter] Scanning plant image with High Precision...");
    try {
      const prompt = `You are an expert plant pathologist. Analyze this image with high precision.
1. Identify the plant species and issue.
2. Status must be HEALTHY, DISEASED, or PEST.
3. Provide confidence (HIGH/MEDIUM/LOW).
4. Suggest organic treatment (medicine) and 3 prevention steps.
5. Elaborate on the issue and damage extent.

Return ONLY as JSON:
{
  "name": "Plant Name - Issue Name",
  "status": "HEALTHY/DISEASED/PEST",
  "confidence": "HIGH/MEDIUM/LOW",
  "observation": "1-sentence summary",
  "details": {
    "elaborateIssue": "Detailed description of symptoms",
    "damageExtent": "Localized/Widespread",
    "treatment": "Advice for the farmer",
    "recoveryTimeline": "Estimated days to recovery",
    "proTip": "One unique pro-farmer tip"
  },
  "medicine": {
    "name": "Medicine/Fertilizer Name",
    "dosage": "Amount per unit",
    "method": "Spray/Soil Application",
    "frequency": "Frequency"
  },
  "prevention": ["Step 1", "Step 2", "Step 3"]
}`;
      const rawResponse = await generateOpenRouterMultimodal(prompt, base64Data);
      
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.status) {
            resultData = parsed;
            console.log("✅ [OpenRouter] Detailed analysis complete");
          }
        } catch (e) {
          console.warn("⚠️ OpenRouter JSON parse error");
        }
      }
    } catch (err: any) {
      console.error(`❌ OpenRouter error:`, err.message);
    }
  }

  if (!resultData) {
    resultData = {
      name: "Unable to detect",
      status: "NOT SURE",
      confidence: "LOW",
      observation: "AI response was unclear. Please try a closer, clearer photo.",
      message: "Please ensure the leaf is in focus and well-lit."
    };
  }

  detectionCache[imageHash] = resultData;
  return resultData;
}

// ✅ NORMALIZATION
function normalizeResult(rawResult: any) {
  if (!rawResult) return null;
  const result: any = { ...rawResult };

  result.name = result.name || "Unknown Plant";
  
  // Strict status mapping to prevent template-repeat errors
  const rawStatus = String(result.status || "").toUpperCase();
  if (rawStatus === "HEALTHY") result.status = "HEALTHY";
  else if (rawStatus === "PEST") result.status = "PEST";
  else if (rawStatus === "DISEASED") result.status = "DISEASED";
  else if (rawStatus.includes("HEALTH") && !rawStatus.includes("|")) result.status = "HEALTHY";
  else if (rawStatus.includes("PEST") && !rawStatus.includes("|")) result.status = "PEST";
  else result.status = "DISEASED";

  result.confidence = result.confidence || "MEDIUM";
  result.actionLevel = result.actionLevel || (result.status === 'HEALTHY' ? 'Low' : 'High');
  result.message = result.message || "Follow the recommended care plan.";
  result.observation = result.observation || "Symptoms observed on plant surface.";

  if (!result.medicine || typeof result.medicine !== 'object') {
    result.medicine = { name: "Organic Control", dosage: "Standard", method: "Foliar Spray", frequency: "Weekly" };
  }
  if (!result.details || typeof result.details !== 'object') {
    result.details = { 
      elaborateIssue: "Stress detected.", 
      damageExtent: "Local.", 
      treatment: "Standard care.",
      recoveryTimeline: "7-14 days",
      proTip: "Avoid overhead watering to reduce fungal spread."
    };
  } else {
    result.details.recoveryTimeline = result.details.recoveryTimeline || "7-14 days";
    result.details.proTip = result.details.proTip || "Avoid overhead watering to reduce fungal spread.";
  }
  if (!Array.isArray(result.prevention)) {
    result.prevention = ["Maintain soil moisture", "Ensure proper spacing", "Use clean tools"];
  }

  return result;
}

// ✅ ROUTES
router.post('/scan', async (req, res) => {
  const { image } = req.body;
  const rawResult = await performDetection(image);
  res.json(normalizeResult(rawResult));
});

router.post('/detect', async (req, res) => {
  const { image } = req.body;
  const rawResult = await performDetection(image);
  res.json(normalizeResult(rawResult));
});

export default router;