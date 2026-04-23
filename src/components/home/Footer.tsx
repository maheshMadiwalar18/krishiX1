import React from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface FooterProps {
  onNavigate: (view: 'home' | 'disease' | 'weather' | 'assistant') => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { t } = useLanguage();
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
            {t('footer_tagline')}
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-text mb-4 uppercase tracking-widest text-[10px]">{t('footer_product')}</h4>
          <ul className="space-y-3 text-sm text-text/60 font-medium">
            <li onClick={() => onNavigate('disease')} className="hover:text-primary cursor-pointer transition-colors">{t('footer_disease')}</li>
            <li onClick={() => onNavigate('weather')} className="hover:text-primary cursor-pointer transition-colors">{t('footer_weather_alerts')}</li>
            <li onClick={() => onNavigate('weather')} className="hover:text-primary cursor-pointer transition-colors">{t('footer_crop_rec')}</li>
            <li onClick={() => onNavigate('assistant')} className="hover:text-primary cursor-pointer transition-colors">{t('footer_voice')}</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-text mb-4 uppercase tracking-widest text-[10px]">{t('footer_portal')}</h4>
          <ul className="space-y-3 text-sm text-text/60 font-medium">
            <li onClick={() => onNavigate('disease')} className="hover:text-primary cursor-pointer transition-colors">{t('footer_scanner')}</li>
            <li className="hover:text-primary cursor-pointer transition-colors">Success Stories</li>
            <li className="hover:text-primary cursor-pointer transition-colors">Careers</li>
            <li className="hover:text-primary cursor-pointer transition-colors">Blog</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-text mb-4 uppercase tracking-widest text-[10px]">{t('footer_connect')}</h4>
          <ul className="space-y-3 text-sm text-text/60 font-medium">
            <li className="hover:text-primary cursor-pointer transition-colors">{t('footer_contact')}</li>
            <li className="hover:text-primary cursor-pointer transition-colors">GitHub</li>
            <li className="hover:text-primary cursor-pointer transition-colors">Twitter (X)</li>
            <li className="hover:text-primary cursor-pointer transition-colors">{t('footer_community')}</li>
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
