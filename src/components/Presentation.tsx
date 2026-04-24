import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Home, Layout, Cpu, Users, Zap, Target, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    id: 1,
    title: "KrishiX",
    subtitle: "Smart Farming Assistant",
    content: "A simple digital companion for the modern farmer.",
    footer: "Presented by Team AgriGuru",
    type: "title"
  },
  {
    id: 2,
    title: "The Problem",
    icon: <Target className="text-red-500" size={32} />,
    content: "Farming today is getting harder due to a few big reasons:",
    bullets: [
      "A lot of water is wasted because we don't know the exact crop requirement.",
      "Weather is becoming very unpredictable, making it hard to plan.",
      "Diseases often destroy crops because they aren't caught early enough.",
      "Most digital tools are too complicated for a regular farmer to use."
    ]
  },
  {
    id: 3,
    title: "Our Solution",
    icon: <Layout className="text-primary" size={32} />,
    content: "We built KrishiX to be a 'helper' rather than just another app.",
    bullets: [
      "It combines AI with real-time weather data to give simple advice.",
      "The goal is to remove the guesswork from farming.",
      "It tells you exactly what to do, in a way that's easy to understand."
    ]
  },
  {
    id: 4,
    title: "Key Features",
    icon: <Zap className="text-yellow-500" size={32} />,
    content: "Here's what the system can actually do:",
    bullets: [
      "Smart Irrigation: Calculating water needs to save every drop.",
      "Crop Decision: Suggesting what to plant based on climate and soil.",
      "Disease Detection: Scanning crop photos to find pests or diseases.",
      "Weather Intelligence: Simple risk levels (Low/Medium/High) for the week.",
      "Community: A place for farmers to help each other out."
    ]
  },
  {
    id: 5,
    title: "What makes it unique?",
    icon: <Cpu className="text-blue-500" size={32} />,
    content: "We didn't want to just make a 'cloud-only' app.",
    bullets: [
      "Offline AI: Using Ollama so it works even with poor connectivity.",
      "Farmer-First UI: Large buttons, minimal text, and high-contrast design.",
      "Language Support: Designed to work with local context and languages."
    ]
  },
  {
    id: 6,
    title: "The Technology",
    icon: <Cpu className="text-gray-600" size={32} />,
    content: "We used a modern stack to ensure the app is fast and reliable:",
    bullets: [
      "Frontend: React for a smooth, responsive user interface.",
      "Backend: Node.js handling the logic and API integrations.",
      "Intelligence: Ollama (local AI) and Gemini (cloud AI) working together.",
      "Data: AccuWeather API for accurate, real-time climate tracking."
    ]
  },
  {
    id: 7,
    title: "The Workflow",
    icon: <Rocket className="text-purple-500" size={32} />,
    content: "We kept the process very straightforward:",
    bullets: [
      "Input: The farmer provides a photo, location, or just asks a question.",
      "Process: Our AI analyzes the data locally first to save time and data.",
      "Output: A clear, 3-step action plan is shown on the screen."
    ]
  },
  {
    id: 8,
    title: "The Impact",
    icon: <Users className="text-green-600" size={32} />,
    content: "What does this mean for the farmer?",
    bullets: [
      "Better Yield: Catching diseases early means fewer crops are lost.",
      "Resource Saving: Using only the water that is actually needed.",
      "Confidence: Having an expert 'brain' in your pocket at all times."
    ]
  },
  {
    id: 9,
    title: "Future Scope",
    icon: <Rocket className="text-blue-600" size={32} />,
    content: "This is just the beginning for KrishiX:",
    bullets: [
      "Mobile App: Reaching more farmers through a dedicated Android app.",
      "Voice Mode: Allowing farmers to just speak to the AI in their language.",
      "Market Links: Directly connecting farmers to current market prices."
    ]
  },
  {
    id: 10,
    title: "In Conclusion",
    content: "We believe technology should solve real problems on the ground. KrishiX is our attempt to make farming a bit more predictable and a lot more efficient. \n\nIt's a small step, but we think it can make a big difference. \n\nThank you for listening!",
    type: "conclusion"
  }
];

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 bg-[#F8FAFC] z-[100] flex flex-col font-sans text-slate-800">
      {/* Top Bar */}
      <div className="h-16 px-8 flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black italic">K</div>
          <span className="font-bold text-slate-400">KrishiX Presentation</span>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-colors"
        >
          <Home size={18} /> Exit
        </button>
      </div>

      {/* Slide Area */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-20 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-5xl w-full"
          >
            {slide.type === 'title' ? (
              <div className="text-center space-y-8">
                <motion.div 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="inline-block p-4 bg-primary/5 rounded-[2rem] border border-primary/10 mb-6"
                >
                  <div className="w-24 h-24 bg-primary rounded-[1.5rem] flex items-center justify-center text-white text-5xl font-black italic shadow-2xl">K</div>
                </motion.div>
                <h1 className="text-7xl md:text-9xl font-display font-black text-text tracking-tighter leading-none">{slide.title}</h1>
                <p className="text-2xl md:text-3xl font-bold text-primary italic opacity-80">{slide.subtitle}</p>
                <div className="pt-12">
                  <p className="text-xl text-slate-400 font-medium">{slide.footer}</p>
                </div>
              </div>
            ) : slide.type === 'conclusion' ? (
              <div className="space-y-10 max-w-3xl mx-auto">
                <h2 className="text-5xl md:text-6xl font-display font-black text-text leading-tight">{slide.title}</h2>
                <p className="text-2xl md:text-3xl text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                  {slide.content}
                </p>
                <div className="pt-10 flex gap-4">
                  <button 
                    onClick={() => navigate('/')}
                    className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95"
                  >
                    Launch Platform
                  </button>
                  <button 
                    onClick={() => setCurrentSlide(0)}
                    className="px-8 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all active:scale-95"
                  >
                    Restart Slides
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                <div className="md:col-span-7 space-y-10">
                  <div className="flex items-center gap-4">
                    {slide.icon}
                    <h2 className="text-5xl md:text-6xl font-display font-black text-text leading-tight tracking-tight">
                      {slide.title}
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    <p className="text-xl md:text-2xl text-slate-500 font-bold italic leading-relaxed">
                      "{slide.content}"
                    </p>
                    
                    <ul className="space-y-5">
                      {slide.bullets?.map((bullet, index) => (
                        <motion.li 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + (index * 0.1) }}
                          key={index} 
                          className="flex items-start gap-4"
                        >
                          <div className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                          <span className="text-lg md:text-xl font-medium text-slate-700 leading-relaxed">
                            {bullet}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="hidden md:block md:col-span-5 relative">
                  <div className="absolute -inset-10 bg-primary/5 rounded-full blur-3xl" />
                  <div className="relative aspect-square bg-white border border-slate-200 rounded-[3rem] shadow-2xl flex items-center justify-center p-12 overflow-hidden group">
                     {/* Abstract decorative element */}
                     <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full border-[40px] border-primary rounded-full scale-150 transform -translate-x-1/2 -translate-y-1/2" />
                     </div>
                     <div className="text-primary opacity-20 scale-[4] transition-transform duration-1000 group-hover:scale-[4.5]">
                       {slide.icon}
                     </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="h-24 px-8 md:px-20 flex items-center justify-between bg-white border-t border-slate-100">
        <div className="flex items-center gap-4">
          <div className="text-sm font-black text-slate-300 uppercase tracking-widest">
            Slide {currentSlide + 1} <span className="mx-2 opacity-30">/</span> {slides.length}
          </div>
          <div className="h-1.5 w-40 bg-slate-100 rounded-full overflow-hidden">
             <motion.div 
              animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
              className="h-full bg-primary rounded-full"
             />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95 ${
              currentSlide === 0 
              ? "text-slate-200 bg-slate-50 cursor-not-allowed" 
              : "text-slate-600 bg-white border border-slate-200 hover:border-primary hover:text-primary shadow-sm"
            }`}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className={`px-8 h-14 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 font-black ${
              currentSlide === slides.length - 1 
              ? "text-slate-200 bg-slate-50 cursor-not-allowed" 
              : "text-white bg-primary shadow-xl shadow-primary/20 hover:scale-105"
            }`}
          >
            {currentSlide === slides.length - 1 ? "End" : "Next"} <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Progress Bubbles (Quick Nav) */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSlide === i ? "h-8 bg-primary" : "bg-slate-300 hover:bg-slate-400"
            }`}
            title={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
