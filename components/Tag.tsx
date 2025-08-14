import React from 'react';

interface TagProps {
  tag: string;
  isActive: boolean;
  onClick: (tag: string) => void;
}

const Tag: React.FC<TagProps> = ({ tag, isActive, onClick }) => {
  const baseClasses = "flex-shrink-0 cursor-pointer text-xs font-medium px-2.5 py-1 rounded-full transition-all duration-200";
  const activeClasses = "bg-brand-accent text-white shadow-md";
  const inactiveClasses = "bg-brand-primary text-brand-text-secondary hover:bg-brand-secondary hover:text-white";

  return (
    <button 
      onClick={() => onClick(tag)} 
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      aria-pressed={isActive}
    >
      {tag}
    </button>
  );
};

export default React.memo(Tag);