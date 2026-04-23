import { Sparkles, Send } from 'lucide-react';
import { motion } from 'motion/react';

export default function AIAssistant() {
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
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-nature-bg p-4 rounded-xl rounded-tl-none max-w-[85%]"
        >
          <p className="text-sm leading-relaxed">
            Namaste! I've analyzed your wheat field data. Soil moisture is optimal, but there is a 30% chance of yellow rust in the northern block. Would you like a treatment plan?
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-primary text-white p-4 rounded-xl rounded-tr-none max-w-[85%] self-end ml-auto"
        >
          <p className="text-sm leading-relaxed">
            Yes, please suggest organic treatments.
          </p>
        </motion.div>
      </div>

      <div className="relative mt-auto">
        <input 
          type="text" 
          placeholder="Ask Krishi AI..." 
          className="w-full bg-nature-bg border-2 border-transparent focus:border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none transition-all pr-12 text-nature-text"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white hover:bg-primary/90 transition-all">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
