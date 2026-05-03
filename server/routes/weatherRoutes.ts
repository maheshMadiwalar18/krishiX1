import express from 'express';
import dotenv from 'dotenv';
import { generateGeminiText } from '../gemini.ts';
import { generateOpenRouterText } from '../openrouter.ts';

dotenv.config();

const router = express.Router();
const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
const USE_OLLAMA = process.env.USE_OLLAMA === 'true';
const USE_OPENROUTER = process.env.USE_OPENROUTER === 'true';

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
  let risk: 'Low' | 'Normal' | 'Medium' | 'High' = 'Normal';

  // 1. TEMPERATURE LOGIC (Farmer Standard)
  if (temp < 15) {
    risk = 'Low';
    ruleAlert = "Cool weather. Good for growth, but monitor for slow development.";
  } else if (temp >= 15 && temp <= 32) {
    risk = 'Normal';
    ruleAlert = "Ideal temperature for most crops. Keep regular schedules.";
  } else if (temp > 32 && temp <= 38) {
    risk = 'Medium';
    ruleAlert = "Warm weather detected. Ensure crops stay hydrated.";
    ruleDiseases = ["Heat stress", "Early wilt", "Increased pest activity"];
  } else if (temp > 38) {
    risk = 'High';
    ruleAlert = "🚨 Extreme heat warning! Risk of severe crop damage.";
    ruleDiseases = ["Leaf scorch", "Severe wilt", "Heat stroke in plants"];
  }

  // 2. MULTI-FACTOR ADJUSTMENT (Realistic Scaling)
  // Moderate heat + No rain is NOT high risk, just Medium.
  if (temp > 32 && temp <= 38 && rain < 10) {
    risk = 'Medium'; // Keep it at Medium, don't exaggerate to High
    ruleAlert += " Combined with low rain, maintain irrigation.";
  }

  // Only extreme rain is High
  if (rain >= 80) {
    risk = 'High';
    ruleAlert = "🚨 Heavy rain alert! Risk of waterlogging and soil erosion.";
    ruleDiseases = ["Fungal infections", "Root rot", "Downy mildew"];
  } else if (rain >= 60 && rain < 80) {
    risk = 'Medium';
    ruleAlert = "Moderate rain expected. Monitor field drainage.";
  }

  // High humidity + Cloudy = Pest Risk
  if (humidity > 85 && rain < 20) {
    risk = 'Medium';
    ruleAlert = "High humidity detected. Watch for fungal growth and pests.";
    ruleDiseases = ["Powdery mildew", "Rust", "Aphid activity"];
  }

  // AI PREDICTION (Updated with new rules)
  const prompt = `
    You are an agriculture expert. 
    Analyze: Temp ${temp}°C, Rain ${rain}%, Humidity ${humidity}%.
    
    Standards:
    - 20-32°C is IDEAL (Normal).
    - 32-38°C is MEDIUM RISK.
    - Above 38°C is CRITICAL (High).
    - Rain > 80% is HIGH RISK.
    - Rain 50-80% is MEDIUM RISK.
    
    CRITICAL: Do NOT exaggerate. If conditions are just warm (33°C) and dry, use "Medium" or "Normal". 
    Only use "High" for actual emergencies like floods or heat waves.
    
    Return ONLY JSON:
    {
      "risk": "High/Medium/Normal/Low",
      "reason": "Simple explanation",
      "problems": ["Prob 1", "Prob 2"],
      "precautions": ["Step 1", "Step 2"]
    }
  `;

  let aiResult = null;
  if (USE_OLLAMA) {
    console.log("🤖 [Ollama] Predicting climate risks...");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); 

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
  
  if (!aiResult && USE_OPENROUTER) {
    console.log("🚀 [OpenRouter] Predicting climate risks...");
    try {
      const text = await generateOpenRouterText(prompt);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      aiResult = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      console.log("✅ [OpenRouter] Weather prediction success");
    } catch (e) {
      console.error("❌ [OpenRouter] Weather Prediction failed");
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
    risk: aiResult?.risk || risk,
    reason: aiResult?.reason || "Based on current temperature and moisture levels.",
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
    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,precipitation_probability_max,uv_index_max&timezone=auto`;
    const response = await fetch(openMeteoUrl);
    const data = await response.json();

    if (!data.current || !data.daily) {
      throw new Error("Invalid data from weather service");
    }

    const currentTemp = Math.round(data.current.temperature_2m || 0);
    const humidity = data.current.relative_humidity_2m || 0;
    const windSpeed = Math.round(data.current.wind_speed_10m || 0);
    const uvIndex = (data.daily.uv_index_max && data.daily.uv_index_max[0]) || 0;
    const rainProb = (data.daily.precipitation_probability_max && data.daily.precipitation_probability_max[0]) || 0;

    const climatePrediction = await getClimatePrediction(currentTemp, rainProb, humidity);

    res.json({
      temp: currentTemp,
      humidity: humidity,
      wind: windSpeed,
      uv: uvIndex,
      rain: rainProb,
      location: "Your Farm",
      prediction: climatePrediction
    });

  } catch (error: any) {
    res.status(500).json({ error: "Weather service unavailable" });
  }
});

export default router;
