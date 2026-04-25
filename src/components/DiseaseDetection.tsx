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
  const [lastAnalyzedImage, setLastAnalyzedImage] = useState<string | null>(null);
  const [cachedResult, setCachedResult] = useState<any | null>(null);

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

  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 512; // OPTIMIZED: Smaller size for much faster AI processing
        const MAX_HEIGHT = 512;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.6)); // OPTIMIZED: Lower quality but perfectly fine for AI recognition
      };
    });
  };
  const handleScan = async () => {
    if (!image) {
      addNotification('info', 'Please upload or capture an image first.');
      return;
    }

    // ⚡ INSTANT CACHE: Prevent redundant scanning of the same image
    if (image === lastAnalyzedImage && cachedResult) {
      setResult(cachedResult);
      addNotification('success', 'Showing previous result for this image.');
      return;
    }

    setIsScanning(true);
    setResult(null); // Clear previous results immediately for fresh UI

    try {
      // ⚡ COMPRESSION: Shrink image significantly (Massive Speed Boost)
      const compressedImage = await compressImage(image);
      
      const response = await fetch('/api/disease/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: compressedImage, dataType })
      });
      const data = await response.json();
      
      setResult(data);
      setCachedResult(data);
      setLastAnalyzedImage(image);
      addNotification('success', 'Scan completed successfully.');
    } catch (error) {
      console.error("Scan error:", error);
      addNotification('error', 'Failed to analyze the image. Please try again.');
    } finally {
      setIsScanning(false);
    }
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
                  <label 
                    htmlFor="file-upload"
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border border-border rounded-2xl font-black text-sm transition-all shadow-sm group/btn",
                      isScanning ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-bg active:scale-95"
                    )}
                  >
                    <Upload size={18} className="text-primary group-hover/btn:-translate-y-1 transition-transform" />
                    {t('btn_choose_file')}
                    <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={isScanning} />
                  </label>
                  <label 
                    htmlFor="camera-upload"
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border border-border rounded-2xl font-black text-sm transition-all shadow-sm group/btn",
                      isScanning ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-bg active:scale-95"
                    )}
                  >
                    <Camera size={18} className="text-primary group-hover/btn:scale-110 transition-transform" />
                    {t('btn_use_camera')}
                    <input id="camera-upload" type="file" className="hidden" accept="image/*" capture="environment" onChange={handleUpload} disabled={isScanning} />
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

                  {/* AI Visual Observation (New) */}
                  {result.observation && (
                    <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-3 items-start">
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                        <Info size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">AI Visual Assessment</p>
                        <p className="text-xs font-bold text-slate-600 italic leading-relaxed">"{result.observation}"</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em] mb-2",
                        result.status === 'HEALTHY' ? "text-green-600" : 
                        result.status === 'PEST' ? "text-purple-600" :
                        result.status === 'NOT SURE' ? "text-orange-600" : "text-primary"
                      )}>
                        AI Analysis: {result.status}
                      </h3>
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
                      {result.status === 'HEALTHY' ? (
                        <div className="px-4 py-2 bg-green-500 text-white rounded-2xl flex items-center gap-2 shadow-md">
                          <CheckCircle2 size={18} />
                          <span className="text-sm font-black">All Good!</span>
                        </div>
                      ) : (
                        <div className="px-4 py-2 bg-primary text-white rounded-2xl flex items-center gap-2 shadow-md">
                          <ShieldCheck size={18} />
                          <span className="text-sm font-black">{result.confidence} {t('result_confidence')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Status Message Box */}
                  <div className={cn(
                    "p-4 rounded-2xl border-l-4 mb-2 flex gap-4 items-center",
                    result.status?.toUpperCase() === 'HEALTHY' ? "bg-green-50/50 border-green-500 text-green-800" :
                    result.status?.toUpperCase() === 'PEST' ? "bg-purple-50/50 border-purple-500 text-purple-800" :
                    result.status?.toUpperCase() === 'NOT SURE' ? "bg-orange-50/50 border-orange-500 text-orange-800" :
                    result.actionLevel?.toUpperCase() === 'HIGH' ? "bg-red-50/50 border-red-500 text-red-800" : "bg-blue-50/50 border-blue-500 text-blue-800"
                  )}>
                    <div className="shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                      {result.status?.toUpperCase() === 'PEST' ? (
                        <Bug size={20} className="text-purple-500" />
                      ) : (
                        <AlertCircle size={20} className={cn(
                           result.status?.toUpperCase() === 'HEALTHY' ? "text-green-500" :
                           result.status?.toUpperCase() === 'NOT SURE' ? "text-orange-500" :
                           result.actionLevel?.toUpperCase() === 'HIGH' ? "text-red-500" : "text-blue-500"
                        )} />
                      )}
                    </div>
                    <p className="text-sm font-bold leading-snug">
                      {result.message || (
                        result.status?.toUpperCase() === 'HEALTHY' ? "Plant looks healthy. No disease or pests detected." :
                        result.status?.toUpperCase() === 'PEST' ? "Pest Attack Detected! Visible damage from insects found on the plant." :
                        result.status?.toUpperCase() === 'NOT SURE' ? "Image unclear. Please upload a closer or clearer image." :
                        "Disease detected. Please follow the treatment steps below."
                      )}
                    </p>
                  </div>
                </div>

                {(result.status?.toUpperCase() === 'DISEASED' || result.status?.toUpperCase() === 'PEST' || result.status?.toUpperCase() === 'DISEASE') && (
                  <>
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

                        {/* AI Detailed Analysis: Deep Analysis & Damage Extent */}
                        {result.details && (
                          <div className="bg-white border border-border rounded-[2.5rem] p-8 shadow-sm hover:shadow-md transition-all flex flex-col md:col-span-2 border-t-4 border-t-blue-500">
                            <div className="flex items-center gap-4 mb-8">
                              <div className="w-14 h-14 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner border border-blue-100">🔬</div>
                              <div>
                                <h4 className="font-display font-black text-text text-xl tracking-tight">Expert Deep Analysis</h4>
                                <p className="text-[10px] font-black text-text/40 uppercase tracking-[0.2em]">Comprehensive AI Pathologist Report</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              {/* Elaborate Issue */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <Lightbulb size={18} />
                                  </div>
                                  <p className="text-xs font-black text-blue-600 uppercase tracking-widest">
                                    What's Happening
                                  </p>
                                </div>
                                <div className="bg-blue-50/40 p-6 rounded-[2rem] border border-blue-100/50">
                                  <p className="text-base font-bold text-slate-700 leading-relaxed">
                                    {result.details.elaborateIssue || result.details.symptoms || "Detailed analysis not available for this sample."}
                                  </p>
                                </div>
                              </div>

                              {/* Damage Extent */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                    <AlertCircle size={18} />
                                  </div>
                                  <p className="text-xs font-black text-orange-600 uppercase tracking-widest">
                                    Extent of Damage
                                  </p>
                                </div>
                                <div className="bg-orange-50/40 p-6 rounded-[2rem] border border-orange-100/50">
                                  <p className="text-base font-bold text-slate-700 leading-relaxed">
                                    {result.details.damageExtent || "Please check the full plant for more symptoms."}
                                  </p>
                                  <div className="mt-4 pt-4 border-t border-orange-200/30 flex items-center gap-3">
                                    <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                      Severity: {result.actionLevel}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Detailed Treatment Plan */}
                            <div className="mt-8 pt-8 border-t border-slate-100">
                               <div className="flex items-center gap-3 mb-4">
                                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <CheckCircle2 size={18} />
                                  </div>
                                  <p className="text-xs font-black text-green-600 uppercase tracking-widest">
                                    Recovery Action Plan
                                  </p>
                                </div>
                                <div className="bg-emerald-50/30 p-6 rounded-[2rem] border border-emerald-100/50">
                                  <p className="text-base font-bold text-slate-700 leading-relaxed whitespace-pre-line">
                                    {result.details.treatment}
                                  </p>
                                </div>
                            </div>
                          </div>
                        )}

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


                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>


    </div>
  );
}
