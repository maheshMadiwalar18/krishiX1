import { cn } from '../lib/utils';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  colorClass?: string;
}

export default function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  trendUp = true,
  colorClass = "bg-green-50 text-green-600"
}: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-border card-shadow flex items-center gap-4 transition-all hover:border-primary/10">
      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0", colorClass)}>
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-text/30 uppercase tracking-[0.1em] mb-1">{label}</p>
        <p className="text-lg font-semibold text-text truncate">{value}</p>
        {trend && (
          <div className={cn(
            "flex items-center text-[10px] font-medium mt-1",
            trendUp ? "text-green-600" : "text-red-500"
          )}>
            {trendUp ? <ArrowUpRight size={10} className="mr-0.5" /> : <ArrowDownRight size={10} className="mr-0.5" />}
            {trend}
          </div>
        )}
      </div>
    </div>
  );
}
