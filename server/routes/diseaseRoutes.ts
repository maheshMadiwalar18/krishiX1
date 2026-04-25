import express from 'express';
import dotenv from 'dotenv';
import crypto from 'crypto';

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

  console.log("🚀 [Ollama] Deep-scanning plant image...");
  let resultData = null;

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
          prompt: `Analyze this image. What plant is this? Is it healthy or does it have a disease/pest? If diseased, name the disease. Provide a 1-sentence observation. Return ONLY as JSON: {"name": "...", "status": "DISEASED/HEALTHY", "observation": "..."}`,
          images: [base64Data],
          stream: false,
          options: { temperature: 0.2, num_predict: 200, keep_alive: "30m" }
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
            // Validate it's not just the template
            if (parsed.status && !parsed.status.includes("|")) {
              resultData = parsed;
            }
          } catch (e) {
            console.warn("⚠️ JSON parse error");
          }
        }

        // Improved Text Fallback
        if (!resultData && rawResponse.length > 5) {
          const lower = rawResponse.toLowerCase();
          const isHealthy = lower.includes("healthy") && !lower.includes("diseased");
          const isPest = lower.includes("pest") || lower.includes("insect");
          
          resultData = {
            name: "Plant Analysis",
            status: isHealthy ? "HEALTHY" : (isPest ? "PEST" : "DISEASED"),
            confidence: "MEDIUM",
            observation: rawResponse.substring(0, 150),
            details: { elaborateIssue: rawResponse, treatment: "Remove affected parts and use organic controls." }
          };
        }
      }
    } catch (err: any) {
      console.error(`❌ Connection error:`, err.message);
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
    result.details = { elaborateIssue: "Stress detected.", damageExtent: "Local.", treatment: "Standard care." };
  }
  if (!Array.isArray(result.prevention)) {
    result.prevention = ["Maintain soil moisture", "Ensure proper spacing"];
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