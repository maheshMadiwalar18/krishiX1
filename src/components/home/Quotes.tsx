import React, { useState, useEffect } from 'react';
import { Quote as QuoteIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const quotes = [
  { text: "The farmer is the backbone of our nation.", author: "Indian Proverb" },
  { text: "Smart farming is not the future—it’s the present.", author: "AgriGuru Vision" }
];

export default function Quotes() {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="max-w-4xl mx-auto px-4 text-center">
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentQuote}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-4"
        >
          <QuoteIcon className="mx-auto text-primary/20" size={48} />
          <p className="text-2xl md:text-3xl font-display font-bold text-text italic leading-snug">
            “{quotes[currentQuote].text}”
          </p>
          <p className="text-primary font-bold uppercase tracking-widest text-xs">
            — {quotes[currentQuote].author}
          </p>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
