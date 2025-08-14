
import React from 'react';
import type { ViewMode } from '../../../types';
import { ListIcon, LayoutGridIcon, SparklesIcon, ClockIcon, BookmarkIcon } from '../../../components/icons';

interface ViewControlsProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onOrganize: () => void;
  isOrganizing: boolean;
  thoughtCount: number;
}

const ViewControls: React.FC<ViewControlsProps> = ({ viewMode, setViewMode, onOrganize, isOrganizing, thoughtCount }) => {
  
  const canOrganize = thoughtCount >= 3;

  const baseButtonClass = "p-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-background";
  const activeButtonClass = "bg-brand-primary text-white";
  const inactiveButtonClass = "text-brand-text-secondary hover:bg-brand-surface hover:text-white";

  return (
    <div className="flex items-center justify-between gap-4 bg-brand-surface p-2 rounded-lg border border-brand-primary animate-fade-in">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-brand-text-secondary mr-2 hidden sm:inline">View:</span>
        <div className="flex items-center bg-brand-background rounded-md p-1">
          <button onClick={() => setViewMode('list')} className={`${baseButtonClass} ${viewMode === 'list' ? activeButtonClass : inactiveButtonClass}`} aria-label="List view" title="List View">
            <ListIcon className="h-5 w-5" />
          </button>
          <button onClick={() => setViewMode('cluster')} className={`${baseButtonClass} ${viewMode === 'cluster' ? activeButtonClass : inactiveButtonClass}`} aria-label="Cluster view" title="Cluster View">
            <LayoutGridIcon className="h-5 w-5" />
          </button>
          <button onClick={() => setViewMode('timeline')} className={`${baseButtonClass} ${viewMode === 'timeline' ? activeButtonClass : inactiveButtonClass}`} aria-label="Timeline view" title="Timeline View">
            <ClockIcon className="h-5 w-5" />
          </button>
          <button onClick={() => setViewMode('topic')} className={`${baseButtonClass} ${viewMode === 'topic' ? activeButtonClass : inactiveButtonClass}`} aria-label="Topic view" title="Topic View">
            <BookmarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <button
        onClick={onOrganize}
        disabled={isOrganizing || !canOrganize}
        className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-white rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-500 transition-all duration-200"
        title={!canOrganize ? "Add at least 3 thoughts to organize" : "Organize with AI"}
      >
        {isOrganizing ? (
          <>
            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            <span>Organizing...</span>
          </>
        ) : (
          <>
            <SparklesIcon className="h-5 w-5" />
            <span>Organize with AI</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ViewControls;