import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div 
      className={cn(
        "animate-pulse bg-text/5 rounded-md",
        className
      )} 
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white p-5 rounded-2xl border border-border space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2 flex-grow">
          <Skeleton className="h-2 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white p-6 rounded-3xl border border-border space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-1/3 rounded-lg" />
        <Skeleton className="h-4 w-1/4 rounded-lg" />
      </div>
      <div className="h-64 flex items-end gap-2">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className="flex-1 animate-pulse bg-text/5 rounded-md" 
            style={{ height: `${Math.random() * 80 + 20}%` }} 
          />
        ))}
      </div>
    </div>
  );
}
