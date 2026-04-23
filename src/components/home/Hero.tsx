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
          src="/hero-bg.png" 
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
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/80 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
            <Sparkles size={12} className="text-primary-light" />
            Your AI Farming Expert
          </div>
          <h1 className="text-white mb-6 text-5xl lg:text-6xl tracking-tight leading-[1.1] font-display font-black">
            {t('home_hero_title')}
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            {t('home_hero_subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => onDashboard()} 
              className="w-full sm:w-auto px-10 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg group"
            >
              {t('btn_scan_now')}
            </button>
            <button 
              onClick={() => onAssistant()}
              className="w-full sm:w-auto px-10 py-4 bg-white text-primary rounded-xl font-bold hover:bg-neutral-50 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {t('btn_ask_ai')}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

