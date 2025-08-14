
import React, { useState } from 'react';
import type { Thought } from '../../types';
import { useThoughts } from '../../hooks/useThoughts';
import AddThought from '../../components/AddThought';
import ThoughtList from '../../components/ThoughtList';
import SearchBar from '../../components/SearchBar';
import ViewControls from './components/ViewControls';
import ClusterView from './components/ClusterView';
import InsightsPanel from './components/InsightsPanel';
import ConvertThoughtModal from './components/ConvertThoughtModal';
import { SparklesIcon, ClockIcon, BookmarkIcon } from '../../components/icons';

const BrainDumpPage: React.FC = () => {
  const { 
    thoughts, 
    allTags, 
    isLoading, 
    addThought, 
    searchTerm, 
    setSearchTerm, 
    activeTag, 
    setActiveTag,
    clearFilters,
    viewMode,
    setViewMode,
    clusters,
    insights,
    isOrganizing,
    organizeThoughts,
    linkThoughtToTask
  } = useThoughts();
  
  const [convertingThought, setConvertingThought] = useState<Thought | null>(null);
  const hasActiveFilter = !!searchTerm || !!activeTag;

  const handleTaskCreated = (thoughtId: string, taskId: string) => {
    linkThoughtToTask(thoughtId, taskId);
    setConvertingThought(null);
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'list':
        return <ThoughtList thoughts={thoughts} isLoading={isLoading} hasActiveFilter={hasActiveFilter} onConvertToTask={setConvertingThought} />;
      case 'cluster':
        return <ClusterView clusters={clusters} isLoading={isOrganizing} onConvertToTask={setConvertingThought} />;
      case 'timeline':
      case 'topic':
        const Icon = viewMode === 'timeline' ? ClockIcon : BookmarkIcon;
        const title = viewMode === 'timeline' ? 'Timeline View' : 'Topic View';
        return (
          <div className="text-center text-brand-text-secondary p-8 rounded-lg bg-brand-surface border-2 border-dashed border-brand-primary animate-fade-in">
            <Icon className="h-12 w-12 mx-auto mb-4 text-brand-secondary" />
            <h3 className="text-lg font-semibold text-brand-text-primary">{title}</h3>
            <p className="mt-1">This organizational view is coming soon!</p>
          </div>
        );
      default:
        return <ThoughtList thoughts={thoughts} isLoading={isLoading} hasActiveFilter={hasActiveFilter} onConvertToTask={setConvertingThought} />;
    }
  }

  return (
    <>
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto w-full">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-2">
            <SparklesIcon className="h-8 w-8 text-brand-accent"/>
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-text-primary tracking-tight">
              MindScribe
            </h1>
          </div>
          <p className="text-brand-text-secondary mt-2">
            The effortless way to capture and organize your fleeting thoughts.
          </p>
        </header>
        
        <AddThought addThought={addThought} />
        
        <div className="space-y-6">
            <SearchBar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                activeTag={activeTag}
                setActiveTag={setActiveTag}
                allTags={allTags}
                clearFilters={clearFilters}
            />

            <ViewControls 
                viewMode={viewMode}
                setViewMode={setViewMode}
                onOrganize={organizeThoughts}
                isOrganizing={isOrganizing}
                thoughtCount={thoughts.length}
            />

            <InsightsPanel insights={insights} isLoading={isOrganizing} />
            
            {renderContent()}
        </div>
      </div>
    </div>
     {convertingThought && (
        <ConvertThoughtModal 
            thought={convertingThought}
            onClose={() => setConvertingThought(null)}
            onTaskCreated={handleTaskCreated}
        />
     )}
    </>
  );
};

export default BrainDumpPage;