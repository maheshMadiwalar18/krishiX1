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

const navItems = [
  { icon: Home, label: 'Dashboard', active: true },
  { icon: Sprout, label: 'Crops' },
  { icon: CloudSun, label: 'Weather' },
  { icon: Bug, label: 'Pest Detection' },
  { icon: MessageSquare, label: 'AI Support' },
];

export default function Sidebar() {
  return (
    <div className="w-[240px] bg-white border-r border-border h-screen flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6 flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
          <Sprout size={24} />
        </div>
        <span className="text-3xl font-display font-black flex items-center">
          <span className="text-primary tracking-tighter">Agri</span>
          <span className="text-primary-light">Guru</span>
        </span>
      </div>

      <nav className="flex-1 space-y-0">
        {navItems.map((item) => (
          <button
            key={item.label}
            id={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
            className={cn(
              "w-full flex items-center gap-3 px-6 py-3 transition-all duration-200 font-medium",
              item.active 
                ? "bg-[#E8F5E9] text-primary border-r-4 border-primary" 
                : "text-[#555] hover:bg-bg hover:text-primary"
            )}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-[#777] hover:text-red-600 transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
