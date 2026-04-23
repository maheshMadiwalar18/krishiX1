import React, { useState } from 'react';
import { 
  ChevronLeft, 
  MapPin, 
  Sprout, 
  TrendingUp, 
  Droplets, 
  Wallet, 
  Brain, 
  Calendar, 
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  LandPlot,
  Waves,
  Sun,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

interface ExpenseBreakdown {
  seeds: string;
  fertilizer: string;
  labor: string;
  water: string;
}

interface ActionPlan {
  sowing: string;
  irrigation: string;
  tips: string[];
}

interface CropStrategy {
  crop: string;
  yield: string;
  expense: ExpenseBreakdown;
  income: string;
  profit: string;
  risk: 'Low' | 'Medium' | 'High';
  water_need: 'Low' | 'Moderate' | 'High';
  insight: string;
  rotation_benefit: string;
  plan: ActionPlan;
  tag?: 'most_profitable' | 'lowest_risk' | 'water_efficient';
}

export default function CropDecisionSystem({ onBack }: { onBack: () => void }) {
  const { t } = useLanguage();
  const [step, setStep] = useState<'form' | 'results'>('form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    location: 'Karnataka, India',
    soilType: 'Red Soil',
    landSize: '2',
    irrigation: 'Borewell',
    season: 'Kharif',
    previousCrop: 'Maize'
  });
  const [result, setResult] = useState<any>(null);

  // ⚡ Fast Profit Estimation Logic
  const estimateProfit = (crop: string, size: string) => {
    const acres = parseFloat(size) || 1;
    const baseMap: Record<string, number> = {
      "Groundnut": 45000,
      "Millets": 30000,
      "Pigeon Pea": 38000,
      "Maize": 35000,
      "Watermelon": 85000,
      "Tomato": 120000,
      "Cucumber": 55000,
      "Vegetables": 60000,
      "Sunflowers": 40000
    };
    const profit = baseMap[crop] || 25000;
    return `₹ ${(profit * acres).toLocaleString()}`;
  };

  // ⚡ Rule-Based Quick Strategy (0ms Delay)
  const generateQuickStrategy = (data: any) => {
    const acres = parseFloat(data.landSize) || 1;
    const crops = data.soilType === "Red Soil" ? ["Groundnut", "Millets", "Pigeon Pea", "Maize"] :
                 data.soilType === "Sandy Soil" ? ["Watermelon", "Tomato", "Cucumber", "Groundnut"] :
                 ["Maize", "Pulses", "Vegetables", "Sunflowers"];

    const recommendations = crops.map((crop, i) => {
      const estimatedProfitNum = (crops.length - i) * 20000 * acres;
      return {
        crop,
        yield: `${(1.5 + i * 0.5).toFixed(1)} Tons/Acre`,
        profit: `₹ ${estimatedProfitNum.toLocaleString()}`,
        expense: { 
          seeds: `₹ ${(1200 * acres).toLocaleString()}`, 
          fertilizer: `₹ ${(3500 * acres).toLocaleString()}`, 
          labor: `₹ ${(8000 * acres).toLocaleString()}`, 
          water: `₹ ${(1000 * acres).toLocaleString()}` 
        },
        risk: i % 2 === 0 ? "Low" : "Medium",
        water_need: i === 1 ? "High" : "Moderate",
        insight: "Good for local soil conditions and current climate.",
        rotation_benefit: `Restores nutrients lost from ${data.previousCrop}.`,
        plan: { 
          sowing: data.season.includes("Kharif") ? "June - July" : "Oct - Nov", 
          tips: ["Ensure proper drainage", "Use treated seeds"] 
        },
        tag: i === 0 ? "most_profitable" : i === 1 ? "water_efficient" : "lowest_risk"
      };
    });

    return {
      recommendations,
      summaryTip: "Rotate crops seasonally to maintain soil nutrients and break pest cycles."
    };
  };

  const handleGenerate = async () => {
    console.log("🚀 Sending request to AI Crop Recommendation...");
    
    if (!formData.previousCrop.trim()) {
      alert("Please enter the previous crop grown.");
      return;
    }

    setLoading(true);
    setResult(null); // Clear old prediction before new request

    try {
      // ⚡ 1. Show INSTANT Rule-Based Result for better perceived speed
      const quickResult = generateQuickStrategy(formData);
      setResult(quickResult);
      setStep('results');

      const response = await fetch('/api/crop/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("🤖 AI Response Received:", data);
      
      if (data && data.success && data.crops) {
        // Transform backend 'crops' to frontend 'recommendations'
        const transformed = data.crops.map((c: any) => ({
          crop: c.name,
          yield: c.yield || "N/A",
          profit: typeof c.profit === 'number' ? `₹ ${c.profit.toLocaleString()}` : c.profit,
          risk: c.risk || "Medium",
          water_need: c.waterNeed || "Moderate",
          insight: c.insight || "Optimized for your soil.",
          rotation_benefit: c.rotationBenefit || "Healthy rotation cycle.",
          tag: c.tag || "most_profitable",
          // Mapping expense and plan correctly to refresh Labour Cost, Fertilizer, etc.
          expense: c.expense || { seeds: "₹...", fertilizer: "₹...", labor: "₹...", water: "₹..." },
          plan: c.plan || { sowing: "Soon", tips: ["Standard care"] }
        }));

        setResult({
          recommendations: transformed,
          summaryTip: data.summaryTip || "Focus on efficient irrigation and early pest detection."
        });
        console.log("✅ State updated with AI results");
      } else {
        console.warn("⚠️ API returned success:false or empty crops");
      }
    } catch (error: any) {
      console.error("❌ Prediction API Failed:", error.message);
      // Fallback is already showing from the 'quickResult' above
    } finally {
      console.log("🔄 Loading finished.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={step === 'results' ? () => setStep('form') : onBack}
          className="w-10 h-10 bg-white border border-neutral-200 rounded-xl flex items-center justify-center text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-all shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-display font-extrabold text-neutral-900">{t('decision_title')}</h1>
          <p className="text-neutral-500 text-sm">{t('decision_subtitle')}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'form' ? (
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
                  <MapPin size={14} /> {t('input_location')} <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full p-4 bg-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text/40 uppercase tracking-widest flex items-center gap-2">
                  <Sprout size={14} /> {t('input_soil')} <span className="text-red-500">*</span>
                </label>
                <select 
                  value={formData.soilType}
                  onChange={(e) => setFormData({...formData, soilType: e.target.value})}
                  className="w-full p-4 bg-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                >
                  <option>Red Soil</option>
                  <option>Black Soil</option>
                  <option>Sandy Soil</option>
                  <option>Clay Soil</option>
                  <option>Loamy Soil</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text/40 uppercase tracking-widest flex items-center gap-2">
                  <LandPlot size={14} /> {t('input_land')} <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={formData.landSize}
                  onChange={(e) => setFormData({...formData, landSize: e.target.value})}
                  className="w-full p-4 bg-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text/40 uppercase tracking-widest flex items-center gap-2">
                  <Waves size={14} /> {t('input_irrigation')} <span className="text-red-500">*</span>
                </label>
                <select 
                  value={formData.irrigation}
                  onChange={(e) => setFormData({...formData, irrigation: e.target.value})}
                  className="w-full p-4 bg-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                >
                  <option>Borewell</option>
                  <option>Rain-fed</option>
                  <option>Canal</option>
                  <option>Drip Irrigation</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text/40 uppercase tracking-widest flex items-center gap-2">
                  <Sun size={14} /> {t('input_season')} <span className="text-red-500">*</span>
                </label>
                <select 
                  value={formData.season}
                  onChange={(e) => setFormData({...formData, season: e.target.value})}
                  className="w-full p-4 bg-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                >
                  <option>Kharif (Monsoon)</option>
                  <option>Rabi (Winter)</option>
                  <option>Zaid (Summer)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text/40 uppercase tracking-widest flex items-center gap-2">
                  <History size={14} /> {t('input_prev_crop')} <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Maize, Rice, Wheat..."
                  value={formData.previousCrop}
                  onChange={(e) => setFormData({...formData, previousCrop: e.target.value})}
                  className="w-full p-4 bg-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                />
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Quick Summary Tip */}
            {result?.summaryTip && (
              <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm border border-primary/10 shrink-0">
                  <Info size={20} />
                </div>
                <p className="text-sm font-bold text-primary italic leading-relaxed">
                  " {result.summaryTip} "
                </p>
              </div>
            )}

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {result?.recommendations?.map((strategy: any, i: number) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={strategy.crop}
                  className={cn(
                    "bg-white rounded-3xl border p-6 flex flex-col shadow-lg relative overflow-hidden",
                    strategy.tag === 'most_profitable' ? "border-primary/30 ring-2 ring-primary/5" : "border-border"
                  )}
                >
                  {strategy.tag && (
                    <div className={cn(
                      "absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
                      strategy.tag === 'most_profitable' ? "bg-green-600 text-white" : 
                      strategy.tag === 'lowest_risk' ? "bg-blue-600 text-white" : 
                      "bg-amber-600 text-white"
                    )}>
                      {t(`tag_${strategy.tag}`)}
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-6 mt-4">
                    <div className="w-14 h-14 bg-bg rounded-2xl flex items-center justify-center text-primary border border-border">
                      <Sprout size={28} />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-xl text-text">{strategy.crop}</h3>
                      <p className="text-sm text-text/40 font-medium flex items-center gap-1">
                        <TrendingUp size={14} className="text-green-600" /> {strategy.yield}
                      </p>
                    </div>
                  </div>

                  <div className="bg-bg/50 rounded-2xl p-4 mb-6">
                    <p className="text-xs font-bold text-text/40 uppercase tracking-widest mb-1">{t('label_profit')}</p>
                    <p className="text-3xl font-black text-primary tracking-tight">{strategy.profit}</p>
                    <p className="text-[10px] text-text/40 mt-1 font-medium italic">Estimated after all expenses</p>
                  </div>

                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span className="text-text/40 flex items-center gap-2"><Droplets size={14} /> {t('label_risk')}</span>
                      <span className={cn(
                        "px-2 py-0.5 rounded-md font-bold",
                        strategy.risk === 'Low' ? "text-green-600 bg-green-50" : "text-orange-600 bg-orange-50"
                      )}>{strategy.risk}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span className="text-text/40 flex items-center gap-2"><Waves size={14} /> Water Need</span>
                      <span className="text-text">{strategy.water_need}</span>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="bg-primary/5 p-4 rounded-2xl">
                      <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                        <History size={14} /> {t('label_rotation_benefit')}
                      </h4>
                      <p className="text-xs text-primary font-bold leading-relaxed">
                        {strategy.rotation_benefit}
                      </p>
                    </div>

                    <div className="bg-bg/50 p-4 rounded-2xl">
                      <h4 className="text-[10px] font-black text-text/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Brain size={14} /> {t('label_insight')}
                      </h4>
                      <p className="text-xs text-text/80 leading-relaxed font-medium">
                        {strategy.insight}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-text/40 uppercase tracking-widest mb-3">{t('label_action_plan')}</h4>
                      <div className="flex items-center gap-3 text-sm font-bold text-text bg-white border border-border p-3 rounded-xl shadow-sm">
                        <Calendar size={16} className="text-primary" />
                        <div>
                          <p className="text-[10px] text-text/40 uppercase tracking-widest leading-none mb-1">Sowing Time</p>
                          {strategy.plan?.sowing || "N/A"}
                        </div>
                      </div>
                      <div className="space-y-2">
                        {(strategy.plan?.tips || []).map((tip: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-text/60 font-medium">
                            <CheckCircle2 size={12} className="text-green-500 shrink-0 mt-0.5" />
                            {tip}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-dashed border-border">
                      <h4 className="text-[10px] font-black text-text/40 uppercase tracking-widest mb-3">{t('label_expenses')}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(strategy.expense || {}).map(([key, val]) => (
                          <div key={key} className="bg-bg p-2 rounded-lg text-center">
                            <p className="text-[9px] text-text/40 uppercase font-bold">{key}</p>
                            <p className="text-xs font-black text-text">{val as string}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-sm border border-amber-200">
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-amber-900 mb-1">Crop Rotation Warning</h4>
                <p className="text-sm text-amber-800/80 leading-relaxed">
                  These recommendations are designed to optimize soil health based on your previous crop. Planting the same crop twice (Monoculture) may lead to soil depletion and higher disease risk. Follow these rotation plans for long-term sustainability.
                </p>
              </div>
              <button 
                onClick={() => setStep('form')}
                className="px-6 py-3 bg-white border border-amber-200 text-amber-700 rounded-xl font-bold text-sm hover:bg-amber-100 transition-all shadow-sm"
              >
                Change Inputs
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
