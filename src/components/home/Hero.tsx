import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onDashboard: () => void;
  onAssistant: () => void;
}

export default function Hero({ isLoggedIn, onLogin, onDashboard, onAssistant }: HeroProps) {
  return (
    <section className="relative h-[650px] -mt-24 flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover"
          alt="Farmland background"
        />
        <div className="absolute inset-0 bg-black/60" />
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
          <h1 className="text-white mb-6 text-5xl lg:text-6xl tracking-tight leading-[1.1]">
            Cultivating the Future of Bharat.<br />One Yield at a Time.
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Empower your farming journey with AI-driven insights and localized recommendations designed for maximum yield.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => onDashboard()} 
              className="w-full sm:w-auto px-10 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg group"
            >
              Scan Crop Now
            </button>
            <button 
              onClick={() => onAssistant()}
              className="w-full sm:w-auto px-10 py-4 bg-white text-primary rounded-xl font-bold hover:bg-neutral-50 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              Ask AI
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
