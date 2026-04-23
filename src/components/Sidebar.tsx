import { cn } from '../lib/utils';
import { 
  Home, 
  Sprout, 
  CloudSun, 
  Bug, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Sidebar() {
  const { t } = useLanguage();

  const navItems = [
    { icon: Home, label: t('nav_disease'), active: true },
    { icon: Sprout, label: 'Crops' },
    { icon: CloudSun, label: t('nav_weather'), active: false },
    { icon: Bug, label: t('nav_disease'), active: false },
    { icon: MessageSquare, label: 'AI Support', active: false },
  ];

  return (
    <div className="w-[240px] bg-white border-r border-border h-screen flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6 flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
          <Sprout size={24} />
        </div>
        <span className="text-3xl font-display font-black flex items-center">
          <span className="text-primary tracking-tighter">Krushi</span>
          <span className="text-primary-light">X</span>
        </span>
      </div>

      <nav className="flex-1 space-y-0">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-3 px-6 py-4 transition-all duration-200 font-black text-xs uppercase tracking-widest",
              item.active 
                ? "bg-primary/5 text-primary border-r-4 border-primary" 
                : "text-text/40 hover:bg-bg hover:text-primary"
            )}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:text-red-600 transition-colors font-black text-xs uppercase tracking-widest">
          <LogOut size={20} />
          <span>{t('nav_logout')}</span>
        </button>
      </div>
    </div>
  );
}

