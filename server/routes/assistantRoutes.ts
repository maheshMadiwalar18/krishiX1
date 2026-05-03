import express from 'express';
import dotenv from 'dotenv';
import { generateGeminiText } from '../gemini.js';
import { generateOpenRouterText } from '../openrouter.js';

dotenv.config();

const router = express.Router();

// AI Config
const useOllama = process.env.USE_OLLAMA === 'true';
const useOpenRouter = process.env.USE_OPENROUTER === 'true';
const ollamaModel = process.env.OLLAMA_MODEL || 'phi3:latest'; 

console.log("🛠️ [Assistant] Route Initialized", { useOllama, useOpenRouter, ollamaModel });

// ✅ PERFORMANCE: Simple in-memory cache
const cache: Record<string, string> = {};

router.post("/chat", async (req, res) => {
  try {
    const { message, language = 'English' } = req.body;

    if (!message) {
      console.log("⚠️ [Assistant] Empty message received");
      return res.status(400).json({ reply: "Message required" });
    }

    const cacheKey = `${language}-${message}`;
    // ✅ PERFORMANCE: Return cached result instantly
    if (cache[cacheKey]) {
      console.log("⚡ [Cache] Serving instant response");
      return res.json({ reply: cache[cacheKey] });
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
              prompt: `Answer as KrishiX AI (in ${language}, max 3 sentences). Question: "${message}"`,
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

    // 2. Try OpenRouter
    if (!text && useOpenRouter) {
      console.log("🚀 [OpenRouter] Querying cloud API...");
      try {
        const prompt = `Answer as KrishiX AI (in ${language}, max 3 sentences). Question: "${message}"`;
        text = await generateOpenRouterText(prompt);
        console.log("✅ [OpenRouter] Response received");
      } catch (orErr: any) {
        console.error("❌ [OpenRouter] Error:", orErr.message);
      }
    }

    // 3. Try Gemini Fallback
    if (!text && process.env.GEMINI_API_KEY) {
      console.log("💎 [Gemini] Calling cloud fallback...");
      try {
        const prompt = `Answer as KrishiX AI (in ${language}, max 3 sentences). Question: "${message}"`;
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
    cache[cacheKey] = text;
    return res.json({ reply: text });

  } catch (error: any) {
    console.error("🔥 [Critical] Assistant Crash:", error.stack || error.message);
    return res.status(500).json({ reply: "An internal server error occurred." });
  }
});

export default router;