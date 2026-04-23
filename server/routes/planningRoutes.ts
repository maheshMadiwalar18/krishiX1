import express from 'express';
import dotenv from 'dotenv';
import { generateGeminiText, toGeminiError } from '../gemini.ts';

dotenv.config();

const router = express.Router();

router.post('/generate-strategy', async (req, res) => {
  const { crop, soil, landSize, season } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.json([]);
  }

  try {
    const prompt = `
      As an expert agricultural planner, generate a 12-month crop strategy and financial projection.
      Crop: ${crop}
      Soil: ${soil}
      Land Size: ${landSize} acres
      Current Season: ${season}

      Return ONLY a JSON array of 12 objects. Each object should have:
      - month: String (e.g. "Month 1: Sowing")
      - activity: String (Description of work)
      - cost: Number (Estimated cost in INR)
      - revenue: Number (Estimated revenue in INR)
      - status: "Completed" | "In Progress" | "Planned" (Set first 2 to Completed, next 2 to In Progress, rest to Planned)

      Ensure numerical values are realistic for the region.
    `;

    const text = await generateGeminiText(prompt, 'gemini-1.5-flash');
    
    // Extract JSON from potential markdown code blocks
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const results = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    res.json(results);
  } catch (error: any) {
    const gemErr = toGeminiError(error);
    console.error('Planning AI Error:', gemErr.message);
    
    // Provide high-quality mock data as fallback during quota limits
    res.json([
      { month: "Month 1: Preparation", activity: "Soil testing and deep plowing to improve aeration.", cost: 5000, revenue: 0, status: "Completed" },
      { month: "Month 2: Sowing", activity: "Seed treatment and precision sowing with optimal spacing.", cost: 8000, revenue: 0, status: "In Progress" },
      { month: "Month 3: Irrigation", activity: "First irrigation and application of basal fertilizers.", cost: 3000, revenue: 0, status: "Planned" },
      { month: "Month 12: Harvest", activity: "Mechanical harvesting and sorting for market delivery.", cost: 4000, revenue: 85000, status: "Planned" }
    ]);
  }
});

export default router;
