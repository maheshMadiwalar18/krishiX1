import React from 'react';
import { Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'disease' | 'weather' | 'assistant' | 'analytics') => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="pt-20 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 pb-12">
        <div className="col-span-1 md:col-span-1 space-y-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <Sparkles size={18} />
            </div>
            <span className="text-xl font-display font-black flex items-center">
              <span className="text-primary tracking-tighter">Krushi</span>
              <span className="text-primary-light">X</span>
            </span>
          </div>
          <p className="text-sm text-text/60 leading-relaxed">
            Empower your farming journey with AI-driven insights and localized recommendations designed for maximum yield.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-text mb-4 uppercase tracking-widest text-[10px]">Product</h4>
          <ul className="space-y-3 text-sm text-text/60 font-medium">
            <li onClick={() => onNavigate('disease')} className="hover:text-primary cursor-pointer transition-colors">Disease Detection</li>
            <li onClick={() => onNavigate('weather')} className="hover:text-primary cursor-pointer transition-colors">Weather Alerts</li>
            <li onClick={() => onNavigate('weather')} className="hover:text-primary cursor-pointer transition-colors">Crop Recommendations</li>
            <li onClick={() => onNavigate('assistant')} className="hover:text-primary cursor-pointer transition-colors">AI Voice Expert</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-text mb-4 uppercase tracking-widest text-[10px]">Portal</h4>
          <ul className="space-y-3 text-sm text-text/60 font-medium">
            <li onClick={() => onNavigate('analytics')} className="hover:text-primary cursor-pointer transition-colors">Farmer Dashboard</li>
            <li className="hover:text-primary cursor-pointer transition-colors">Success Stories</li>
            <li className="hover:text-primary cursor-pointer transition-colors">Careers</li>
            <li className="hover:text-primary cursor-pointer transition-colors">Blog</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-text mb-4 uppercase tracking-widest text-[10px]">Connect</h4>
          <ul className="space-y-3 text-sm text-text/60 font-medium">
            <li className="hover:text-primary cursor-pointer transition-colors">Contact Support</li>
            <li className="hover:text-primary cursor-pointer transition-colors">GitHub</li>
            <li className="hover:text-primary cursor-pointer transition-colors">Twitter (X)</li>
            <li className="hover:text-primary cursor-pointer transition-colors">Community Forum</li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-border py-8 text-center bg-bg/50 backdrop-blur-sm">
        <p className="text-[10px] font-bold text-text/30 uppercase tracking-[0.4em]">
          KrushiX Systems • Built with Love for Farmers • © 2026
        </p>
      </div>
    </footer>
  );
}
