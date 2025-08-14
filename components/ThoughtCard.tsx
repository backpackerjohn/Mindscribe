
import React from 'react';
import type { Thought } from '../types';
import { TagIcon, SparklesIcon } from './icons';

interface ThoughtCardProps {
  thought: Thought;
}

const ThoughtCard: React.FC<ThoughtCardProps> = ({ thought }) => {
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}y ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}m ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}d ago`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}h ago`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)}m ago`;
    return `just now`;
  };

  return (
    <div className="bg-brand-surface p-4 rounded-lg border border-brand-primary shadow-sm transition-all duration-300 hover:border-brand-secondary animate-fade-in">
      <p className="text-brand-text-primary whitespace-pre-wrap">{thought.content}</p>
      <div className="mt-3 flex items-center justify-between text-sm text-brand-text-secondary">
        <div className="flex items-center gap-2 flex-wrap">
          {thought.isTagging ? (
            <div className="flex items-center gap-1 text-xs animate-subtle-pulse">
              <SparklesIcon className="h-4 w-4" />
              <span>AI is tagging...</span>
            </div>
          ) : (
            thought.tags.length > 0 && (
              <>
                <TagIcon className="h-4 w-4 flex-shrink-0" />
                <div className="flex items-center gap-1.5 flex-wrap">
                  {thought.tags.map(tag => (
                    <span key={tag} className="bg-brand-primary px-2 py-0.5 rounded text-xs">{tag}</span>
                  ))}
                </div>
              </>
            )
          )}
        </div>
        <time dateTime={thought.createdAt} className="flex-shrink-0 ml-4">{timeAgo(thought.createdAt)}</time>
      </div>
       {thought.isSaving && <div className="absolute top-2 right-2 h-2 w-2 bg-brand-accent rounded-full animate-ping"></div>}
    </div>
  );
};

export default ThoughtCard;
