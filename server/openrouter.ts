import dotenv from 'dotenv';

dotenv.config();

export async function generateOpenRouterText(prompt: string, model = 'google/gemini-2.0-flash-001'): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set');
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AgriGuru"
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json() as any;
      throw new Error(errorData?.error?.message || `OpenRouter error: ${response.statusText}`);
    }

    const data = await response.json() as any;
    return data.choices[0].message.content;
  } catch (err: any) {
    console.error('OpenRouter error:', err.message);
    throw err;
  }
}

export async function generateOpenRouterMultimodal(prompt: string, imageBase64: string, model = 'google/gemini-2.0-flash-001'): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set');
  }

  // Ensure imageBase64 has the data URI prefix if it's just raw base64
  const imageUrl = imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AgriGuru"
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json() as any;
      throw new Error(errorData?.error?.message || `OpenRouter error: ${response.statusText}`);
    }

    const data = await response.json() as any;
    return data.choices[0].message.content;
  } catch (err: any) {
    console.error('OpenRouter multimodal error:', err.message);
    throw err;
  }
}
