import express from 'express';
import dotenv from 'dotenv';
import { generateGeminiText } from '../gemini.js';

dotenv.config();

const router = express.Router();

// Ollama Config
const useOllama = process.env.USE_OLLAMA === 'true';
const ollamaModel = process.env.OLLAMA_MODEL || 'phi3:latest'; 
const ollamaUrl = 'http://127.0.0.1:11434/api/generate';

console.log("🛠️ [Assistant] Route Initialized", { useOllama, ollamaModel, ollamaUrl });

// ✅ PERFORMANCE: Simple in-memory cache
const cache: Record<string, string> = {};

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message required" });
    }

    // ✅ PERFORMANCE: Return cached result instantly
    if (cache[message]) {
      console.log("⚡ [Cache] Serving instant response");
      return res.json({ reply: cache[message] });
    }

    let text = "";

    // 1. Try Ollama (Optimized for speed)
    if (useOllama) {
      console.log(`🤖 [Ollama] Sending request: "${message}"`);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout for snappier fallback

        const response = await fetch(ollamaUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            model: ollamaModel,
            prompt: `
              Answer as KrishiX AI (simple English, max 3 sentences, practical advice).
              Farmer Question: "${message}"
            `,
            stream: false,
            options: {
              num_predict: 120, // Fast output
              temperature: 0.6,
              keep_alive: "10m" // Keep model warm
            }
          })
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json() as any;
          text = data.response;
          console.log("✅ [Ollama] Response received successfully");
        } else {
          console.error(`❌ [Ollama] HTTP Error: ${response.status}`);
        }
      } catch (ollamaErr: any) {
        console.error("❌ [Ollama] Connection failed/timeout:", ollamaErr.message);
      }
    }

    // 2. Try Gemini Fallback
    if (!text) {
      console.log("💎 [Gemini] Falling back to cloud AI...");
      try {
        const prompt = `
          Answer as KrishiX AI (simple English, max 3 sentences).
          Farmer Question: "${message}"
        `;

        text = await generateGeminiText(prompt, "gemini-1.5-flash");
        console.log("✅ [Gemini] Response received");
      } catch (geminiErr: any) {
        console.error("🔥 [Gemini] Critical failure:", geminiErr.message);
      }
    }

    if (!text) {
      return res.status(503).json({
        reply: "Sorry, I am having trouble connecting to my brain. Please try again in 10 seconds."
      });
    }

    // ✅ PERFORMANCE: Store in cache
    cache[message] = text;

    return res.json({ reply: text });

  } catch (error: any) {
    console.error("🔥 [Critical] Server Error:", error.message);
    return res.status(500).json({
      reply: "I am resting right now. Please try again later."
    });
  }
});

export default router;