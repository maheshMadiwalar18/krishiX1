import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
  delay?: number;
  onClick?: () => void;
}

export default function FeatureCard({ icon: Icon, title, description, color = "bg-primary", delay = 0, onClick }: FeatureCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      onClick={onClick}
      className="bg-white p-8 rounded-xl border border-border hover:border-primary/20 transition-all cursor-pointer group card-shadow flex flex-col items-center text-center"
    >
      <div className={cn("w-14 h-14 rounded-full flex items-center justify-center text-white mb-6", color)}>
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <h3 className="font-semibold text-text mb-2">{title}</h3>
      <p className="text-sm text-text/50 font-light">{description}</p>
    </motion.div>
  );
}
