
import React, { useState } from 'react';
import { PlusIcon, SparklesIcon } from './icons';

interface AddThoughtProps {
  addThought: (content: string) => Promise<void>;
}

const AddThought: React.FC<AddThoughtProps> = ({ addThought }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !isSubmitting) {
      setIsSubmitting(true);
      await addThought(content);
      setContent('');
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        handleSubmit(new Event('submit') as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto mb-8 animate-fade-in">
      <div className="relative border border-brand-primary rounded-lg shadow-lg bg-brand-surface focus-within:ring-2 focus-within:ring-brand-accent transition-all duration-300">
        <SparklesIcon className="absolute top-3 left-4 h-6 w-6 text-brand-secondary" />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What's on your mind? Capture it here..."
          className="w-full bg-transparent text-brand-text-primary placeholder-brand-text-secondary pl-12 pr-28 py-3 resize-none border-none focus:ring-0"
          rows={2}
          disabled={isSubmitting}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            <span className="text-xs text-brand-text-secondary mr-2 hidden sm:inline">Ctrl+Enter</span>
            <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="flex items-center justify-center gap-1 px-4 py-2 bg-brand-accent text-white rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-500 transition-colors duration-200"
            >
            <PlusIcon className="h-5 w-5" />
            <span>Add</span>
            </button>
        </div>
      </div>
    </form>
  );
};

export default AddThought;
