import React from 'react';
import Hero from './home/Hero';
import InstantTry from './home/QuickActions';
import FeaturesGrid from './home/FeaturesGrid';
import SmartPreview from './home/DashboardPreview';
import VoiceCTA from './home/VoiceCTA';
import Footer from './home/Footer';

interface HomeProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onNavigate: (view: 'disease' | 'weather' | 'assistant' | 'knowledge') => void;
}

export default function Home({ isLoggedIn, onLogin, onNavigate }: HomeProps) {
  return (
    <div className="space-y-40 pb-20">
      <Hero 
        isLoggedIn={isLoggedIn} 
        onLogin={onLogin} 
        onDashboard={() => onNavigate('disease')} 
        onAssistant={() => onNavigate('assistant')}
      />

      <InstantTry 
        onScan={() => onNavigate('disease')}
        onVoice={() => onNavigate('assistant')}
      />
      
      <FeaturesGrid 
        onNavigate={onNavigate} 
      />
      
      <SmartPreview 
        isLoggedIn={isLoggedIn} 
        onLogin={onLogin} 
        onViewDashboard={() => onNavigate('disease')} 
      />
      
      <VoiceCTA 
        onTryAssistant={() => onNavigate('assistant')} 
      />
      
      <Footer onNavigate={(v) => {
        if (v === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
        else onNavigate(v as any);
      }} />
    </div>
  );
}

