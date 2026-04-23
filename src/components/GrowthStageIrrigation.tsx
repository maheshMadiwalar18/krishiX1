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
  LandPlot,
  Timer,
  Zap,
  Leaf,
  Flower,
  Apple
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';

interface GrowthStageData {
  stage: string;
  icon: any;
  color: string;
}

interface IrrigationPlan {
  stage: string;
  when: string;
  amount: 'Low' | 'Medium' | 'High';
  frequency: string;
  warning: string;
  tips: string[];
  insight: string;
}

const CROP_STAGES: Record<string, { days: number[], labels: string[] }> = {
  'Maize': {
    days: [10, 40, 60, 120],
    labels: ['Germination', 'Vegetative', 'Flowering', 'Fruiting']
  },
  'Rice': {
    days: [20, 50, 80, 120],
    labels: ['Germination', 'Vegetative', 'Flowering', 'Fruiting']
  },
  'Cotton': {
    days: [15, 60, 90, 150],
    labels: ['Germination', 'Vegetative', 'Flowering', 'Fruiting']
  },
  'Other': {
    days: [10, 30, 60, 100],
    labels: ['Germination', 'Vegetative', 'Flowering', 'Fruiting']
  }
};

const STAGE_ICONS: Record<string, any> = {
  'Germination': Sprout,
  'Vegetative': Leaf,
  'Flowering': Flower,
  'Fruiting': Apple
};

const STAGE_COLORS: Record<string, string> = {
  'Germination': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Vegetative': 'bg-green-100 text-green-700 border-green-200',
  'Flowering': 'bg-blue-100 text-blue-700 border-blue-200',
  'Fruiting': 'bg-indigo-100 text-indigo-700 border-indigo-200'
};

export default function GrowthStageIrrigation({ onBack }: { onBack: () => void }) {
  const { t } = useLanguage();
  const [view, setView] = useState<'form' | 'result'>('form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    crop: 'Maize',
    age: '45',
    soil: 'Red Soil',
    method: 'Borewell'
  });
  const [result, setResult] = useState<IrrigationPlan | null>(null);

  const determineStage = (crop: string, age: number) => {
    const data = CROP_STAGES[crop] || CROP_STAGES['Other'];
    for (let i = 0; i < data.days.length; i++) {
      if (age <= data.days[i]) return data.labels[i];
    }
    return data.labels[data.labels.length - 1];
  };

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      const ageNum = parseInt(formData.age);
      const stage = determineStage(formData.crop, ageNum);
      
      let amount: 'Low' | 'Medium' | 'High' = 'Medium';
      let frequency = "2 times/week";
      let warning = "Normal watering needed.";
      let insight = "Regular irrigation supports healthy growth.";

      if (stage === 'Germination') {
        amount = 'Low';
        frequency = "Every day (Light)";
        warning = "Soil must stay moist but not flooded.";
        insight = "Gentle watering is key for fragile seedlings.";
      } else if (stage === 'Flowering') {
        amount = 'High';
        frequency = "3-4 times/week";
        warning = "Water stress now will cause flowers to drop!";
        insight = "Flowering is the most critical stage for water.";
      } else if (stage === 'Fruiting') {
        amount = 'Medium';
        frequency = "2 times/week";
        warning = "Avoid overwatering to prevent fruit rot.";
        insight = "Steady moisture helps in uniform fruit development.";
      }

      setResult({
        stage,
        when: "Tomorrow Morning",
        amount,
        frequency,
        warning,
        tips: [
          "Check soil moisture manually before watering",
          "Water early morning to avoid evaporation",
          "Ensure no water stays near the plant base"
        ],
        insight
      });
      setLoading(false);
      setView('result');
    }, 1500);
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
          <h1 className="text-2xl font-display font-extrabold text-neutral-900">Growth-Based Irrigation</h1>
          <p className="text-neutral-500 text-sm mt-1">Precise water planning based on plant age.</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'form' ? (
          <motion.div 
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-xl mx-auto bg-white rounded-3xl border border-border p-8 shadow-xl"
          >
            <div className="space-y-6">
              {/* Crop Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text/40 uppercase tracking-widest flex items-center gap-2">
                  <Sprout size={14} /> Select Crop
                </label>
                <select 
                  value={formData.crop}
                  onChange={(e) => setFormData({...formData, crop: e.target.value})}
                  className="w-full p-4 bg-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                >
                  <option>Maize</option>
                  <option>Rice</option>
                  <option>Cotton</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Plant Age */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text/40 uppercase tracking-widest flex items-center gap-2">
                  <Timer size={14} /> Plant Age (Days)
                </label>
                <input 
                  type="number"
                  placeholder="e.g. 45"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full p-4 bg-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                />
              </div>

              {/* Soil Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text/40 uppercase tracking-widest flex items-center gap-2">
                  <Waves size={14} /> Soil Type
                </label>
                <select 
                  value={formData.soil}
                  onChange={(e) => setFormData({...formData, soil: e.target.value})}
                  className="w-full p-4 bg-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                >
                  <option>Red Soil</option>
                  <option>Black Soil</option>
                  <option>Sandy Soil</option>
                  <option>Loamy Soil</option>
                </select>
              </div>

              {/* Irrigation Method */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-text/40 uppercase tracking-widest flex items-center gap-2">
                  <Droplet size={14} /> Irrigation Method
                </label>
                <div className="flex flex-wrap gap-3">
                  {['Borewell', 'Rain-fed', 'Canal'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setFormData({...formData, method: m})}
                      className={cn(
                        "flex-1 px-4 py-3 rounded-xl border font-bold text-sm transition-all",
                        formData.method === m 
                          ? "bg-primary/10 border-primary text-primary" 
                          : "bg-bg border-border text-text/60 hover:border-primary/30"
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Zap size={20} />
                    Get Smart Irrigation Plan
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Top Result Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Growth Stage Highlight */}
              <div className="bg-white p-8 rounded-3xl border border-border shadow-xl flex flex-col items-center justify-center text-center">
                <div className={cn("w-20 h-20 rounded-full flex items-center justify-center mb-4 border", STAGE_COLORS[result!.stage])}>
                  {React.createElement(STAGE_ICONS[result!.stage], { size: 40 })}
                </div>
                <h4 className="text-xs font-bold text-text/40 uppercase tracking-widest mb-1">Growth Stage</h4>
                <p className={cn("text-3xl font-display font-black", STAGE_COLORS[result!.stage].split(' ')[1])}>{result?.stage} Stage</p>
              </div>

              {/* Irrigation Strategy Summary */}
              <div className="bg-primary p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Droplet size={120} />
                </div>
                <div className="relative z-10">
                  <h4 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">Irrigation Plan</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="text-white/60" size={18} />
                      <span className="font-bold">{result?.when}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Waves className="text-white/60" size={18} />
                      <span className="bg-white/20 px-3 py-0.5 rounded-full text-xs font-black uppercase">
                        {result?.amount} Amount
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="text-white/60" size={18} />
                      <span className="font-bold">{result?.frequency}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Section */}
            <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex gap-4 items-start">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-amber-200 shadow-sm shrink-0">
                <AlertTriangle className="text-amber-600" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-amber-900 text-sm mb-1">Critical Reminder</h4>
                <p className="text-sm text-amber-800 font-medium leading-relaxed">{result?.warning}</p>
              </div>
            </div>

            {/* Tips & AI Insight */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-border shadow-lg">
                <h4 className="font-display font-black text-xl mb-6 flex items-center gap-3">
                  <Lightbulb className="text-yellow-500" /> Growing Tips
                </h4>
                <div className="space-y-4">
                  {result?.tips.map((tip, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-black shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-sm text-text/80 font-medium">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-600 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between">
                <div>
                  <h4 className="font-display font-black text-xl mb-4 flex items-center gap-3">
                    <Brain /> AI Insight
                  </h4>
                  <p className="text-blue-50 leading-relaxed font-medium">
                    {result?.insight}
                  </p>
                </div>
                <button 
                  onClick={() => setView('form')}
                  className="mt-8 w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold transition-all"
                >
                  Change Input
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
