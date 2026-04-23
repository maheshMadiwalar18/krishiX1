import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';

interface HeroProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onDashboard: () => void;
  onAssistant: () => void;
}

export default function Hero({ isLoggedIn, onLogin, onDashboard, onAssistant }: HeroProps) {
  const { t } = useLanguage();

  return (
    <section className="relative h-[650px] -mt-24 flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="/hero-bg-v2.png" 
          className="w-full h-full object-cover scale-105 animate-slow-zoom"
          alt="Farmland background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 w-full text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#14532D] border border-white/5 rounded-full text-[#A7F3D0] text-xs md:text-sm font-medium uppercase tracking-wider mb-8 shadow-2xl">
            Your AI Farming Platform
          </div>
          
          <h1 className="text-white mb-6 text-[36px] md:text-[56px] lg:text-[64px] tracking-tight leading-[1.15] font-display font-bold md:font-extrabold px-2">
            Empowering Farmers for a <br className="hidden md:block" />
            <span className="text-[#22C55E]">Viksit Bharat</span>
          </h1>
          
          <p className="text-lg md:text-[20px] text-[#D1D5DB] mb-12 max-w-2xl mx-auto font-sans font-normal leading-relaxed px-4">
            Smart tools, better decisions, and stronger growth for every farmer.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 px-6">
            <button 
              onClick={() => onDashboard()} 
              className="w-full sm:w-auto px-12 py-4 bg-[#166534] text-white rounded-xl font-bold hover:bg-[#064e3b] transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95"
            >
              Start Scanning
            </button>
            <button 
              onClick={() => onAssistant()}
              className="w-full sm:w-auto px-12 py-4 bg-white text-[#166534] border-2 border-[#166534] rounded-xl font-bold hover:bg-neutral-50 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
            >
              Ask Assistant
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

