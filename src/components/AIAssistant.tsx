import React, { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { motion } from 'motion/react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Namaste! I've analyzed your wheat field data. Soil moisture is optimal, but there is a 30% chance of yellow rust in the northern block. Would you like a treatment plan?"
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
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl card-shadow border border-white/50 flex flex-col h-full min-h-[400px]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
          <Sparkles size={18} className="text-nature-text" />
        </div>
        <div>
          <h3 className="font-bold">Krishi AI Assistant</h3>
          <p className="text-xs text-nature-text/50">Online • Always helpful</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 mb-6 overflow-y-auto pr-2">
        {messages.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${msg.role === 'assistant' ? 'bg-nature-bg rounded-tl-none' : 'bg-primary text-white rounded-tr-none self-end ml-auto'} p-4 rounded-xl max-w-[85%]`}
          >
            <p className="text-sm leading-relaxed">{msg.content}</p>
          </motion.div>
        ))}
        {loading && (
          <div className="bg-nature-bg p-4 rounded-xl rounded-tl-none max-w-[85%] animate-pulse">
            <p className="text-sm">Thinking...</p>
          </div>
        )}
      </div>

      <div className="relative mt-auto">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Krishi AI..." 
          className="w-full bg-nature-bg border-2 border-transparent focus:border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none transition-all pr-12 text-nature-text"
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
