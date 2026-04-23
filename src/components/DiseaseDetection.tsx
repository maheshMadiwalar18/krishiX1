import React, { useState } from 'react';
import { 
  Upload, 
  Camera, 
  ScanSearch, 
  Bug, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronLeft,
  X,
  AlertCircle,
  Lightbulb,
  Info,
  ChevronDown,
  Sprout,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useNotification } from './ui/Notification';
import { useLanguage } from '../contexts/LanguageContext';

export default function DiseaseDetection({ onBack }: { onBack: () => void }) {
  const { addNotification } = useNotification();
  const { t, language } = useLanguage();
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [dataType, setDataType] = useState<'leaf' | 'plant' | 'fruit' | 'stem'>('leaf');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      addNotification('error', 'Image size too large. Max 10MB allowed.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setResult(null); 
      addNotification('success', 'Image uploaded successfully.');
    };
    reader.onerror = () => addNotification('error', 'Failed to read image.');
    reader.readAsDataURL(file);
  };

  const handleScan = () => {
    if (!image) {
      addNotification('info', 'Please upload or capture an image first.');
      return;
    }
    setIsScanning(true);
    // Mocking AI Scan
    setTimeout(() => {
      setIsScanning(false);
      setResult({
        name: "Wheat Yellow Rust",
        confidence: "94%",
        medicine: {
          name: "Propiconazole 25% EC",
          dosage: "500ml per acre",
          method: "Foliar Spray",
          frequency: "Twice a week (14-day interval)"
        },
        prevention: [
          "Rotate crops annually to break the pest cycle",
          "Use disease-resistant seeds during sowing",
          "Maintain optimal plant spacing for air circulation",
          "Remove and destroy infected plant debris"
        ],
        actionLevel: "Medium"
      });
      addNotification('success', 'Scan completed. Disease identified.');
    }, 2800);
  };

  const speakResult = () => {
    if (!result) return;
    const text = language === 'kn' 
      ? `ಫಲಿತಾಂಶ: ${result.name}. ನಿಖರತೆ: ${result.confidence}. ತೀವ್ರತೆ: ${result.actionLevel}. ಶಿಫಾರಸು ಮಾಡಿದ ಔಷಧ: ${result.medicine.name}.`
      : `Result: ${result.name}. Confidence: ${result.confidence}. Severity: ${result.actionLevel}. Recommended medicine: ${result.medicine.name}.`;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'kn' ? 'kn-IN' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-12 h-12 bg-white border border-border rounded-2xl flex items-center justify-center text-text hover:bg-bg transition-all shadow-sm active:scale-95"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-[#E8F5E9] rounded-full flex items-center justify-center text-primary shadow-inner">
              <Sprout size={32} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-black text-text tracking-tight">{t('disease_title')}</h1>
              <p className="text-text/60 text-xs md:text-sm max-w-md">{t('disease_subtitle')}</p>
            </div>
          </div>
        </div>

        {/* Tip Box */}
        <div className="bg-[#F1F8E9] border border-[#DDE7D1] rounded-2xl p-3 flex items-center gap-3 max-w-sm relative overflow-hidden group shadow-sm">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary shrink-0 shadow-sm group-hover:scale-110 transition-transform">
            <Lightbulb size={16} />
          </div>
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase text-primary tracking-widest block">{t('tip_label')}</span>
            <p className="text-[11px] font-bold text-text/70 leading-tight">{t('tip_content')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Upload Area */}
        <div className="space-y-6">
          <div className="bg-white border-2 border-dashed border-border rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center space-y-6 transition-all hover:border-primary/40 relative overflow-hidden group shadow-sm">
            {image ? (
              <div className="relative w-full aspect-square max-w-md rounded-3xl overflow-hidden shadow-2xl">
                <img src={image} alt="Crop to analyze" className="w-full h-full object-cover" />
                <button 
                  onClick={() => { setImage(null); setResult(null); }}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-red-500 shadow-lg hover:bg-white active:scale-90 transition-all"
                >
                  <X size={20} />
                </button>
                {isScanning && (
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                    <motion.div 
                      animate={{ y: [-200, 200] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-1 bg-primary/80 shadow-[0_0_20px_rgba(46,125,50,0.8)] z-10"
                    />
                    <div className="relative flex flex-col items-center gap-4">
                      <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(46,125,50,0.3)]" />
                      <span className="text-white font-black text-xl tracking-tight drop-shadow-md">
                        {t('scanning_text')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="w-24 h-24 bg-bg rounded-[2rem] flex items-center justify-center text-text/20 group-hover:text-primary/40 transition-colors shadow-inner">
                  <ScanSearch size={48} />
                </div>
                <div className="space-y-4 w-full">
                  {/* Data Type Selector */}
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {[
                      { id: 'leaf', label: 'Leaf' },
                      { id: 'plant', label: 'Whole Plant' },
                      { id: 'fruit', label: 'Fruit' },
                      { id: 'stem', label: 'Stem' }
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setDataType(type.id as any)}
                        className={cn(
                          "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
                          dataType === type.id 
                            ? "bg-primary text-white border-primary shadow-md" 
                            : "bg-white text-text/60 border-border hover:border-primary/40"
                        )}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-text mb-2">{t('btn_scan_now')}</h3>
                    <p className="text-sm text-text/40 font-medium max-w-[240px] mx-auto">{t('no_results_desc')}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                  <label className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border border-border rounded-2xl font-black text-sm cursor-pointer hover:bg-bg transition-all shadow-sm active:scale-95 group/btn">
                    <Upload size={18} className="text-primary group-hover/btn:-translate-y-1 transition-transform" />
                    {t('btn_choose_file')}
                    <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                  </label>
                  <label className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border border-border rounded-2xl font-black text-sm cursor-pointer hover:bg-bg transition-all shadow-sm active:scale-95 group/btn">
                    <Camera size={18} className="text-primary group-hover/btn:scale-110 transition-transform" />
                    {t('btn_use_camera')}
                    <input type="file" className="hidden" accept="image/*" capture="environment" onChange={handleUpload} />
                  </label>
                </div>
              </>
            )}
          </div>

          {!result && (
            <button 
              onClick={handleScan}
              disabled={!image || isScanning}
              className="w-full py-5 bg-primary text-white rounded-3xl font-black text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] animate-[shimmer_3s_infinite]" />
              <ScanSearch size={24} />
              {t('btn_start_ai')}
            </button>
          )}

          <div className="bg-white border border-border rounded-[2.5rem] p-6 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            <h4 className="text-[10px] font-black uppercase text-text/30 tracking-[0.2em] mb-4 flex items-center gap-2">
              <Info size={12} />
              {t('supported_crops')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {['Wheat', 'Rice', 'Tomato', 'Potato', 'Cotton', 'Maize', 'Soybean', 'Apple', 'Grape'].map(crop => (
                <span key={crop} className="px-4 py-2 bg-bg rounded-xl text-xs font-bold text-text/60 border border-border/50 hover:border-primary/30 transition-all cursor-default">
                  {crop}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Results/Onboarding */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border border-border rounded-[2.5rem] p-8 md:p-12 text-center space-y-6 shadow-sm relative overflow-hidden"
              >
                <div className="w-20 h-20 bg-bg rounded-3xl flex items-center justify-center text-text/20 mx-auto rotate-12">
                  <CheckCircle2 size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-text mb-2">{t('no_results_title')}</h3>
                  <p className="text-sm text-text/40 font-medium max-w-xs mx-auto">
                    {t('no_results_desc')}
                  </p>
                </div>

                <div className="pt-6 border-t border-border space-y-4">
                  <p className="text-[10px] font-black text-text/30 uppercase tracking-[0.2em]">{t('what_get_title')}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: <Bug size={16} />, label: t('get_item_1') },
                      { icon: <ShieldCheck size={16} />, label: t('get_item_2') },
                      { icon: <Lightbulb size={16} />, label: t('get_item_3') },
                      { icon: <CheckCircle2 size={16} />, label: t('get_item_4') }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-bg rounded-2xl border border-border/50 hover:border-primary/20 transition-all">
                        <div className="text-primary">{item.icon}</div>
                        <span className="text-xs font-bold text-text/70">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 flex items-center justify-center gap-4 text-text/40">
                  <div className="flex items-center gap-1.5 bg-bg px-3 py-1.5 rounded-full border border-border/50">
                    <ShieldCheck size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Safe & Secure</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 space-y-8"
              >
                {/* 1. Disease Result Section */}
                <div className="bg-white border border-border rounded-[2.5rem] p-8 card-shadow border-t-8 border-t-primary relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Bug size={120} />
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">AI Analysis Result</h3>
                      <div className="flex items-center gap-3">
                        <h2 className="text-3xl md:text-4xl font-display font-black text-text tracking-tight">{result.name}</h2>
                        <button 
                          onClick={speakResult}
                          className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                          title="Listen"
                        >
                          <Volume2 size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <div className="px-4 py-2 bg-primary text-white rounded-2xl flex items-center gap-2 shadow-md">
                        <ShieldCheck size={18} />
                        <span className="text-sm font-black">{result.confidence} {t('result_confidence')}</span>
                      </div>
                      <div className={cn(
                        "px-4 py-2 rounded-2xl border-2 flex items-center gap-2 font-black text-sm",
                        result.actionLevel === 'High' ? "bg-red-50 text-red-600 border-red-100" :
                        result.actionLevel === 'Medium' ? "bg-orange-50 text-orange-600 border-orange-100" :
                        "bg-blue-50 text-blue-600 border-blue-100"
                      )}>
                        <AlertCircle size={18} />
                        <span>{t('result_action_level')}: {result.actionLevel}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Severity Warning Box */}
                  <div className={cn(
                    "p-4 rounded-2xl border-l-4 mb-2 flex gap-4 items-center",
                    result.actionLevel === 'High' ? "bg-red-50/50 border-red-500 text-red-800" :
                    result.actionLevel === 'Medium' ? "bg-orange-50/50 border-orange-500 text-orange-800" :
                    "bg-blue-50/50 border-blue-500 text-blue-800"
                  )}>
                    <div className="shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <AlertCircle size={20} className={cn(
                         result.actionLevel === 'High' ? "text-red-500" :
                         result.actionLevel === 'Medium' ? "text-orange-500" :
                         "text-blue-500"
                      )} />
                    </div>
                    <p className="text-sm font-bold leading-snug">
                      {result.actionLevel === 'High' ? "CRITICAL: Immediate action required to prevent total crop loss. Spread risk is extremely high." :
                       result.actionLevel === 'Medium' ? "WARNING: Moderate infection detected. Apply treatment within 48 hours to prevent further spread." :
                       "ADVISORY: Early symptoms detected. Monitor closely and apply preventive measures."}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                   <h3 className="text-xl font-black text-text flex items-center gap-2 pl-2">
                     <div className="w-2 h-6 bg-primary rounded-full" />
                     Treatment & Recommendations
                   </h3>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* 2. Medicine Recommendation */}
                      <div className="bg-white border border-border rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-[#F1F8E9] rounded-2xl flex items-center justify-center text-2xl shadow-inner">💊</div>
                          <div>
                            <h4 className="font-black text-text">{t('medicine_title')}</h4>
                            <p className="text-[10px] font-bold text-text/40 uppercase tracking-widest">Chemical Control</p>
                          </div>
                        </div>

                        <div className="space-y-5 flex-1">
                          <div className="bg-[#F9FBF9] p-4 rounded-2xl border border-primary/10">
                            <p className="text-[10px] font-black text-text/30 uppercase tracking-widest mb-1">{t('med_name')}</p>
                            <p className="font-black text-primary text-xl tracking-tight">{result.medicine.name}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-bg/50 p-4 rounded-2xl border border-border/50">
                              <p className="text-[10px] font-black text-text/30 uppercase tracking-widest mb-1">{t('med_dosage')}</p>
                              <p className="font-bold text-text/80 text-sm">{result.medicine.dosage}</p>
                            </div>
                            <div className="bg-bg/50 p-4 rounded-2xl border border-border/50">
                              <p className="text-[10px] font-black text-text/30 uppercase tracking-widest mb-1">{t('med_method')}</p>
                              <p className="font-bold text-text/80 text-sm">{result.medicine.method}</p>
                            </div>
                          </div>
                          
                          <div className="bg-bg/50 p-4 rounded-2xl border border-border/50">
                            <p className="text-[10px] font-black text-text/30 uppercase tracking-widest mb-1">{t('med_frequency')}</p>
                            <p className="font-bold text-text/80 text-sm">{result.medicine.frequency}</p>
                          </div>
                        </div>
                      </div>

                      {/* 3. Prevention Tips */}
                      <div className="bg-white border border-border rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-[#F1F8E9] rounded-2xl flex items-center justify-center text-2xl shadow-inner">🌱</div>
                          <div>
                            <h4 className="font-black text-text">{t('prevention_title')}</h4>
                            <p className="text-[10px] font-bold text-text/40 uppercase tracking-widest">Future Protection</p>
                          </div>
                        </div>

                        <div className="space-y-3 flex-1">
                          {result.prevention.map((tip: string, i: number) => (
                            <div key={i} className="flex gap-3 items-start p-3 bg-[#F9FBF9] rounded-xl border border-primary/5 hover:border-primary/20 transition-all group">
                              <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm border border-border/50 group-hover:bg-primary group-hover:text-white transition-all">
                                <CheckCircle2 size={14} />
                              </div>
                              <p className="text-sm text-text/70 font-bold leading-snug">{tip}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button className="flex-1 py-5 bg-[#F1F8E9] text-primary font-black rounded-[1.5rem] hover:bg-[#E8F5E9] transition-all active:scale-95 border-2 border-primary/10 shadow-sm flex items-center justify-center gap-2">
                    {t('btn_export')}
                  </button>
                  <button className="flex-1 py-5 bg-primary text-white font-black rounded-[1.5rem] hover:bg-primary/90 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2">
                    {t('btn_save_log')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Security Note */}
      <div className="bg-[#F9FBF9] rounded-2xl p-4 border border-border flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl text-primary shrink-0">
            <ShieldCheck size={20} />
          </div>
          <p className="text-[11px] text-text/60 leading-relaxed text-center md:text-left">
            {t('security_note')} <span className="font-black text-primary">{t('security_note_bold')}</span>
          </p>
        </div>
        <div className="flex -space-x-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-bg flex items-center justify-center overflow-hidden shadow-sm">
              <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="Farmer" />
            </div>
          ))}
          <div className="pl-4 text-[10px] font-black text-primary uppercase tracking-widest flex items-center">
            + 2,400 farmers helped today
          </div>
        </div>
      </div>
    </div>
  );
}
