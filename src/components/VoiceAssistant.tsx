import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
  Mic,
  ChevronLeft,
  Send,
  Volume2,
  Sprout,
  User as UserIcon,
  Loader2,
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

// ✅ PERFORMANCE: Memoized Message Component
const ChatMessage = memo(({ msg }: { msg: Message }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    className={cn(
      "flex gap-3 max-w-[85%] mb-4",
      msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
    )}
  >
    <div className={cn(
      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
      msg.role === 'assistant' ? 'bg-white border border-border text-primary' : 'bg-primary text-white'
    )}>
      {msg.role === 'assistant' ? <Sprout size={16} /> : <UserIcon size={16} />}
    </div>

    <div className={cn(
      "p-3.5 rounded-2xl text-sm shadow-sm",
      msg.role === 'assistant'
        ? 'bg-white border border-border text-text'
        : 'bg-primary text-white'
    )}>
      <p className="leading-relaxed">{msg.content}</p>
    </div>
  </motion.div>
));

export default function VoiceAssistant({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Namaste! I am KrushiX. How can I help with your farming today?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en-US');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ✅ TEXT TO SPEECH (TTS)
  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLang;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [selectedLang]);

  // ✅ PERFORMANCE: Smooth scroll with threshold
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleNewMessage = useCallback((content: string, role: 'user' | 'assistant') => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date()
    }]);

    if (role === 'assistant') {
      speak(content);
    }
  }, [speak]);

  // ✅ PERFORMANCE: Optimized API Call
  const callChatbotAPI = useCallback(async (message: string) => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message,
          language: selectedLang === 'kn-IN' ? 'Kannada' : (selectedLang === 'hi-IN' ? 'Hindi' : 'English')
        })
      });

      if (!response.ok) throw new Error("Server error");
      
      const data = await response.json();
      handleNewMessage(data?.reply || "I couldn't process that. Please try again.", 'assistant');
    } catch (error) {
      handleNewMessage("Connection issues. Please check your internet or local AI.", 'assistant');
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, handleNewMessage]);

  const handleSendText = useCallback(() => {
    const text = inputText.trim();
    if (!text || isGenerating) return;

    handleNewMessage(text, 'user');
    setInputText('');
    callChatbotAPI(text);
  }, [inputText, isGenerating, handleNewMessage, callChatbotAPI]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser.');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = selectedLang;

    recognitionRef.current.onstart = () => setIsListening(true);
    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        handleNewMessage(transcript, 'user');
        callChatbotAPI(transcript);
      }
    };

    recognitionRef.current.start();
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-160px)] flex flex-col pb-4">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white border border-border rounded-xl flex items-center justify-center hover:bg-bg transition-all active:scale-95 shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-text tracking-tight">AgriGuru Assistant</h1>
            <p className="text-xs font-bold text-text/40 uppercase tracking-widest">Powered by Local AI</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="text-xs font-bold bg-white border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="en-US">English</option>
            <option value="kn-IN">ಕನ್ನಡ (Kannada)</option>
            <option value="hi-IN">हिन्दी (Hindi)</option>
          </select>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-green-700 uppercase">Live System</span>
          </div>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 bg-white border border-border rounded-[2.5rem] overflow-hidden flex flex-col shadow-sm relative">
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} msg={msg} />
          ))}

          {/* ✅ PERFORMANCE: Typing Indicator */}
          {isGenerating && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex gap-3 mb-4"
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center">
                <Loader2 size={16} className="text-primary animate-spin" />
              </div>
              <div className="bg-bg/50 px-4 py-2 rounded-2xl flex gap-1 items-center">
                <span className="w-1 h-1 bg-text/20 rounded-full animate-bounce" />
                <span className="w-1 h-1 bg-text/20 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1 h-1 bg-text/20 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="p-4 bg-bg/30 border-t border-border backdrop-blur-md">
          <div className="flex gap-2 max-w-2xl mx-auto">
            <button
              onClick={isSpeaking ? stopSpeaking : () => {}}
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-lg",
                isSpeaking ? "bg-orange-500 text-white animate-pulse" : "bg-white border border-border text-text/20 cursor-not-allowed"
              )}
              title={isSpeaking ? "Stop speaking" : "Not speaking"}
            >
              <Volume2 size={18} />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isGenerating && handleSendText()}
              placeholder={isGenerating ? "AI is thinking..." : "Ask your farm expert..."}
              disabled={isGenerating}
              className="flex-1 bg-white border border-border rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
            />

            <button
              onClick={handleSendText}
              disabled={!inputText.trim() || isGenerating}
              className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              <Send size={18} />
            </button>

            <button
              onClick={toggleListening}
              disabled={isGenerating}
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-lg",
                isListening ? "bg-red-500 text-white animate-pulse" : "bg-white border border-border text-text hover:bg-bg"
              )}
            >
              <Mic size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}