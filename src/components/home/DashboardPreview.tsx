import React from 'react';
import { HeartPulse, ThermometerSun, Bell, ArrowUpRight } from 'lucide-react';
import StatCard from '../StatCard';
import { useLanguage } from '../../contexts/LanguageContext';

interface DashboardPreviewProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onViewDashboard: () => void;
}

export default function SmartPreview({ isLoggedIn, onLogin, onViewDashboard }: DashboardPreviewProps) {
  const { t } = useLanguage();
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-8">
      <div className="text-center mb-16">
        <h2 className="mb-4">{t('preview_title')}</h2>
        <p className="text-text/60 max-w-xl mx-auto font-light">{t('preview_subtitle')}</p>
      </div>

      <div className="bg-white rounded-xl p-8 border border-border card-shadow relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            icon={ThermometerSun} 
            label={t('stat_weather')} 
            value="32°C • Sunny" 
            trend="Stable Humidity"
            colorClass="bg-blue-50 text-blue-600"
          />
          <StatCard 
            icon={HeartPulse} 
            label={t('stat_health')} 
            value="94% Healthy" 
            trend="+2% vs Last Week" 
            colorClass="bg-green-50 text-green-600"
          />
          <StatCard 
            icon={Bell} 
            label={t('stat_alerts')} 
            value="No new threats" 
            trend="System Clean" 
            colorClass="bg-red-50 text-red-600"
          />
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
             <p className="text-sm font-medium text-text/40">Monitoring 142 localized farm nodes in real-time</p>
          </div>
          <button 
            onClick={onViewDashboard}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-2 group"
          >
            {t('btn_scan_crop')} <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
