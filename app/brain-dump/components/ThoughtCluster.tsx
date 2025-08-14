
import React, { useState } from 'react';
import type { AIThoughtGroup } from '../../../types';
import ThoughtCard from '../../../components/ThoughtCard';
import { SparklesIcon } from '../../../components/icons';

interface ThoughtClusterProps {
  cluster: AIThoughtGroup;
}

const ThoughtCluster: React.FC<ThoughtClusterProps> = ({ cluster }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <details open={isOpen} onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)} className="bg-brand-surface rounded-lg border border-brand-primary transition-all duration-300 overflow-hidden group">
      <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-brand-primary/20 list-none">
        <div className="flex items-center gap-3">
            <SparklesIcon className="h-6 w-6 text-brand-accent flex-shrink-0" />
            <div>
                <h3 className="text-lg font-semibold text-brand-text-primary">{cluster.name}</h3>
                <p className="text-sm text-brand-text-secondary">{cluster.description}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-brand-primary text-brand-text-secondary px-2 py-1 rounded-md">
                {cluster.thoughts.length} {cluster.thoughts.length === 1 ? 'thought' : 'thoughts'}
            </span>
            <svg className={`w-5 h-5 text-brand-text-secondary transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
      </summary>
      <div className="p-4 border-t border-brand-primary space-y-4">
        {cluster.thoughts.map(thought => (
          <ThoughtCard key={thought.id} thought={thought} />
        ))}
      </div>
    </details>
  );
};

export default ThoughtCluster;
