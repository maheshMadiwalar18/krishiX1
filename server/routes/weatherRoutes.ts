import express from 'express';
import dotenv from 'dotenv';
import { generateGeminiText } from '../gemini.ts';

dotenv.config();

const router = express.Router();
const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
const USE_OLLAMA = process.env.USE_OLLAMA === 'true';

// ✅ PERFORMANCE: Cache for climate predictions to avoid redundant AI calls
const climateCache: Record<string, any> = {};

async function getClimatePrediction(temp: number, rain: number, humidity: number) {
  // Bucketing for better cache hit rate (round to nearest values)
  const bucketKey = `${Math.round(temp)}-${Math.round(rain/5)*5}-${Math.round(humidity/5)*5}`;
  
  if (climateCache[bucketKey]) {
    console.log("⚡ [Weather Cache] Serving instant climate insight");
    return climateCache[bucketKey];
  }

  let ruleAlert = "";
  let ruleDiseases: string[] = [];
  let risk = "Green";

  // Rain Logic
  if (rain >= 70) {
    ruleAlert = "⚠️ Heavy rain expected. Take precautions.";
    ruleDiseases = ["Fungal infections", "Leaf blight", "Root rot", "Downy mildew"];
    risk = "Red";
  } 
  // Heat Logic
  else if (temp >= 35) {
    ruleAlert = "⚠️ Extreme heat detected. Protect crops.";
    ruleDiseases = ["Leaf scorch", "Wilt", "Heat stress", "Pest attacks"];
    risk = "Red";
  }
  // Humidity Logic
  else if (humidity >= 80) {
    ruleAlert = "⚠️ High humidity. Disease risk increased.";
    ruleDiseases = ["Powdery mildew", "Bacterial leaf spot", "Fungal growth"];
    risk = "Orange";
  }

  // AI PREDICTION
  const prompt = `
    You are an agriculture expert.
    Analyze these conditions: Temp ${temp}°C, Rain ${rain}%, Humidity ${humidity}%.
    
    Provide:
    1. Risk Level (Low/Medium/High)
    2. WHY this risk occurs (Simple explanation)
    3. Possible Problems (List diseases/pests)
    4. PRECAUTIONS (3-5 practical steps)
    
    Return ONLY JSON:
    {
      "risk": "High/Medium/Low",
      "reason": "Simple explanation of why the risk is high",
      "problems": ["Disease 1", "Disease 2"],
      "precautions": ["Action 1", "Action 2", "Action 3"]
    }
  `;

  let aiResult = null;
  if (USE_OLLAMA) {
    console.log("🤖 [Ollama] Predicting climate risks...");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: process.env.OLLAMA_MODEL || 'phi3:latest',
          prompt: prompt,
          stream: false,
          format: 'json',
          options: { num_predict: 200 }
        })
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const resJson = await response.json() as any;
        aiResult = JSON.parse(resJson.response);
        console.log("✅ [Ollama] Weather prediction success");
      }
    } catch (e) {
      console.error("❌ [Ollama] Weather Prediction failed/timeout");
    }
  }

  if (!aiResult && process.env.GEMINI_API_KEY) {
    console.log("💎 [Gemini] Falling back to Gemini 2.0 Flash...");
    try {
      const text = await generateGeminiText(prompt, 'gemini-2.0-flash');
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      aiResult = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      console.log("✅ [Gemini] Weather prediction success");
    } catch (e) {
      console.error("🔥 [Gemini] Weather Prediction failed");
    }
  }

  const result = {
    alert: ruleAlert || (aiResult?.risk === 'High' ? "High climate risk detected" : "Climate conditions stable"),
    risk: aiResult?.risk || (risk === 'Red' ? "High" : risk === 'Orange' ? "Medium" : "Low"),
    reason: aiResult?.reason || (ruleAlert ? "Weather conditions are crossing safe thresholds for your crops." : "No immediate climate threats found."),
    problems: aiResult?.problems || ruleDiseases,
    precautions: aiResult?.precautions || [
      "Ensure proper drainage in fields",
      "Monitor for pests daily",
      "Maintain regular irrigation schedule"
    ]
  };

  // Cache the result
  climateCache[bucketKey] = result;
  return result;
}

router.get('/live', async (req, res) => {
  const { lat = '23.2599', lon = '77.4126' } = req.query;
  
  try {
    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&daily=temperature_2m_max,precipitation_probability_max&timezone=auto`;
    const response = await fetch(openMeteoUrl);
    const data = await response.json();

    const currentTemp = Math.round(data.current.temperature_2m);
    const humidity = data.current.relative_humidity_2m;
    const rainProb = data.daily.precipitation_probability_max[0];

    const climatePrediction = await getClimatePrediction(currentTemp, rainProb, humidity);

    res.json({
      temp: currentTemp,
      humidity: humidity,
      rain: rainProb,
      location: "Your Farm",
      prediction: climatePrediction
    });

  } catch (error: any) {
    res.status(500).json({ error: "Weather service unavailable" });
  }
});

export default router;
