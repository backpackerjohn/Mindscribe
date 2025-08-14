
import React from 'react';
import Tag from './Tag';
import { SearchIcon, TagIcon, ClearIcon } from './icons';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTag: string | null;
  setActiveTag: (tag: string | null) => void;
  allTags: string[];
  clearFilters: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, activeTag, setActiveTag, allTags, clearFilters }) => {

  const handleTagClick = (tag: string) => {
    setActiveTag(activeTag === tag ? null : tag);
  }
  
  const showClearButton = searchTerm || activeTag;

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 space-y-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
      <div className="relative">
        <SearchIcon className="absolute top-1/2 left-3 -translate-y-1/2 h-5 w-5 text-brand-text-secondary" />
        <input
          type="text"
          placeholder="Search through your thoughts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-brand-surface border border-brand-primary rounded-md text-brand-text-primary placeholder-brand-text-secondary focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-colors"
        />
      </div>
      
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <TagIcon className="h-5 w-5 text-brand-text-secondary flex-shrink-0"/>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2">
            {allTags.map(tag => (
              <Tag key={tag} tag={tag} isActive={tag === activeTag} onClick={handleTagClick} />
            ))}
          </div>
           {showClearButton && (
            <button onClick={clearFilters} className="ml-auto flex-shrink-0 flex items-center gap-1 text-sm text-brand-secondary hover:text-brand-accent transition-colors">
              <ClearIcon className="h-4 w-4"/>
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
