import React from 'react';
import { Mic } from 'lucide-react';

interface VoiceCTAProps {
  onTryAssistant: () => void;
}

export default function VoiceCTA({ onTryAssistant }: VoiceCTAProps) {
  return (
    <section className="max-w-4xl mx-auto px-6 md:px-8 text-center">
      <div className="bg-white rounded-2xl p-12 border border-border shadow-soft relative overflow-hidden">
        <div className="flex flex-col items-center max-w-xl mx-auto">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-8">
            <Mic size={32} className="text-primary" />
          </div>
          <h2 className="mb-6">
            Speak Directly to Your Agricultural Brain Trust.
          </h2>
          <p className="text-text/60 mb-10 font-light">
            Bypass the keyboard. Ask complex questions about soil chemistry, pest mitigation, or market trends, and get instant, expert-level vocal guidance.
          </p>
          <button 
            onClick={onTryAssistant}
            className="px-10 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg active:scale-95"
          >
            Start Voice Assistant
          </button>
        </div>
      </div>
    </section>
  );
}
