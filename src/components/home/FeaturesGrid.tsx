import React from 'react';
import { Camera, CloudRain, Sparkles, Bot, BookOpen } from 'lucide-react';
import FeatureCard from '../FeatureCard';

interface FeaturesGridProps {
  onNavigate: (view: 'disease' | 'weather' | 'assistant' | 'analytics' | 'knowledge') => void;
}

export default function FeaturesGrid({ onNavigate }: FeaturesGridProps) {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-8">
      <div className="text-center mb-16">
        <h2 className="mb-4">An Arsenal of Intelligence Tailored for Your Farm</h2>
        <p className="text-text/60 max-w-xl mx-auto font-light">Command your cultivation with unmatched precision using our suite of mission-critical AI tools.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FeatureCard 
          icon={Camera} 
          title="Crop Disease Detection" 
          description="Instant visual diagnosis"
          color="bg-primary"
          delay={0.1}
          onClick={() => onNavigate('disease')}
        />
        <FeatureCard 
          icon={CloudRain} 
          title="Weather Alerts" 
          description="Local micro-climate signals"
          color="bg-primary"
          delay={0.2}
          onClick={() => onNavigate('weather')}
        />
        <FeatureCard 
          icon={Sparkles} 
          title="Crop Recommendation" 
          description="Strategic soil-based advice"
          color="bg-primary"
          delay={0.3}
          onClick={() => onNavigate('weather')}
        />
        <FeatureCard 
          icon={Bot} 
          title="AI Assistant" 
          description="24/7 expert farm support"
          color="bg-primary"
          delay={0.4}
          onClick={() => onNavigate('assistant')}
        />
        <FeatureCard 
          icon={BookOpen} 
          title="Knowledge Hub" 
          description="Learn farming simply"
          color="bg-primary"
          delay={0.5}
          onClick={() => onNavigate('knowledge')}
        />
      </div>
    </section>
  );
}
