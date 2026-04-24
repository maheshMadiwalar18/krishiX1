import React from 'react';
import { 
  CloudRain, 
  CloudSun, 
  Sun, 
  Wind, 
  Droplets, 
  ChevronLeft, 
  Thermometer,
  Calendar,
  MapPin,
  Brain,
  Droplet,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';

const forecast = [
  { day: 'Mon', temp: 32, icon: Sun, condition: 'Sunny' },
  { day: 'Tue', temp: 30, icon: CloudSun, condition: 'Partly Cloudy' },
  { day: 'Wed', temp: 28, icon: CloudRain, condition: 'Light Rain' },
  { day: 'Thu', temp: 29, icon: CloudRain, condition: 'Showers' },
  { day: 'Fri', temp: 31, icon: CloudSun, condition: 'Hazy' },
  { day: 'Sat', temp: 33, icon: Sun, condition: 'Clear' },
  { day: 'Sun', temp: 34, icon: Sun, condition: 'Clear' },
];

export default function WeatherRecommendation({ onBack, userLocation = "Your Farm - Karnataka" }: { onBack: () => void, userLocation?: string }) {
  const { t } = useLanguage();

  const [weatherData, setWeatherData] = React.useState<any>(null);
  const [aiAdvice, setAiAdvice] = React.useState<string>("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const CACHE_KEY = 'krushix_weather_cache';
    const CACHE_TIME = 20 * 60 * 1000; // 20 minutes

    const fetchWeatherAndAdvice = async (isBackground = false) => {
      if (!isBackground) setLoading(true);
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s Timeout for AI processing

        const weatherRes = await fetch('/api/weather/live', { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!weatherRes.ok) throw new Error("Weather API failed");
        
        const weather = await weatherRes.json();
        setWeatherData(weather);

        if (weather.prediction) {
          const advice = weather.prediction.reason || "Weather conditions are optimal for crop growth.";
          setAiAdvice(advice);
          
          // Store in cache
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: weather,
            advice: advice,
            timestamp: Date.now()
          }));
        }
      } catch (error) {
        console.error("Weather fetch failed:", error);
        if (!isBackground && !weatherData) {
          // ⚡ FALLBACK: Show mock data if everything fails so UI doesn't look broken
          setWeatherData({
            temp: 28,
            humidity: 65,
            wind: 12,
            rain: 5,
            uv: 4,
            condition: "Cloudy (Offline)",
            location: "Offline Mode",
            prediction: {
              risk: "Normal",
              alert: "Offline: Using estimated data",
              reason: "We couldn't connect to the live weather server. Showing typical conditions for your region."
            }
          });
          setAiAdvice("Unable to fetch live AI advice. Showing offline estimates.");
        }
      } finally {
        setLoading(false);
      }
    };

    // ⚡ INSTANT UI: Load from cache first
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        const { data, advice, timestamp } = parsed;
        const isExpired = Date.now() - timestamp > CACHE_TIME;

        // ⚡ CACHE FIX: If old cache doesn't have wind/uv, force a refresh
        const isOldVersion = data.wind === undefined || data.uv === undefined;

        setWeatherData(data);
        setAiAdvice(advice);
        
        if (!isExpired && !isOldVersion) {
          setLoading(false);
          // Refresh in background to keep it fresh
          fetchWeatherAndAdvice(true);
          return;
        }
      }
    } catch (e) {
      console.warn("Weather cache corrupted, clearing...");
      localStorage.removeItem(CACHE_KEY);
    }

    fetchWeatherAndAdvice();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="font-bold text-text/60 tracking-tight">Fetching Live Weather & AI Advice...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <button 
          onClick={onBack}
          className="w-10 h-10 bg-white border border-neutral-200 rounded-xl flex items-center justify-center text-neutral-700 hover:bg-neutral-50 hover:text-green-700 transition-all shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-display font-extrabold text-neutral-900">{t('weather_title')}</h1>
          <p className="text-neutral-500 text-sm flex items-center gap-1 mt-1">
            <MapPin size={14} className="text-green-600" />
            {weatherData?.location || userLocation}
          </p>
        </div>
      </div>

      {/* ✅ SMART CLIMATE ALERT & DISEASE PREDICTION SECTION */}
      {weatherData?.prediction && (weatherData.prediction.risk === 'High' || weatherData.prediction.risk === 'Medium') && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-6 rounded-[2rem] border-2 shadow-sm flex flex-col gap-4",
            weatherData.prediction.risk === 'High' ? "bg-red-50 border-red-200 text-red-900" :
            weatherData.prediction.risk === 'Medium' ? "bg-yellow-50 border-yellow-200 text-yellow-900" :
            weatherData.prediction.risk === 'Normal' ? "bg-emerald-50 border-emerald-200 text-emerald-900" :
            "bg-green-50 border-green-200 text-green-900"
          )}
        >
          {/* 1. Risk Level & Alert Header */}
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0",
                weatherData.prediction.risk === 'High' ? "bg-red-100" :
                weatherData.prediction.risk === 'Medium' ? "bg-orange-100" :
                "bg-green-100"
              )}>
                {weatherData.prediction.risk === 'High' ? '🚨' : weatherData.prediction.risk === 'Medium' ? '⚠️' : '✅'}
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight leading-tight">{weatherData.prediction.alert}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">
                  Climate Risk Status: {weatherData.prediction.risk}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Why this risk? */}
          <div className="bg-white/40 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2 flex items-center gap-2">
              <span className="w-4 h-4 bg-white rounded-full flex items-center justify-center text-[8px]">❓</span>
              Why this risk?
            </p>
            <p className="text-sm font-bold leading-relaxed">
              {weatherData.prediction.reason}
            </p>
          </div>

          {/* 3. Possible Problems */}
          {weatherData.prediction.problems?.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2 flex items-center gap-2">
                <span className="w-4 h-4 bg-white rounded-full flex items-center justify-center text-[8px]">🐛</span>
                Possible Problems
              </p>
              <div className="flex flex-wrap gap-2">
                {weatherData.prediction.problems.map((d: string, i: number) => (
                  <span key={i} className={cn(
                    "px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border",
                    weatherData.prediction.risk === 'High' ? "bg-red-200/50 border-red-300" :
                    weatherData.prediction.risk === 'Medium' ? "bg-orange-200/50 border-orange-300" :
                    "bg-green-200/50 border-green-300"
                  )}>
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 4. What should you do? (Precautions) */}
          {weatherData.prediction.precautions?.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1 flex items-center gap-2">
                <span className="w-4 h-4 bg-white rounded-full flex items-center justify-center text-[8px]">🛠️</span>
                What should you do?
              </p>
              <div className="grid grid-cols-1 gap-2">
                {weatherData.prediction.precautions.map((p: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 bg-white/30 p-3 rounded-xl border border-white/10 group hover:bg-white/50 transition-all">
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[10px] font-black shadow-sm group-hover:scale-110 transition-transform">
                      {i + 1}
                    </div>
                    <p className="text-xs font-bold">{p}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      <div className="space-y-6">
        {/* Current Weather Card */}
        <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-700 group-hover:scale-110">
            <CloudSun size={200} />
          </div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-white/90 font-medium bg-black/20 w-fit px-3 py-1.5 rounded-full text-sm backdrop-blur-sm border border-white/10">
                  <Calendar size={14} />
                  <span>Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">Live</span>
              </div>
              
              <div className="flex items-end gap-4 mb-6">
                <h2 className="text-7xl font-display font-light tracking-tighter">{weatherData?.temp}°C</h2>
                <div className="pb-2">
                  <p className="text-xl font-medium text-white/90">{weatherData?.condition}</p>
                  <p className="text-sm text-white/70 flex items-center gap-1 mt-1">
                    <Thermometer size={14} /> Feels like {weatherData ? weatherData.temp + 2 : '--'}°C
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                <Droplets className="text-blue-300 mb-1" size={18} />
                <p className="text-[10px] uppercase tracking-widest text-white/60 mb-0.5 font-bold">{t('weather_humidity')}</p>
                <p className="text-base font-bold text-white">{weatherData?.humidity}%</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                <Wind className="text-teal-300 mb-1" size={18} />
                <p className="text-[10px] uppercase tracking-widest text-white/60 mb-0.5 font-bold">{t('weather_wind')}</p>
                <p className="text-base font-bold text-white">{weatherData?.wind} km/h</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                <CloudRain className="text-indigo-300 mb-1" size={18} />
                <p className="text-[10px] uppercase tracking-widest text-white/60 mb-0.5 font-bold">{t('weather_rain')}</p>
                <p className="text-base font-bold text-white">{weatherData?.rain} mm</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                <Sun className="text-yellow-300 mb-1" size={18} />
                <p className="text-[10px] uppercase tracking-widest text-white/60 mb-0.5 font-bold">UV Index</p>
                <p className="text-base font-bold text-white">{weatherData?.uv}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button className="flex-1 sm:flex-none bg-white text-green-800 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-green-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                <Info size={16} /> {t('weather_view_advice')}
              </button>
            </div>
          </div>
        </div>

        {/* AI Insight Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-100 p-5 rounded-2xl flex gap-4 items-start shadow-sm"
        >
          <div className="w-10 h-10 rounded-full bg-green-200/50 flex items-center justify-center shrink-0">
            <Brain size={20} className="text-green-700" />
          </div>
          <div>
            <h4 className="font-bold text-green-900 text-sm mb-1">{t('weather_ai_insight')}</h4>
            <p className="text-sm text-green-800/80 leading-relaxed">
              {aiAdvice}
            </p>
          </div>
        </motion.div>

        {/* 7-Day Forecast */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-neutral-900 text-lg">{t('weather_forecast')}</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
            {forecast.map((item, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                key={item.day}
                className="min-w-[100px] flex-1 bg-white p-6 rounded-2xl border border-neutral-100 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:border-green-200 transition-all cursor-pointer group"
              >
                <p className="text-xs font-bold text-neutral-400 mb-2 uppercase group-hover:text-green-600 transition-colors">{item.day}</p>
                <item.icon size={32} className="text-neutral-700 mb-3 group-hover:text-green-500 transition-colors group-hover:scale-110 transform" strokeWidth={1.5} />
                <p className="text-2xl font-black text-neutral-900 mb-1">{item.temp}°</p>
                <p className="text-xs text-neutral-500 font-medium leading-tight whitespace-nowrap">{item.condition}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

