import React from 'react';
import type { Thought } from '../types';
import ThoughtCard from './ThoughtCard';
import { SparklesIcon } from './icons';
import { ListSkeleton } from './Skeletons';

interface ThoughtListProps {
  thoughts: Thought[];
  isLoading: boolean;
  hasActiveFilter: boolean;
  onConvertToTask: (thought: Thought) => void;
}

const ThoughtList: React.FC<ThoughtListProps> = ({ thoughts, isLoading, hasActiveFilter, onConvertToTask }) => {
  if (isLoading) {
    return <ListSkeleton type="thought" />;
  }

  if (thoughts.length === 0) {
    return (
      <div className="text-center text-brand-text-secondary p-8 rounded-lg bg-brand-surface border-2 border-dashed border-brand-primary">
        <SparklesIcon className="h-12 w-12 mx-auto mb-4 text-brand-secondary" />
        <h3 className="text-lg font-semibold text-brand-text-primary">
          {hasActiveFilter ? "No thoughts match your filter" : "Your mind is clear!"}
        </h3>
        <p className="mt-1">
          {hasActiveFilter ? "Try a different search or tag." : "Capture a thought to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {thoughts.map(thought => (
        <ThoughtCard key={thought.id} thought={thought} onConvertToTask={onConvertToTask} />
      ))}
    </div>
  );
};

export default ThoughtList;