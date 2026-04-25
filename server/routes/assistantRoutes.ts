import express from 'express';
import dotenv from 'dotenv';
import { generateGeminiText } from '../gemini.js';

dotenv.config();

const router = express.Router();

// Ollama Config
const useOllama = process.env.USE_OLLAMA === 'true';
const ollamaModel = process.env.OLLAMA_MODEL || 'phi3:latest'; 

console.log("🛠️ [Assistant] Route Initialized", { useOllama, ollamaModel });

// ✅ PERFORMANCE: Simple in-memory cache
const cache: Record<string, string> = {};

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      console.log("⚠️ [Assistant] Empty message received");
      return res.status(400).json({ reply: "Message required" });
    }

    // ✅ PERFORMANCE: Return cached result instantly
    if (cache[message]) {
      console.log("⚡ [Cache] Serving instant response");
      return res.json({ reply: cache[message] });
    }

    let text = "";

    // 1. Try Ollama (Master Dual-Stack Connection)
    if (useOllama) {
      console.log(`🤖 [Assistant] Querying Ollama (${ollamaModel})...`);
      
      const urls = ['http://127.0.0.1:11434/api/generate', 'http://localhost:11434/api/generate'];
      
      for (const url of urls) {
        if (text) break;
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(12000), 
            body: JSON.stringify({
              model: ollamaModel,
              prompt: `Answer as KrishiX AI (simple English, max 3 sentences). Question: "${message}"`,
              stream: false,
              options: { num_predict: 200, temperature: 0.6, keep_alive: "15m" }
            })
          });

          if (response.ok) {
            const data = await response.json() as any;
            text = data.response;
            console.log(`✅ [Assistant] Response from ${url}`);
          }
        } catch (ollamaErr: any) {
          console.error(`❌ [Assistant] Failed on ${url}:`, ollamaErr.message);
        }
      }
    }

    // 2. Try Gemini Fallback
    if (!text && process.env.GEMINI_API_KEY) {
      console.log("💎 [Gemini] Calling cloud fallback...");
      try {
        const prompt = `Answer as KrishiX AI (simple English, max 3 sentences). Question: "${message}"`;
        text = await generateGeminiText(prompt, "gemini-1.5-flash");
        console.log("✅ [Gemini] Response received");
      } catch (geminiErr: any) {
        console.error("🔥 [Gemini] Error:", geminiErr.message);
      }
    }

    if (!text) {
      return res.status(503).json({
        reply: "I'm having a little trouble connecting to my brain right now. Please make sure Ollama is running and try again!"
      });
    }

    // ✅ PERFORMANCE: Store in cache
    cache[message] = text;
    return res.json({ reply: text });

  } catch (error: any) {
    console.error("🔥 [Critical] Assistant Crash:", error.stack || error.message);
    return res.status(500).json({ reply: "An internal server error occurred." });
  }
});

export default router;