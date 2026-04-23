import express from 'express';
import dotenv from 'dotenv';
import { generateGeminiText, toGeminiError } from '../gemini.ts';

dotenv.config();

const router = express.Router();

router.get('/live', async (req, res) => {
  const { lat = '12.9716', lon = '77.5946' } = req.query;
  const apiKey = process.env.ACCUWEATHER_API_KEY;

  if (!apiKey || apiKey.includes("YOUR_")) {
    return res.json({
      temp: 32,
      condition: "Sunny (Offline Mode)",
      humidity: 45,
      wind: 12,
      rain: 0,
      uv: 8,
      location: "Bangalore (Mock Data)"
    });
  }

  try {
    // Step 1: Get Location Key from coordinates
    const locUrl = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apiKey}&q=${lat},${lon}`;
    const locRes = await fetch(locUrl);
    const locData = await locRes.json();

    if (!locData.Key) throw new Error("Location not found");

    // Step 2: Get Current Conditions
    const weatherUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locData.Key}?apikey=${apiKey}&details=true`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    if (!weatherData || weatherData.length === 0) throw new Error("Weather data empty");

    const current = weatherData[0];

    res.json({
      temp: Math.round(current.Temperature.Metric.Value),
      condition: current.WeatherText,
      humidity: current.RelativeHumidity,
      wind: Math.round(current.Wind.Speed.Metric.Value),
      rain: current.PrecipitationSummary?.Precipitation?.Metric?.Value || 0,
      uv: current.UVIndex || 5,
      location: locData.EnglishName
    });
  } catch (error: any) {
    console.error('AccuWeather Error (using fallback):', error.message);
    res.json({
      temp: 30,
      condition: "Partly Cloudy",
      humidity: 50,
      wind: 10,
      rain: 0,
      uv: 6,
      location: "Your Farm"
    });
  }
});

router.post('/ai-advice', async (req, res) => {
  const { location, weatherData } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.json({ 
      advice: "Conditions are steady. Schedule irrigation for early morning to reduce water loss from evaporation." 
    });
  }

  try {
    const prompt = `
      You are an agricultural weather expert. 
      Location: ${location}
      Current Weather: ${JSON.stringify(weatherData)}

      Provide a short, 2-sentence farming advice based on this weather. 
      Focus on irrigation, planting, or harvesting.
    `;

    const text = await generateGeminiText(prompt, 'gemini-1.5-flash');

    res.json({ advice: text });
  } catch (error) {
    const gemErr = toGeminiError(error);
    console.error('Weather AI Error:', gemErr.message);
    res.json({
      advice: "With current conditions, ensure your crops have adequate moisture before the midday heat."
    });
  }
});

export default router;
