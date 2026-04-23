import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
  id: string;
  type: NotificationType;
  message: string;
  onClose: (id: string) => void;
}

export function Notification({ id, type, message, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border w-full max-w-sm pointer-events-auto",
        type === 'error' ? "bg-red-50 border-red-100 text-red-800" : 
        type === 'success' ? "bg-green-50 border-green-100 text-green-800" : 
        "bg-blue-50 border-blue-100 text-blue-800"
      )}
    >
      <div className={cn(
        "p-1.5 rounded-full",
        type === 'error' ? "bg-red-100 text-red-600" : 
        type === 'success' ? "bg-green-100 text-green-600" : 
        "bg-blue-100 text-blue-600"
      )}>
        {type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
      </div>
      <p className="text-sm font-semibold flex-1">{message}</p>
      <button 
        onClick={() => onClose(id)}
        className="p-1 hover:bg-black/5 rounded-lg transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = React.useState<{id: string, type: NotificationType, message: string}[]>([]);

  const addNotification = React.useCallback((type: NotificationType, message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, type, message }]);
  }, []);

  const removeNotification = React.useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <Notification key={n.id} {...n} onClose={removeNotification} />
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export const NotificationContext = React.createContext<{
  addNotification: (type: NotificationType, message: string) => void;
}>({ addNotification: () => {} });

export const useNotification = () => React.useContext(NotificationContext);
