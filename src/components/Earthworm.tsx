import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Volume2, Square, ChevronRight, 
  ChevronLeft, Sparkles, Sprout, Info, 
  BookOpen, Target, ArrowRight, Play,
  Globe, Bookmark, Share2, HelpCircle,
  Menu, X, Filter, Landmark, Tractor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { EARTHWORM_DATA, EarthwormSection, EarthwormTopic } from '../data/earthwormContent';

const TopicCard = ({ 
  topic, 
  icon: Icon, 
  language, 
  onViewFull,
  isSpeaking, 
  speakContent,
  t
}: { 
  topic: EarthwormTopic, 
  icon: any, 
  language: string, 
  onViewFull: (topic: EarthwormTopic) => void,
  isSpeaking: boolean,
  speakContent: (topicId: string, text: string, lang: 'en' | 'kn') => void,
  t: (key: string) => string
}) => {
  const summary = language === 'kn' ? topic.summary.kn : topic.summary.en;

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden hover:border-primary/30 transition-all h-full flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-500 flex-shrink-0 border border-neutral-100">
              <Icon size={20} />
            </div>
            <div>
              <h3 className="font-sans font-bold text-base text-neutral-800 line-clamp-1">
                {language === 'kn' ? topic.title.kn : topic.title.en}
              </h3>
              <p className="text-neutral-500 text-sm mt-1 leading-relaxed line-clamp-2">
                {summary}
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => speakContent(
              topic.id,
              (language === 'kn' ? topic.content.kn : topic.content.en).replace(/###/g, '').replace(/\*/g, ''), 
              language as 'en' | 'kn'
            )}
            className={cn(
              "p-2 rounded-lg transition-all flex-shrink-0",
              isSpeaking ? "bg-primary/10 text-primary" : "text-neutral-400 hover:bg-neutral-100 hover:text-primary"
            )}
          >
            {isSpeaking ? <Square size={16} fill="currentColor" /> : <Volume2 size={16} />}
          </button>
        </div>

        <div className="mt-auto pt-6">
          <button 
            onClick={() => onViewFull(topic)}
            className="w-full py-2.5 rounded-xl border border-neutral-200 text-neutral-600 font-bold text-xs hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
          >
            {t('earth_view_guide')}
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ 
  section, 
  language, 
  icon: Icon,
  isCompact = false, 
  children,
  t
}: { 
  section: EarthwormSection, 
  language: string, 
  icon: any,
  isCompact?: boolean, 
  children?: React.ReactNode,
  t: (key: string) => string
}) => (
  <section id={section.id} className="scroll-mt-24">
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="text-neutral-400">
          <Icon size={isCompact ? 20 : 24} />
        </div>
        <div>
          <h2 className={cn("font-sans font-bold text-neutral-800", isCompact ? "text-lg" : "text-xl")}>
            {language === 'kn' ? section.title.kn : section.title.en}
          </h2>
          <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
            {section.topics.length} {t('earth_guides')}
          </p>
        </div>
      </div>
      
      <button className="text-neutral-400 hover:text-primary font-bold text-xs flex items-center gap-1 transition-all group">
        {t('earth_view_all')} <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
    {children}
  </section>
);

export default function Earthworm({ onBack }: { onBack: () => void }) {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [speakingTopicId, setSpeakingTopicId] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<EarthwormTopic | null>(null);

  const speakContent = (topicId: string, text: string, lang: 'en' | 'kn') => {
    if ('speechSynthesis' in window) {
      if (speakingTopicId === topicId) {
        window.speechSynthesis.cancel();
        setSpeakingTopicId(null);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'en' ? 'en-IN' : 'kn-IN';
      utterance.rate = 0.9;
      utterance.onstart = () => setSpeakingTopicId(topicId);
      utterance.onend = () => setSpeakingTopicId(null);
      utterance.onerror = () => setSpeakingTopicId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return EARTHWORM_DATA;
    return EARTHWORM_DATA.map(section => ({
      ...section,
      topics: section.topics.filter(topic => 
        topic.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.title.kn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.content.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.content.kn.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(section => section.topics.length > 0);
  }, [searchQuery]);

  const getSectionIcon = (id: string) => {
    switch(id) {
      case 'govt-schemes': return BookOpen;
      case 'finance-loans': return Landmark;
      case 'sustainable-farming': return Sprout;
      case 'equipment': return Tractor;
      default: return Info;
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32 font-sans relative">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 rounded-lg hover:bg-neutral-50 transition-colors">
                <ChevronLeft size={20} className="text-neutral-600" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-neutral-800">
                  Earthworm
                </h1>
                <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
                  {t('earth_kb')}
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-1.5 w-80">
              <Search className="text-neutral-400 mr-2" size={16} />
              <input 
                type="text" 
                placeholder="Search..."
                className="bg-transparent border-none outline-none w-full text-sm text-neutral-600 placeholder:text-neutral-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-12">
        {/* Hero */}
        <div className="mb-20 pb-12 border-b border-neutral-100">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-4">
              {t('earth_ai')}
            </h2>
            <p className="text-neutral-600 text-base leading-relaxed">
              {t('earth_subtitle')}
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-24">
          {/* Major Sections */}
          {filteredData.filter(s => s.id === 'govt-schemes' || s.id === 'finance-loans').map((section) => (
            <SectionHeader key={section.id} section={section} language={language} icon={getSectionIcon(section.id)} t={t}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {section.topics.map((topic) => (
                  <TopicCard 
                    key={topic.id} 
                    topic={topic} 
                    icon={getSectionIcon(section.id)}
                    language={language}
                    onViewFull={(t) => setSelectedTopic(t)}
                    isSpeaking={speakingTopicId === topic.id}
                    speakContent={speakContent}
                    t={t}
                  />
                ))}
              </div>
            </SectionHeader>
          ))}

          {/* Side-by-Side Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {filteredData.filter(s => s.id === 'sustainable-farming' || s.id === 'equipment').map((section) => (
              <div key={section.id} className="flex flex-col h-full">
                <SectionHeader section={section} language={language} icon={getSectionIcon(section.id)} isCompact t={t}>
                  <div className="grid grid-cols-1 gap-4">
                    {section.topics.map((topic) => (
                      <TopicCard 
                        key={topic.id} 
                        topic={topic} 
                        icon={getSectionIcon(section.id)}
                        language={language}
                        onViewFull={(t) => setSelectedTopic(t)}
                        isSpeaking={speakingTopicId === topic.id}
                        speakContent={speakContent}
                        t={t}
                      />
                    ))}
                  </div>
                </SectionHeader>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Guide Modal */}
      <AnimatePresence>
        {selectedTopic && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTopic(null)}
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400">
                    <BookOpen size={20} />
                  </div>
                  <h3 className="font-bold text-neutral-800">
                    {language === 'kn' ? selectedTopic.title.kn : selectedTopic.title.en}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedTopic(null)}
                  className="p-2 rounded-xl hover:bg-neutral-50 text-neutral-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8">
                <div className="text-neutral-600 leading-relaxed whitespace-pre-wrap font-sans text-sm mb-12">
                  {language === 'kn' ? selectedTopic.content.kn : selectedTopic.content.en}
                </div>
                
                <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Globe size={10} /> {language === 'kn' ? 'English Version' : 'ಕನ್ನಡ ಆವೃತ್ತಿ'}
                  </p>
                  <div className="text-neutral-500 italic text-sm leading-relaxed whitespace-pre-wrap">
                    {language === 'kn' ? selectedTopic.content.en : selectedTopic.content.kn}
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-4">
                <button 
                  onClick={() => speakContent(
                    selectedTopic.id,
                    (language === 'kn' ? selectedTopic.content.kn : selectedTopic.content.en).replace(/###/g, '').replace(/\*/g, ''), 
                    language as 'en' | 'kn'
                  )}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-xs transition-all",
                    speakingTopicId === selectedTopic.id 
                      ? "bg-primary/10 border-primary/20 text-primary" 
                      : "bg-white border-neutral-200 text-neutral-600 hover:border-primary"
                  )}
                >
                  {speakingTopicId === selectedTopic.id ? <Square size={14} fill="currentColor" /> : <Volume2 size={14} />}
                  {speakingTopicId === selectedTopic.id ? t('earth_stop_reading') : t('earth_read_aloud')}
                </button>
                <button 
                  onClick={() => setSelectedTopic(null)}
                  className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
