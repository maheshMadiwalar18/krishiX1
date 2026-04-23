import { Droplets, Thermometer, Wind, Sunrise } from 'lucide-react';

export default function WeatherWidget() {
  return (
    <div className="bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] text-white p-5 rounded-xl shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[14px] opacity-80 font-medium">Today's Forecast</div>
        <div className="text-right">
          <Sunrise size={24} className="text-accent ml-auto" />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-[36px] font-light leading-none">32°C</div>
          <div className="text-[12px] mt-1 opacity-90">Bhopal | Humidity: 12%</div>
        </div>
        <div className="text-right font-bold text-[14px] opacity-90">Sunny</div>
      </div>
    </div>
  );
}
