import React from 'react';
import { Sprout, Bell, User, LogIn, Bug, CloudSun, BookOpen, Sparkles, Droplet, Timer, Users } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onHome: () => void;
  onNavigate: (view: 'home' | 'disease' | 'weather' | 'assistant' | 'login' | 'knowledge' | 'planning' | 'dashboard' | 'irrigation' | 'community') => void;
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
    { label: 'Community', icon: Users, view: 'community', path: '/community' },
    { label: t('nav_knowledge'), icon: BookOpen, view: 'knowledge', path: '/knowledge' },
  ] as const;

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-white/70 backdrop-blur-2xl border-b border-border/50 z-30 px-4 md:px-8 flex items-center justify-between shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-4 md:gap-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onHome}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <Sprout size={18} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-black tracking-tight flex items-center">
            <span className="text-primary tracking-tighter">Agri</span>
            <span className="text-primary-light">Guru</span>
          </span>
        </div>

        {isLoggedIn && (
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={cn(
                  "flex flex-col items-center gap-1 group relative py-1 px-3 rounded-xl transition-all duration-300",
                  isActive(item.path) 
                    ? "text-primary bg-primary/5" 
                    : "text-text/60 hover:text-primary hover:bg-bg"
                )}
              >
                <item.icon size={20} className={cn(
                  "transition-transform duration-300 group-hover:-translate-y-0.5",
                  isActive(item.path) ? "stroke-[2.5px]" : "stroke-[2px]"
                )} />
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest transition-colors",
                  isActive(item.path) ? "text-primary" : "text-text/40 group-hover:text-primary"
                )}>
                  {item.label}
                </span>
                {isActive(item.path) && (
                  <motion.div 
                    layoutId="nav-active"
                    className="absolute -bottom-[2px] left-2 right-2 h-0.5 bg-primary rounded-full"
                  />
                )}
              </button>
            ))}
            
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 md:gap-6">
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

