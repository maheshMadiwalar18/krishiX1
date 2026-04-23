import React from 'react';
import { Camera, Mic, Upload, CloudRain, HeartPulse, Bell } from 'lucide-react';
import { motion } from 'motion/react';

interface QuickActionProps {
  onScan: () => void;
  onVoice: () => void;
}

export default function InstantTry({ onScan, onVoice }: QuickActionProps) {
  return (
    <section className="max-w-4xl mx-auto px-6 md:px-8 text-center">
      <div className="mb-16">
        <h2 className="mb-4">Ignite Your Farming Transformation</h2>
        <p className="text-text/60 max-w-xl mx-auto font-light">Experience the revolutionary capabilities of AgriGuru. Log in now and witness the impact firsthand.</p>
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
          <h3 className="font-semibold text-text mb-2">Upload Crop Image</h3>
          <p className="text-sm text-text/40 font-light">Drag and drop or click to scan leaf photo</p>
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
          <h3 className="font-semibold mb-2">Voice Assistant</h3>
          <p className="text-sm text-white/60 font-light">Ask any farming question out loud</p>
        </motion.div>
      </div>
    </section>
  );
}
