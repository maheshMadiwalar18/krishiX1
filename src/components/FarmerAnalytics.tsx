import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Droplets, 
  ChevronLeft, 
  DollarSign, 
  Activity, 
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { ChartSkeleton, CardSkeleton } from './ui/Skeleton';

const healthData = [
  { day: 'Mon', health: 85 },
  { day: 'Tue', health: 88 },
  { day: 'Wed', health: 84 },
  { day: 'Thu', health: 90 },
  { day: 'Fri', health: 92 },
  { day: 'Sat', health: 94 },
  { day: 'Sun', health: 93 },
];

const waterData = [
  { plot: 'Sector 1', used: 400, limit: 500 },
  { plot: 'Sector 2', used: 320, limit: 500 },
  { plot: 'Sector 3', used: 480, limit: 500 },
  { plot: 'Sector 4', used: 210, limit: 500 },
];

const profitData = [
  { name: 'Wheat', value: 45000, color: '#2E7D32' },
  { name: 'Rice', value: 32000, color: '#43A047' },
  { name: 'Mustard', value: 12000, color: '#81C784' },
];

export default function FarmerAnalytics({ onBack }: { onBack: () => void }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 bg-white border border-border rounded-xl flex items-center justify-center text-text shadow-sm"><ChevronLeft size={20} /></button>
          <div className="space-y-2"><div className="h-6 w-48 bg-text/5 rounded animate-pulse"/><div className="h-3 w-64 bg-text/5 rounded animate-pulse"/></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ChartSkeleton /><ChartSkeleton />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-white border border-border rounded-xl flex items-center justify-center text-text hover:bg-bg transition-colors shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-display font-extrabold text-text">Farmer Analytics</h1>
            <p className="text-text/60 text-sm">Real-time performance and financial insights.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl text-sm font-semibold text-text hover:bg-bg transition-all">
            <Calendar size={16} />
            <span>Last 30 Days</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm active:scale-95">
            <Download size={16} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Est. Profit', value: '₹89,200', icon: DollarSign, trend: '+12.5%', up: true },
          { label: 'Crop Health', value: '94%', icon: Activity, trend: '+2.1%', up: true },
          { label: 'Water Saved', value: '1,420 L', icon: Droplets, trend: '+15%', up: true },
          { label: 'Exp. Harvest', value: 'Oct 12', icon: Calendar, trend: 'On Track', up: true },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-5 rounded-2xl border border-border card-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-bg rounded-lg text-primary">
                <stat.icon size={20} />
              </div>
              <div className={cn(
                "flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full",
                stat.up ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              )}>
                {stat.up ? <ArrowUpRight size={10} className="mr-0.5" /> : <ArrowDownRight size={10} className="mr-0.5" />}
                {stat.trend}
              </div>
            </div>
            <p className="text-[10px] font-bold text-text/40 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-text">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Crop Health Graph */}
        <div className="bg-white p-6 rounded-3xl border border-border card-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-text">Weekly Crop Health Trend</h3>
            <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-text/40">
              <span className="w-2 h-2 rounded-full bg-primary" /> Health Index
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthData}>
                <defs>
                  <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DDE7D1" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#1B5E20', opacity: 0.5 }} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', border: '1px solid #DDE7D1', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="health" 
                  stroke="#2E7D32" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorHealth)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Water Usage Stats */}
        <div className="bg-white p-6 rounded-3xl border border-border card-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-text">Water Usage by Sector (Liters)</h3>
            <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">Manage Valves</button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#DDE7D1" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="plot" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#1B5E20', opacity: 0.7 }}
                  width={70}
                />
                <Tooltip 
                  cursor={{ fill: '#F1F8E9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar 
                  dataKey="used" 
                  fill="#2E7D32" 
                  radius={[0, 4, 4, 0]} 
                  barSize={20}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
        {/* Soil Moisture Indicators */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-border card-shadow">
          <h3 className="font-bold text-text mb-6">Soil Condition by Zone</h3>
          <div className="space-y-6">
            {[
              { zone: 'Northern Plot', level: 72, color: 'bg-primary' },
              { zone: 'Eastern Plot', level: 45, color: 'bg-accent' },
              { zone: 'Western Hill', level: 90, color: 'bg-primary' },
              { zone: 'River Side', level: 58, color: 'bg-primary-light' },
            ].map((zone, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-text/80">{zone.zone}</span>
                  <span className="text-xs font-bold text-text">{zone.level}%</span>
                </div>
                <div className="h-2 w-full bg-bg rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${zone.level}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={cn("h-full rounded-full", zone.color)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profit Estimation Breakdown */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-border card-shadow flex flex-col md:flex-row gap-8">
          <div className="flex-grow">
            <h3 className="font-bold text-text mb-2">Profit Distribution</h3>
            <p className="text-xs text-text/50 mb-6">Expected revenue breakdown by current crop maturity.</p>
            <div className="space-y-4">
              {profitData.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-bg/40 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-semibold text-text">{item.name}</span>
                  </div>
                  <div className="text-sm font-bold text-text">₹{item.value.toLocaleString()}</div>
                </div>
              ))}
              <div className="pt-4 border-t border-border mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-text">Total Est. Profit</span>
                  <span className="text-xl font-extrabold text-primary">₹89,200</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-64 h-64 shrink-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={profitData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {profitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-[10px] font-bold text-text/40 uppercase">Total</span>
              <span className="text-lg font-bold text-text">89k</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
