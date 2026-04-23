import React from 'react';
import { 
  CloudRain, 
  CloudSun, 
  Sun, 
  Wind, 
  Droplets, 
  ChevronLeft, 
  Thermometer,
  CloudLightning,
  Sprout,
  TrendingUp,
  AlertCircle,
  Calendar,
  MapPin,
  Brain,
  Droplet,
  Leaf,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

const forecast = [
  { day: 'Mon', temp: 32, icon: Sun, condition: 'Sunny' },
  { day: 'Tue', temp: 30, icon: CloudSun, condition: 'Partly Cloudy' },
  { day: 'Wed', temp: 28, icon: CloudRain, condition: 'Light Rain' },
  { day: 'Thu', temp: 29, icon: CloudRain, condition: 'Showers' },
  { day: 'Fri', temp: 31, icon: CloudSun, condition: 'Hazy' },
  { day: 'Sat', temp: 33, icon: Sun, condition: 'Clear' },
  { day: 'Sun', temp: 34, icon: Sun, condition: 'Clear' },
];

const recommendations = [
  { 
    crop: 'Wheat (Raj 3765)', 
    yield: '4.5 - 5.2 T/ha', 
    risk: 'Low', 
    reason: 'Ideal soil moisture and upcoming temperature windows.',
    sowingTime: 'Nov 15 - Dec 10',
    waterReq: 'Moderate (4-6 irrigations)',
    fertilizer: 'NPK 120:60:40 kg/ha'
  },
  { 
    crop: 'Mustard', 
    yield: '2.1 - 2.5 T/ha', 
    risk: 'Medium', 
    reason: 'Subject to aphid risk in current humidity levels.',
    sowingTime: 'Oct 1 - Oct 25',
    waterReq: 'Low (1-2 irrigations)',
    fertilizer: 'NPK 60:40:40 kg/ha'
  }
];

export default function WeatherRecommendation({ onBack, userLocation = "Your Farm - Karnataka" }: { onBack: () => void, userLocation?: string }) {
  const { t } = useLanguage();
  return (
    <div className="max-w-5xl mx-auto space-y-6">
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
            {userLocation}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Current & Forecast & AI Insight */}
        <div className="lg:col-span-2 space-y-6">
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
                  <h2 className="text-7xl font-display font-light tracking-tighter">32°C</h2>
                  <div className="pb-2">
                    <p className="text-xl font-medium text-white/90">Mostly Sunny</p>
                    <p className="text-sm text-white/70 flex items-center gap-1 mt-1">
                      <Thermometer size={14} /> Feels like 34°C
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                  <Droplets className="text-blue-300 mb-1" size={18} />
                  <p className="text-[10px] uppercase tracking-widest text-white/60 mb-0.5 font-bold">{t('weather_humidity')}</p>
                  <p className="text-base font-bold text-white">45%</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                  <Wind className="text-teal-300 mb-1" size={18} />
                  <p className="text-[10px] uppercase tracking-widest text-white/60 mb-0.5 font-bold">{t('weather_wind')}</p>
                  <p className="text-base font-bold text-white">14 km/h</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                  <CloudRain className="text-indigo-300 mb-1" size={18} />
                  <p className="text-[10px] uppercase tracking-widest text-white/60 mb-0.5 font-bold">{t('weather_rain')}</p>
                  <p className="text-base font-bold text-white">5%</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                  <Sun className="text-yellow-300 mb-1" size={18} />
                  <p className="text-[10px] uppercase tracking-widest text-white/60 mb-0.5 font-bold">UV Index</p>
                  <p className="text-base font-bold text-white">High (8)</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button className="flex-1 sm:flex-none bg-white text-green-800 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-green-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                  <Info size={16} /> {t('weather_view_advice')}
                </button>
                <button className="flex-1 sm:flex-none bg-green-700/50 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-green-700/70 border border-green-500/30 transition-colors flex items-center justify-center gap-2 backdrop-blur-sm">
                  <Droplet size={16} /> {t('weather_plan_irrigation')}
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
                With a steady temperature around 32°C and low rain probability, the upcoming week is perfect for soil preparation. However, high UV index means you should schedule active irrigation during early morning or late evening to minimize evaporation loss.
              </p>
            </div>
          </motion.div>

          {/* 7-Day Forecast */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-neutral-900 text-lg">{t('weather_forecast')}</h3>
              <button className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors">See full</button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
              {forecast.map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  key={item.day}
                  className="min-w-[90px] bg-white p-4 rounded-2xl border border-neutral-100 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:border-green-200 transition-all cursor-pointer group"
                >
                  <p className="text-xs font-bold text-neutral-400 mb-2 uppercase group-hover:text-green-600 transition-colors">{item.day}</p>
                  <item.icon size={26} className="text-neutral-700 mb-3 group-hover:text-green-500 transition-colors group-hover:scale-110 transform" strokeWidth={1.5} />
                  <p className="text-xl font-black text-neutral-900 mb-1">{item.temp}°</p>
                  <p className="text-[10px] text-neutral-500 font-medium leading-tight whitespace-nowrap">{item.condition}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Recommendations */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 border border-green-100">
                <Sprout size={20} />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 text-xl">{t('weather_crop_rec')}</h3>
                <p className="text-xs text-neutral-500">{t('weather_based')}</p>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              {recommendations.map((rec, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  key={rec.crop}
                  className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200/60 relative group hover:bg-white hover:border-green-300 hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-neutral-900 text-lg mb-1">{rec.crop}</h4>
                      <div className="flex items-center gap-1.5 font-bold text-sm text-neutral-700 bg-white px-2.5 py-1 rounded-md border border-neutral-200 inline-flex shadow-sm">
                        <TrendingUp size={14} className="text-green-600" />
                        {rec.yield}
                      </div>
                    </div>
                    <span className={cn(
                      "text-[10px] font-extrabold px-2.5 py-1 rounded-full border shadow-sm",
                      rec.risk === 'Low' ? "bg-green-50 text-green-700 border-green-200" : "bg-orange-50 text-orange-700 border-orange-200"
                    )}>
                      {rec.risk} RISK
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm border-b border-neutral-100 pb-2">
                      <span className="text-neutral-500 flex items-center gap-2"><Calendar size={14} /> {t('weather_sowing')}</span>
                      <span className="font-semibold text-neutral-800">{rec.sowingTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm border-b border-neutral-100 pb-2">
                      <span className="text-neutral-500 flex items-center gap-2"><Droplet size={14} /> {t('weather_water')}</span>
                      <span className="font-semibold text-neutral-800">{rec.waterReq}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm border-b border-neutral-100 pb-2">
                      <span className="text-neutral-500 flex items-center gap-2"><Leaf size={14} /> {t('weather_fertilizer')}</span>
                      <span className="font-semibold text-neutral-800">{rec.fertilizer}</span>
                    </div>
                  </div>

                  <div className="bg-neutral-100/50 p-3 rounded-xl border border-neutral-200/50 mb-4">
                    <p className="text-xs text-neutral-600 leading-relaxed flex items-start gap-2">
                      <Info size={14} className="shrink-0 mt-0.5 text-neutral-400" />
                      {rec.reason}
                    </p>
                  </div>
                  
                  <button className="w-full py-2.5 bg-neutral-900 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-md">
                    {t('weather_view_details')}
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100">
              <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={16} />
                <p className="text-[11px] text-blue-900/80 leading-relaxed">
                  <strong>Disclaimer:</strong> Recommendations rely on historical data and weather forecasts. For maximum accuracy, update your Soil Health Card in the settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
