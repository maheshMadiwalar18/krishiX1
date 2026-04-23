import React from 'react';
import { Camera, Mic, Upload, CloudRain, HeartPulse, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';

interface QuickActionProps {
  onScan: () => void;
  onVoice: () => void;
}

export default function InstantTry({ onScan, onVoice }: QuickActionProps) {
  const { t } = useLanguage();
  return (
    <section className="max-w-4xl mx-auto px-6 md:px-8 text-center">
      <div className="mb-16">
        <h2 className="mb-4">{t('quick_title')}</h2>
        <p className="text-text/60 max-w-xl mx-auto font-light">{t('quick_subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onClick={onScan}
          className="bg-white p-12 rounded-xl border-2 border-dashed border-border hover:border-primary/40 transition-all cursor-pointer group flex flex-col items-center justify-center card-shadow"
        >
          <div className="w-16 h-16 rounded-full bg-bg flex items-center justify-center text-primary/40 mb-6 group-hover:text-primary transition-colors">
            <Upload size={32} strokeWidth={1.5} />
          </div>
          <h3 className="font-semibold text-text mb-2">{t('quick_upload')}</h3>
          <p className="text-sm text-text/40 font-light">{t('quick_upload_desc')}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          onClick={onVoice}
          className="bg-primary p-12 rounded-xl border border-primary hover:bg-primary/95 transition-all cursor-pointer group flex flex-col items-center justify-center text-white card-shadow"
        >
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Mic size={32} strokeWidth={1.5} />
          </div>
          <h3 className="font-semibold mb-2">{t('quick_voice')}</h3>
          <p className="text-sm text-white/60 font-light">{t('quick_voice_desc')}</p>
        </motion.div>
      </div>
    </section>
  );
}
