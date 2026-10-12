import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 10 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col rounded-xl overflow-hidden bg-slate-900/60 border border-slate-800 animate-pulse"
        >
          <div className="aspect-[2/3] w-full bg-slate-800" />
          <div className="p-3.5 space-y-2">
            <div className="h-3 w-1/3 bg-slate-800 rounded" />
            <div className="h-4 w-4/5 bg-slate-800 rounded" />
            <div className="h-8 w-full bg-slate-800/80 rounded mt-3" />
          </div>
        </div>
      ))}
    </div>
  );
};
