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
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useNotification } from './ui/Notification';

export default function DiseaseDetection({ onBack }: { onBack: () => void }) {
  const { addNotification } = useNotification();
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addNotification('error', 'Image size too large. Max 5MB allowed.');
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
        pesticide: "Propiconazole 25% EC",
        steps: [
          "Apply fungicide at first appearance of symptoms.",
          "Avoid excessive nitrogen fertilization.",
          "Ensure proper field drainage.",
          "Keep the field weed-free."
        ]
      });
      addNotification('success', 'Scan completed. Disease identified.');
    }, 2800);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack}
          className="w-10 h-10 bg-white border border-border rounded-xl flex items-center justify-center text-text hover:bg-bg transition-colors shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-display font-extrabold text-text">Crop Disease Detection</h1>
          <p className="text-text/60 text-sm">Upload a photo to get instant AI analysis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div 
            className={cn(
              "relative bg-white border-2 border-dashed border-border rounded-3xl p-4 aspect-square flex flex-col items-center justify-center overflow-hidden card-shadow group transition-all",
              image ? "border-primary/20" : "hover:border-primary/40"
            )}
          >
            {image ? (
              <>
                <img src={image} className="w-full h-full object-cover rounded-2xl" alt="Preview" />
                <button 
                  onClick={() => { setImage(null); setResult(null); }}
                  className="absolute top-6 right-6 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md hover:bg-black/70 transition-all"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-bg rounded-full flex items-center justify-center text-primary mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Upload size={32} />
                </div>
                <p className="font-bold text-text mb-1">Click to Upload</p>
                <p className="text-sm text-text/40">or drag and drop your photo</p>
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  accept="image/*"
                  onChange={handleUpload}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-border rounded-xl font-bold text-sm text-text hover:bg-bg transition-all shadow-sm">
              <Camera size={18} className="text-primary" />
              Use Camera
            </button>
            <button 
              onClick={handleScan}
              disabled={!image || isScanning}
              className={cn(
                "flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-sm",
                !image || isScanning 
                  ? "bg-text/10 text-text/30 cursor-not-allowed" 
                  : "bg-primary text-white hover:bg-primary/90 active:scale-95"
              )}
            >
              <ScanSearch size={18} />
              {isScanning ? "Scanning..." : "Start AI Analysis"}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="min-h-0">
          <AnimatePresence mode="wait">
            {!isScanning && !result && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full bg-white border border-border rounded-3xl p-8 flex flex-col items-center justify-center text-center card-shadow"
              >
                <div className="w-16 h-16 bg-bg rounded-full flex items-center justify-center text-primary/20 mb-4 font-bold text-2xl">
                  ?
                </div>
                <h3 className="font-bold text-text mb-2">No Results Yet</h3>
                <p className="text-sm text-text/50">Upload an image and start scanning to see AI disease insights here.</p>
              </motion.div>
            )}

            {isScanning && (
              <motion.div 
                key="scanning"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="h-full bg-white border border-border rounded-3xl p-8 flex flex-col items-center justify-center text-center card-shadow relative overflow-hidden"
              >
                <div className="absolute inset-x-0 h-1 bg-primary/20 top-0 overflow-hidden">
                   <motion.div 
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="w-1/2 h-full bg-primary"
                   />
                </div>
                <div className="w-20 h-20 border-4 border-bg border-t-primary rounded-full animate-spin mb-6" />
                <h3 className="font-bold text-text text-xl mb-2 italic">Scanning Image...</h3>
                <p className="text-sm text-text/50">Our AI is analyzing pixel patterns for symptoms.</p>
              </motion.div>
            )}

            {result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Main Identity */}
                <div className="bg-white border border-border rounded-3xl p-6 shadow-md border-t-4 border-t-accent relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Bug size={100} />
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest bg-accent px-3 py-1 rounded-full text-text shadow-sm">
                      Pest Detected
                    </span>
                    <div className="flex items-center gap-1 text-primary font-bold text-sm">
                      <ShieldCheck size={16} />
                      {result.confidence} Confidence
                    </div>
                  </div>

                  <h2 className="text-3xl font-display font-extrabold text-text mb-1">{result.name}</h2>
                  <p className="text-sm text-text/60 font-medium">Fungal infection identified by leaf yellowing patterns.</p>
                </div>

                {/* Treatment Details */}
                <div className="bg-white border border-border rounded-3xl overflow-hidden card-shadow">
                  <div className="bg-bg p-4 border-b border-border flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <CheckCircle2 className="text-primary" size={20} />
                       <h3 className="font-bold text-text">Treatment Plan</h3>
                     </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <p className="text-[10px] font-bold text-text/40 uppercase tracking-wider mb-2">Suggested Pesticide</p>
                      <div className="flex items-center gap-3 bg-nature-bg/30 p-3 rounded-xl border border-primary/10">
                        <div className="p-2 bg-primary rounded-lg text-white">
                          <AlertCircle size={20} />
                        </div>
                        <p className="font-bold text-primary">{result.pesticide}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-text/40 uppercase tracking-wider mb-3">Steps to recover</p>
                      <div className="space-y-3">
                        {result.steps.map((step: string, i: number) => (
                          <div key={i} className="flex gap-3">
                            <span className="w-5 h-5 min-w-[20px] bg-bg rounded-md flex items-center justify-center text-[10px] font-bold text-primary">
                              {i + 1}
                            </span>
                            <p className="text-sm text-text/70">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg active:scale-95">
                  Save to Log
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
