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
  Sprout
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useNotification } from './ui/Notification';

export default function DiseaseDetection({ onBack }: { onBack: () => void }) {
  const { addNotification } = useNotification();
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
            <div className="w-14 h-14 bg-[#E8F5E9] rounded-full flex items-center justify-center text-primary">
              <Sprout size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-display font-black text-text tracking-tight">Crop Disease Detection</h1>
              <p className="text-text/60 text-sm">Upload a photo of your crop to get instant AI-powered disease analysis and smart recommendations.</p>
            </div>
          </div>
        </div>

        {/* Tip Box */}
        <div className="bg-[#F1F8E9] border border-[#DDE7D1] rounded-2xl p-3 flex items-center gap-3 max-w-sm relative overflow-hidden">
          <div className="p-2 bg-white rounded-xl text-primary shadow-sm">
            <Lightbulb size={20} />
          </div>
          <p className="text-xs font-medium text-text/80 leading-tight">
            <span className="font-bold text-primary">Tip:</span> Clear leaf images give better results
          </p>
          <div className="absolute top-1 right-1 opacity-20 rotate-12 pointer-events-none">
            <Sprout size={24} />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Upload */}
        <div className="bg-white border border-border rounded-[2.5rem] p-8 card-shadow flex flex-col h-full">
          {/* Data Type Selector */}
          <div className="mb-6 flex flex-wrap gap-2">
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
                  "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                  dataType === type.id 
                    ? "bg-primary text-white border-primary shadow-md" 
                    : "bg-white text-text/60 border-border hover:border-primary/40"
                )}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div 
            className={cn(
              "relative border-2 border-dashed rounded-[2rem] p-4 flex flex-col items-center justify-center transition-all flex-1 min-h-[320px]",
              image ? "border-primary/20 bg-primary/[0.02]" : "border-[#B2D1B2] bg-[#F9FBF9] hover:bg-[#F1F8F1] hover:border-primary/40"
            )}
          >
            {image ? (
              <div className="w-full h-full relative group">
                <img src={image} className="w-full h-full object-cover rounded-2xl shadow-inner" alt="Preview" />
                <button 
                  onClick={() => { setImage(null); setResult(null); }}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-md hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="text-center p-8 flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#2E7D32] shadow-sm border border-border/50 mb-6">
                  <Upload size={32} />
                </div>
                <h3 className="text-xl font-bold text-text mb-2">Upload {dataType} Image</h3>
                <p className="text-sm text-text/50 mb-8">Click to upload or drag and drop<br/>JPG, PNG, WEBP (Max. 10MB)</p>
                
                <div className="relative">
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    accept="image/*"
                    onChange={handleUpload}
                  />
                  <button className="flex items-center gap-2 px-8 py-3 bg-[#1B5E20] text-white rounded-xl font-bold hover:bg-[#1B5E20]/90 transition-all shadow-lg active:scale-95 pointer-events-none">
                    <Upload size={18} />
                    <span>Choose File</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-black text-text/30">
              <span className="bg-white px-4">OR</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-4 px-6 bg-white border border-border rounded-2xl font-bold text-text hover:bg-bg transition-all shadow-sm active:scale-95">
              <Camera size={20} className="text-primary" />
              <span>Use Camera</span>
            </button>
            <button 
              onClick={handleScan}
              disabled={!image || isScanning}
              className={cn(
                "flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold transition-all shadow-lg active:scale-95",
                !image || isScanning 
                  ? "bg-[#E0E0E0] text-text/30 cursor-not-allowed" 
                  : "bg-primary text-white hover:bg-primary/90"
              )}
            >
              <ScanSearch size={20} />
              <span>{isScanning ? "Scanning..." : "Start AI Analysis"}</span>
            </button>
          </div>

          <div className="mt-8 p-4 bg-[#F9FBF9] rounded-2xl border border-[#E8F5E8] flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <ShieldCheck size={20} />
            </div>
            <p className="text-[11px] text-text/60 leading-relaxed">
              Your data is secure and used only for analysis.<br/>
              <span className="font-bold">We do not store your images.</span>
            </p>
          </div>
        </div>

        {/* Right Column: Results/Info */}
        <div className="bg-white border border-border rounded-[2.5rem] p-8 card-shadow flex flex-col">
          <AnimatePresence mode="wait">
            {!isScanning && !result && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col h-full"
              >
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="relative mb-8">
                    <div className="w-32 h-32 bg-[#F1F8E9] rounded-full absolute -top-4 -left-4 -z-10 animate-pulse" />
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/3022/3022513.png" 
                      className="w-32 h-32 opacity-80" 
                      alt="Illustration" 
                    />
                    <div className="absolute -bottom-2 -right-2 bg-primary text-white w-12 h-12 rounded-full border-4 border-white flex items-center justify-center text-2xl font-bold">
                      ?
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-text mb-3">No Results Yet</h3>
                  <p className="text-text/60 max-w-sm mb-12">
                    Upload a crop image and our AI will detect diseases, analyze severity, and suggest best solutions.
                  </p>
                </div>

                <div className="bg-[#F9FBF9] rounded-[2rem] p-6 border border-[#E8F5E8]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary rounded-xl text-white shadow-sm">
                      <Lightbulb size={20} />
                    </div>
                    <h4 className="font-bold text-text">What you'll get:</h4>
                  </div>
                  <ul className="space-y-4">
                    {[
                      'Disease name & confidence',
                      'Severity level',
                      'Treatment recommendations',
                      'Prevention tips'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="p-1 bg-primary/10 rounded-full text-primary">
                          <CheckCircle2 size={14} />
                        </div>
                        <span className="text-sm font-medium text-text/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {isScanning && (
              <motion.div 
                key="scanning"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-12 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-primary/[0.02] -z-10" />
                <div className="w-32 h-32 relative mb-10">
                   <div className="absolute inset-0 border-4 border-bg border-t-primary rounded-full animate-spin" />
                   <div className="absolute inset-4 border-2 border-primary/20 border-b-primary/50 rounded-full animate-spin-reverse" />
                   <div className="absolute inset-0 flex items-center justify-center text-primary">
                     <ScanSearch size={40} className="animate-pulse" />
                   </div>
                </div>
                <h3 className="text-2xl font-black text-text mb-3">Analyzing Image...</h3>
                <p className="text-text/60 max-w-xs">Our neural network is identifying patterns and symptoms for accurate diagnosis.</p>
              </motion.div>
            )}

            {result && (
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
                      <h2 className="text-4xl font-display font-black text-text tracking-tight">{result.name}</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <div className="px-4 py-2 bg-primary text-white rounded-2xl flex items-center gap-2 shadow-md">
                        <ShieldCheck size={18} />
                        <span className="text-sm font-black">{result.confidence} Confidence</span>
                      </div>
                      <div className={cn(
                        "px-4 py-2 rounded-2xl border-2 flex items-center gap-2 font-black text-sm",
                        result.actionLevel === 'High' ? "bg-red-50 text-red-600 border-red-100" :
                        result.actionLevel === 'Medium' ? "bg-orange-50 text-orange-600 border-orange-100" :
                        "bg-blue-50 text-blue-600 border-blue-100"
                      )}>
                        <AlertCircle size={18} />
                        <span>Severity: {result.actionLevel}</span>
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
                            <h4 className="font-black text-text">Medicine Suggested</h4>
                            <p className="text-[10px] font-bold text-text/40 uppercase tracking-widest">Chemical Control</p>
                          </div>
                        </div>

                        <div className="space-y-5 flex-1">
                          <div className="bg-[#F9FBF9] p-4 rounded-2xl border border-primary/10">
                            <p className="text-[10px] font-black text-text/30 uppercase tracking-widest mb-1">Product Name</p>
                            <p className="font-black text-primary text-xl tracking-tight">{result.medicine.name}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-bg/50 p-4 rounded-2xl border border-border/50">
                              <p className="text-[10px] font-black text-text/30 uppercase tracking-widest mb-1">Dosage</p>
                              <p className="font-bold text-text/80 text-sm">{result.medicine.dosage}</p>
                            </div>
                            <div className="bg-bg/50 p-4 rounded-2xl border border-border/50">
                              <p className="text-[10px] font-black text-text/30 uppercase tracking-widest mb-1">Method</p>
                              <p className="font-bold text-text/80 text-sm">{result.medicine.method}</p>
                            </div>
                          </div>
                          
                          <div className="bg-bg/50 p-4 rounded-2xl border border-border/50">
                            <p className="text-[10px] font-black text-text/30 uppercase tracking-widest mb-1">Frequency</p>
                            <p className="font-bold text-text/80 text-sm">{result.medicine.frequency}</p>
                          </div>
                        </div>
                      </div>

                      {/* 3. Prevention Tips */}
                      <div className="bg-white border border-border rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-[#F1F8E9] rounded-2xl flex items-center justify-center text-2xl shadow-inner">🌱</div>
                          <div>
                            <h4 className="font-black text-text">Prevention Tips</h4>
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
                    Export Full Report
                  </button>
                  <button className="flex-1 py-5 bg-primary text-white font-black rounded-[1.5rem] hover:bg-primary/90 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2">
                    Save to Farm Log Book
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="bg-[#F1F8F1] border border-[#E8F5E8] rounded-2xl p-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shrink-0">
          <Info size={16} />
        </div>
        <p className="text-xs font-medium text-text/70">
          <span className="font-bold text-primary uppercase tracking-widest mr-2">Supported crops:</span>
          Rice, Wheat, Maize, Tomato, Potato, Cotton, Sugarcane and more.
        </p>
      </div>
    </div>
  );
}
