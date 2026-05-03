import React, { useState } from 'react';
import { 
  Droplet, 
  ChevronLeft, 
  Calendar,
  MapPin,
  Brain,
  Waves,
  Clock,
  ArrowRight,
  AlertTriangle,
  Lightbulb,
  Sprout,
  LandPlot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';

interface IrrigationPlan {
  when: string;
  amount: string;
  frequency: string;
  warning: string;
  tips: string[];
  insight: {
    method: string;
    reason: string;
    plan: string;
  };
}

export default function IrrigationPlanner({ onBack, userLocation = "Your Farm - Karnataka" }: { onBack: () => void, userLocation?: string }) {
  const { t } = useLanguage();
  const [view, setView] = useState<'form' | 'result'>('form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    crop: 'Maize',
    soil: 'Red Soil',
    irrigation: 'Borewell',
    land: '2',
    stage: 'Vegetative'
  });
  const [plan, setPlan] = useState<IrrigationPlan | null>(null);

  const handleGenerateStrategy = async () => {
    console.log("🌊 Generating irrigation strategy...");
    
    // 1. VALIDATE INPUTS
    const { crop, soil: soilType, irrigation: irrigationType, stage: plantStage, land: landSize } = formData;
    console.log("DEBUG - Plant Stage:", plantStage);

    if (!crop.trim() || !soilType || !irrigationType || !plantStage || !landSize) {
      alert(t('alert_fill_fields') || "Please fill all required fields before generating the strategy.");
      return;
    }

    setLoading(true);
    try {
      // 2. SEND DATA TO BACKEND
      const response = await fetch(`/api/irrigation/strategy?v=${Date.now()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop,
          soilType,
          irrigationType,
          plantStage,
          landSize
        })
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      // 3. HANDLE RESPONSE
      const data = await response.json();
      console.log("✅ Response Received:", data);
      
      const newPlan: IrrigationPlan = {
        when: plantStage === 'Seedling' ? "Early Morning (5:00 AM - 6:30 AM)" : "Early Morning or Evening",
        amount: irrigationType === 'Drip' ? `15-25 Liters per acre` : 
                irrigationType === 'Sprinkler' ? "30-45 mins runtime" : 
                "Standard soaking",
        frequency: soilType === 'Sandy' ? "Daily" : "Every 2-3 days",
        warning: "Avoid watering during peak sunlight (11 AM - 3 PM) to prevent evaporation loss.",
        tips: [
          `Monitor ${crop} leaf health for moisture stress`,
          "Ensure no water stagnation near root zone",
          "Check soil moisture 2 inches deep before watering"
        ],
        insight: {
          method: data.recommendedMethod || data.method || "Not Available",
          reason: data.reason || "No reason generated",
          plan: data.plan || "No plan available"
        }
      };
      
      setPlan(newPlan);
      setView('result');
    } catch (error: any) {
      console.error("❌ Irrigation Strategy Failed:", error.message);
      alert('Failed to generate plan. Please try again.');
    } finally {
      console.log("🔄 Loading finished.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={view === 'result' ? () => setView('form') : onBack}
          className="w-10 h-10 bg-white border border-neutral-200 rounded-xl flex items-center justify-center text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-all shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-display font-extrabold text-neutral-900">{t('irrigation_title')}</h1>
          <p className="text-neutral-500 text-sm flex items-center gap-1 mt-1">
            <MapPin size={14} className="text-primary" />
            {userLocation}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'form' ? (
          <motion.div 
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto bg-white rounded-3xl border border-border p-8 shadow-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text/40 uppercase tracking-widest flex items-center gap-2">
                  <Sprout size={14} /> {t('irr_label_crop')} <span className="text-red-500">*</span>
                </label>
                <select 
                  value={formData.crop}
                  onChange={(e) => setFormData({...formData, crop: e.target.value})}
                  className="w-full p-4 bg-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-black text-sm"
                >
                  <option value="">Select Crop</option>
                  <option>Maize</option>
                  <option>Rice (Paddy)</option>
                  <option>Wheat</option>
                  <option>Cotton</option>
                  <option>Sugarcane</option>
                  <option>Groundnut</option>
                  <option>Tomato</option>
                  <option>Potato</option>
                  <option>Onion</option>
                  <option>Soybean</option>
                  <option>Ragi (Finger Millet)</option>
                  <option>Bajra (Pearl Millet)</option>
                  <option>Jowar (Sorghum)</option>
                  <option>Pigeon Pea (Tur)</option>
                  <option>Chickpea (Gram)</option>
                  <option>Sunflower</option>
                  <option>Mustard</option>
                  <option>Chili</option>
                  <option>Brinjal</option>
                  <option>Watermelon</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text/40 uppercase tracking-widest flex items-center gap-2">
                  <Waves size={14} /> {t('irr_label_soil')} <span className="text-red-500">*</span>
                </label>
                <select 
                  value={formData.soil}
                  onChange={(e) => setFormData({...formData, soil: e.target.value})}
                  className="w-full p-4 bg-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-black text-sm"
                >
                  <option value="Red Soil">Red Soil</option>
                  <option value="Black Soil">Black Soil</option>
                  <option value="Sandy Soil">Sandy Soil</option>
                  <option value="Loamy Soil">Loamy Soil</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text/40 uppercase tracking-widest flex items-center gap-2">
                  <Droplet size={14} /> {t('irr_label_type')} <span className="text-red-500">*</span>
                </label>
                <select 
                  value={formData.irrigation}
                  onChange={(e) => setFormData({...formData, irrigation: e.target.value})}
                  className="w-full p-4 bg-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-black text-sm"
                >
                  <option value="Borewell">Borewell</option>
                  <option value="Drip">Drip</option>
                  <option value="Sprinkler">Sprinkler</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text/40 uppercase tracking-widest flex items-center gap-2">
                  <LandPlot size={14} /> {t('irr_label_land')} <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={formData.land}
                  onChange={(e) => setFormData({...formData, land: e.target.value})}
                  className="w-full p-4 bg-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-black text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text/40 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={14} /> {t('irr_label_stage')} <span className="text-red-500">*</span>
                </label>
                <select 
                  value={formData.stage}
                  onChange={(e) => setFormData({...formData, stage: e.target.value})}
                  className="w-full p-4 bg-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-black text-sm"
                >
                  <option>Seedling</option>
                  <option>Vegetative</option>
                  <option>Flowering</option>
                  <option>Fruiting</option>
                  <option>Harvest Ready</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleGenerateStrategy}
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Brain size={20} />
                  {t('btn_generate_strategy')}
                </>
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* When to Water */}
              <div className="bg-white p-6 rounded-3xl border border-border shadow-lg">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                  <Clock size={24} />
                </div>
                <h4 className="text-xs font-bold text-text/40 uppercase tracking-widest mb-2">{t('label_when_water')}</h4>
                <p className="text-lg font-black text-text">{plan?.when}</p>
              </div>

              {/* How Much */}
              <div className="bg-white p-6 rounded-3xl border border-border shadow-lg">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                  <Waves size={24} />
                </div>
                <h4 className="text-xs font-bold text-text/40 uppercase tracking-widest mb-2">Watering Duration</h4>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-black text-text">{plan?.amount}</p>
                </div>
              </div>

              {/* Frequency */}
              <div className="bg-white p-6 rounded-3xl border border-border shadow-lg">
                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-4">
                  <Calendar size={24} />
                </div>
                <h4 className="text-xs font-bold text-text/40 uppercase tracking-widest mb-2">{t('label_frequency')}</h4>
                <p className="text-lg font-black text-text">{plan?.frequency}</p>
              </div>
            </div>

            {/* Warning Card */}
            <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex gap-4 items-start shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-amber-200">
                <AlertTriangle size={20} className="text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-amber-900 text-sm mb-1">{t('label_warning')}</h4>
                <p className="text-sm text-amber-800/80 leading-relaxed font-medium">
                  {plan?.warning}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Simple Tips */}
              <div className="bg-white p-8 rounded-3xl border border-border shadow-lg">
                <h4 className="font-display font-black text-xl text-text mb-6 flex items-center gap-3">
                  <Lightbulb className="text-yellow-500" /> {t('label_simple_tips')}
                </h4>
                <div className="space-y-4">
                  {plan?.tips.map((tip, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-xs font-black shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-sm text-text/80 font-medium leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insight */}
              <div className="bg-primary text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 opacity-10">
                  <Brain size={160} />
                </div>
                <div className="relative z-10">
                  <h4 className="font-display font-black text-xl mb-4 flex items-center gap-3">
                    <Brain /> {t('irrigation_ai_insight')}
                  </h4>
                  <div className="space-y-6">
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">1. Recommended Method</h5>
                      <p className="text-sm font-bold">{plan?.insight.method}</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">2. Reason</h5>
                      <p className="text-sm font-bold">{plan?.insight.reason}</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">3. Plan</h5>
                      <p className="text-sm font-bold">{plan?.insight.plan}</p>
                    </div>
                  </div>
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <button 
                      onClick={() => setView('form')}
                      className="w-full py-4 bg-white text-primary rounded-xl font-black text-sm hover:bg-neutral-50 transition-all shadow-lg"
                    >
                      Change Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
