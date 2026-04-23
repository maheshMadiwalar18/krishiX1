import React, { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: t('assistant_greeting')
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to AI." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-border flex flex-col h-full min-h-[400px] shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
          <Sparkles size={18} />
        </div>
        <div>
          <h3 className="font-bold text-text">{t('feat_ai')}</h3>
          <p className="text-[10px] text-text/40 font-bold uppercase tracking-widest">Online • AI Expert</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 mb-6 overflow-y-auto pr-2 scrollbar-hide">
        {messages.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${msg.role === 'assistant' ? 'bg-bg rounded-tl-none text-text border border-border' : 'bg-primary text-white rounded-tr-none self-end ml-auto'} p-4 rounded-xl max-w-[85%] shadow-sm`}
          >
            <p className="text-sm leading-relaxed">{msg.content}</p>
          </motion.div>
        ))}
        {loading && (
          <div className="bg-bg p-4 rounded-xl rounded-tl-none max-w-[85%] animate-pulse border border-border">
            <p className="text-xs text-text/40 font-bold italic">Thinking...</p>
          </div>
        )}
      </div>

      <div className="relative mt-auto">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder={t('assistant_placeholder')} 
          className="w-full bg-bg border border-border focus:border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none transition-all pr-12 text-text"
        />
        <button 
          onClick={handleSend}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white hover:bg-primary/90 transition-all disabled:opacity-50"
          disabled={loading}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
