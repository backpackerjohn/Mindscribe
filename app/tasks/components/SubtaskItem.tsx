
import React from 'react';
import type { SubTask } from '../../../types';
import { CheckCircleIcon, CircleIcon } from '../../../components/icons';

interface SubtaskItemProps {
  subtask: SubTask;
  onToggle: () => void;
}

const SubtaskItem: React.FC<SubtaskItemProps> = ({ subtask, onToggle }) => {
  return (
    <div 
        onClick={onToggle}
        className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-brand-primary/30 transition-colors"
    >
        <button className="flex-shrink-0">
            {subtask.completed ? (
                <CheckCircleIcon className="h-6 w-6 text-brand-accent" />
            ) : (
                <CircleIcon className="h-6 w-6 text-brand-text-secondary" />
            )}
        </button>
        <span className={`text-brand-text-primary ${subtask.completed ? 'line-through text-brand-text-secondary' : ''}`}>
            {subtask.content}
        </span>
    </div>
  );
};

export default SubtaskItem;
