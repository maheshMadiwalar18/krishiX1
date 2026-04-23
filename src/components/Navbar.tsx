import React from 'react';
import { Sprout, Bell, User, LogIn, Bug, CloudSun, BookOpen, Sparkles, Droplet, Timer } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onHome: () => void;
  onNavigate: (view: 'home' | 'disease' | 'weather' | 'assistant' | 'login' | 'knowledge' | 'planning' | 'dashboard' | 'irrigation' | 'growth_irrigation') => void;
}

export default function Navbar({ isLoggedIn, onLogin, onLogout, onHome, onNavigate }: NavbarProps) {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: t('nav_disease'), icon: Bug, view: 'disease', path: '/disease-detection' },
    { label: t('nav_weather'), icon: CloudSun, view: 'weather', path: '/weather' },
    { label: t('nav_decision_system'), icon: Sparkles, view: 'planning', path: '/planning' },
    { label: t('irrigation_title'), icon: Droplet, view: 'irrigation', path: '/irrigation' },
    { label: 'Growth Stage', icon: Timer, view: 'growth_irrigation', path: '/growth-irrigation' },
    { label: t('nav_knowledge'), icon: BookOpen, view: 'knowledge', path: '/knowledge' },
  ] as const;

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-border z-30 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 md:gap-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onHome}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <Sprout size={18} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-black tracking-tight flex items-center">
            <span className="text-primary tracking-tighter">Krushi</span>
            <span className="text-primary-light">X</span>
          </span>
        </div>

        {isLoggedIn && (
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`flex items-center gap-2 text-[10px] font-black transition-all uppercase tracking-widest relative py-1 ${
                  isActive(item.path) 
                    ? 'text-primary' 
                    : 'text-text/60 hover:text-primary'
                }`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
                {isActive(item.path) && (
                  <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_0_8px_rgba(46,125,50,0.5)]" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {/* Language Toggle */}
        <div className="flex items-center bg-bg rounded-full p-1 border border-border shadow-inner scale-90 md:scale-100">
          <button 
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tight transition-all ${
              language === 'en' ? 'bg-primary text-white shadow-md' : 'text-text/40 hover:text-text/60'
            }`}
          >
            EN
          </button>
          <button 
            onClick={() => setLanguage('kn')}
            className={`px-3 py-1 rounded-full text-[11px] font-black transition-all ${
              language === 'kn' ? 'bg-primary text-white shadow-md' : 'text-text/40 hover:text-text/60'
            }`}
          >
            ಕನ್ನಡ
          </button>
        </div>

        {isLoggedIn ? (
          <>
            <button className="hidden sm:flex p-2 text-text/40 hover:text-primary transition-colors relative">
              <Bell size={18} strokeWidth={2} />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full border border-white"></div>
            </button>
            <div 
              className="flex items-center gap-3 md:pl-6 md:border-l border-border group cursor-pointer" 
              onClick={() => onNavigate('dashboard')}
            >
              <div className="w-8 h-8 bg-bg border border-border rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all overflow-hidden shadow-sm">
                <User size={16} strokeWidth={2} />
              </div>
              <span className="hidden md:block text-xs font-bold text-text/60 group-hover:text-primary transition-colors">{t('nav_my_account')}</span>
              <button onClick={(e) => { e.stopPropagation(); onLogout(); }} className="ml-2 text-[10px] font-black text-red-500 hover:text-red-600 uppercase tracking-[0.1em] flex items-center gap-1">
                <LogIn size={14} className="rotate-180" /> <span className="hidden sm:inline">{t('nav_logout')}</span>
              </button>
            </div>
          </>
        ) : (
          <button 
            onClick={onLogin}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-black hover:bg-primary/90 transition-all shadow-md active:scale-95 whitespace-nowrap"
          >
            <LogIn size={16} />
            <span>Login</span>
          </button>
        )}
      </div>
    </nav>
  );
}

