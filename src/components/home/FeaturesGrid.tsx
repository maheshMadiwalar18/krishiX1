import React from 'react';
import { Camera, CloudRain, Sparkles, Bot, BookOpen, Brain, Droplet } from 'lucide-react';
import FeatureCard from '../FeatureCard';
import { useLanguage } from '../../contexts/LanguageContext';

interface FeaturesGridProps {
  onNavigate: (view: 'disease' | 'weather' | 'assistant' | 'knowledge' | 'planning' | 'irrigation') => void;
}

export default function FeaturesGrid({ onNavigate }: FeaturesGridProps) {
  const { t } = useLanguage();
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-8">
      <div className="text-center mb-16">
        <h2 className="mb-4">{t('features_title')}</h2>
        <p className="text-text/60 max-w-xl mx-auto font-light">{t('features_subtitle')}</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard 
          icon={Camera} 
          title={t('feat_disease')} 
          description={t('feat_disease_desc')}
          color="bg-primary"
          delay={0.1}
          onClick={() => onNavigate('disease')}
        />
        <FeatureCard 
          icon={CloudRain} 
          title={t('feat_weather')} 
          description={t('feat_weather_desc')}
          color="bg-primary"
          delay={0.2}
          onClick={() => onNavigate('weather')}
        />
        <FeatureCard 
          icon={Brain} 
          title={t('nav_decision_system')} 
          description={t('decision_subtitle')}
          color="bg-primary"
          delay={0.3}
          onClick={() => onNavigate('planning')}
        />
        <FeatureCard 
          icon={Droplet} 
          title={t('irrigation_title')} 
          description="Smart watering schedules for your crops."
          color="bg-primary"
          delay={0.35}
          onClick={() => onNavigate('irrigation')}
        />
        <FeatureCard 
          icon={Bot} 
          title={t('feat_ai')} 
          description={t('feat_ai_desc')}
          color="bg-primary"
          delay={0.4}
          onClick={() => onNavigate('assistant')}
        />
        <FeatureCard 
          icon={BookOpen} 
          title={t('feat_knowledge')} 
          description={t('feat_knowledge_desc')}
          color="bg-primary"
          delay={0.5}
          onClick={() => onNavigate('knowledge')}
        />
      </div>
    </section>
  );
}

