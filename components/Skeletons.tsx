import React from 'react';

const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-brand-primary animate-subtle-pulse rounded-md ${className}`} />
);

export const ThoughtSkeletonCard: React.FC = () => (
  <div className="bg-brand-surface p-4 rounded-lg border border-brand-primary shadow-sm w-full max-w-2xl mx-auto">
    <Skeleton className="h-4 w-3/4 mb-3" />
    <Skeleton className="h-4 w-1/2 mb-4" />
    <div className="flex items-center gap-2 mb-3">
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-5 w-16" />
    </div>
    <div className="mt-4 flex items-center justify-between">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
    </div>
  </div>
);

export const TaskSkeletonCard: React.FC = () => (
    <div className="bg-brand-surface p-4 rounded-lg border border-brand-primary shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex-grow mb-3 sm:mb-0 pr-4 w-full">
                <Skeleton className="h-6 w-3/4 mb-3" />
                <div className="w-full bg-brand-primary rounded-full h-2.5 mb-2">
                    <div className="bg-brand-accent h-2.5 rounded-full" style={{width: '45%'}}></div>
                </div>
                <Skeleton className="h-4 w-1/3" />
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center">
                <Skeleton className="w-20 h-9 rounded-md" />
                <Skeleton className="w-5 h-5 rounded-md" />
            </div>
        </div>
    </div>
);

export const ListSkeleton: React.FC<{ count?: number, type?: 'thought' | 'task' }> = ({ count = 3, type = 'thought' }) => {
    const SkeletonComponent = type === 'thought' ? ThoughtSkeletonCard : TaskSkeletonCard;
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonComponent key={index} />
            ))}
        </div>
    );
};
