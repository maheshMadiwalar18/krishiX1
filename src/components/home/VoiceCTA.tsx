import React from 'react';
import { Mic } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface VoiceCTAProps {
  onTryAssistant: () => void;
}

export default function VoiceCTA({ onTryAssistant }: VoiceCTAProps) {
  const { t } = useLanguage();
  return (
    <section className="max-w-4xl mx-auto px-6 md:px-8 text-center">
      <div className="bg-white rounded-2xl p-12 border border-border shadow-soft relative overflow-hidden">
        <div className="flex flex-col items-center max-w-xl mx-auto">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-8">
            <Mic size={32} className="text-primary" />
          </div>
          <h2 className="mb-6">
            {t('voice_title')}
          </h2>
          <p className="text-text/60 mb-10 font-light">
            {t('voice_subtitle')}
          </p>
          <button 
            onClick={onTryAssistant}
            className="px-10 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg active:scale-95"
          >
            {t('btn_start_voice')}
          </button>
        </div>
      </div>
    </section>
  );
}
