import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  ChevronLeft, 
  Send, 
  Volume2, 
  Sparkles,
  Sprout,
  User as UserIcon,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function VoiceAssistant({ onBack }: { onBack: () => void }) {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Namaste! I am KrushiX. How can I help with your farming today?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    setIsListening(true);
    // In a real app, we'd start Web Speech API here
  };

  const stopListening = () => {
    setIsListening(false);
    // Simulation: user asked a question after listening
    const userQuery = "How much urea should I use for 2 acres of wheat?";
    handleNewMessage(userQuery, 'user');
    
    // Simulate AI thinking and replying
    setTimeout(() => {
      const aiResponse = "For 2 acres of wheat, you typically need about 80-100 kg of Urea as a top dressing. However, I recommend checking your specific soil test report first for exact dosage.";
      handleNewMessage(aiResponse, 'assistant');
    }, 1500);
  };

  const handleNewMessage = (content: string, role: 'user' | 'assistant') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendText = () => {
    if (!inputText.trim()) return;
    handleNewMessage(inputText, 'user');
    setInputText('');
    
    setTimeout(() => {
      handleNewMessage("I've noted your question. Let me analyze your farm data...", 'assistant');
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-160px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-white border border-border rounded-xl flex items-center justify-center text-text hover:bg-bg transition-colors shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-display font-extrabold text-text">AI Voice Assistant</h1>
            <p className="text-text/60 text-sm">Ask anything about farming in your language</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Active</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white border border-border rounded-3xl card-shadow overflow-hidden flex flex-col mb-6 relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex items-start gap-3 max-w-[85%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-primary/10 overflow-hidden",
                  msg.role === 'assistant' ? "bg-white p-1" : "bg-primary text-white"
                )}>
                  {msg.role === 'assistant' ? <img src="/logo.png" alt="KrushiX" className="w-full h-full object-contain" /> : <UserIcon size={18} />}
                </div>
                <div className={cn(
                  "p-4 rounded-2xl relative",
                  msg.role === 'assistant' 
                    ? "bg-nature-bg/30 text-text rounded-tl-none border border-primary/5" 
                    : "bg-primary text-white rounded-tr-none shadow-sm"
                )}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <span className={cn(
                    "block text-[9px] mt-2 opacity-50",
                    msg.role === 'user' ? "text-right" : ""
                  )}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {msg.role === 'assistant' && (
                  <button className="mt-4 p-1.5 text-primary/40 hover:text-primary transition-colors">
                    <Volume2 size={16} />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Voice Animation Overlay */}
        <AnimatePresence>
          {isListening && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center"
            >
              <div className="flex items-center gap-1.5 mb-8">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      height: [15, i % 2 === 0 ? 60 : 30, 15],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 0.8, 
                      delay: i * 0.05 
                    }}
                    className="w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(46,125,50,0.3)]"
                  />
                ))}
              </div>
              <p className="text-primary font-bold text-lg animate-pulse mb-2">Listening...</p>
              <p className="text-text/40 text-sm">Speak now, I am here to help.</p>
              
              <button 
                onClick={stopListening}
                className="mt-12 w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center border border-red-100 hover:bg-red-100 transition-all"
              >
                <X size={24} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Controls */}
        <div className="p-4 border-t border-border bg-bg/10">
          <div className="flex items-center gap-3">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
              placeholder="Ask anything about farming..." 
              className="flex-1 bg-white border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/30 transition-all"
            />
            {inputText.trim() ? (
              <button 
                onClick={handleSendText}
                className="w-11 h-11 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 transition-all shadow-md"
              >
                <Send size={18} />
              </button>
            ) : (
              <div className="w-11 h-11 relative">
                <motion.div 
                  className="absolute inset-0 bg-primary/20 rounded-xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
                <button 
                  onClick={toggleListening}
                  className="relative w-full h-full bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 transition-all shadow-md z-10"
                >
                  <Mic size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Suggested Queries */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
        {[
          "Optimal planting season?",
          "Soil test near me",
          "Government subsidies",
          "Pest control tips"
        ].map((query) => (
          <button 
            key={query}
            onClick={() => handleNewMessage(query, 'user')}
            className="whitespace-nowrap px-4 py-2 bg-white border border-border rounded-full text-xs font-semibold text-text/60 hover:border-primary/40 hover:text-primary transition-all shadow-sm"
          >
            {query}
          </button>
        ))}
      </div>
    </div>
  );
}
