import { Sprout, Bell, User, LogIn } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onHome: () => void;
  onNavigate: (view: 'home' | 'disease' | 'weather' | 'assistant' | 'analytics' | 'knowledge' | 'dashboard') => void;
}

export default function Navbar({ isLoggedIn, onLogin, onLogout, onHome, onNavigate }: NavbarProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: 'Disease', view: 'disease', path: '/disease-detection' },
    { label: 'Weather', view: 'weather', path: '/weather' },
    { label: 'Assistant', view: 'assistant', path: '/assistant' },
    { label: 'Analytics', view: 'analytics', path: '/analytics' },
    { label: 'Knowledge', view: 'knowledge', path: '/knowledge' },
  ] as const;

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-border z-30 px-6 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-10">
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
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`text-xs font-bold transition-all uppercase tracking-widest relative py-1 ${
                  isActive(item.path) 
                    ? 'text-primary' 
                    : 'text-text/60 hover:text-primary'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_0_8px_rgba(46,125,50,0.5)]" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        {isLoggedIn ? (
          <>
            <button className="p-2 text-text/40 hover:text-primary transition-colors relative">
              <Bell size={18} strokeWidth={2} />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full border border-white"></div>
            </button>
            <div 
              className="flex items-center gap-3 pl-6 border-l border-border group cursor-pointer" 
              onClick={() => onNavigate('dashboard')}
            >
              <div className="w-8 h-8 bg-bg border border-border rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all overflow-hidden">
                <User size={16} strokeWidth={2} />
              </div>
              <span className="hidden md:block text-xs font-bold text-text/60 group-hover:text-primary transition-colors">My Account</span>
              <button onClick={(e) => { e.stopPropagation(); onLogout(); }} className="ml-2 text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-widest flex items-center gap-1">
                <LogIn size={14} className="rotate-180" /> Logout
              </button>
            </div>
          </>
        ) : (
          <button 
            onClick={onLogin}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-all shadow-md active:scale-95 whitespace-nowrap"
          >
            <span>Login / Sign up</span>
          </button>
        )}
      </div>
    </nav>
  );
}
