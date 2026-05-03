import dotenv from 'dotenv';
dotenv.config();
import { generateGeminiText } from '../server/gemini.ts';

async function testGemini() {
  console.log("Testing Gemini API...");
  try {
    const text = await generateGeminiText("Hi, are you working?", "gemini-2.0-flash");
    console.log("Gemini Success:", text);
  } catch (e) {
    console.error("Gemini Failed:", e.message);
  }
}

async function testOllama() {
  console.log("Testing Ollama...");
  try {
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'phi3:latest',
        prompt: 'Hi',
        stream: false
      })
    });
    if (res.ok) {
      const data = await res.json();
      console.log("Ollama Success:", data.response);
    } else {
      console.log("Ollama Error:", res.status);
    }
  } catch (e) {
    console.error("Ollama Failed:", e.message);
  }
}

testGemini();
testOllama();
