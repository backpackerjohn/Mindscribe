
import React, { useState } from 'react';
import type { Task } from '../../../types';
import SubtaskItem from './SubtaskItem';

interface TaskCardProps {
  task: Task;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleSubtask }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const completedCount = task.subtasks.filter(st => st.completed).length;
  const totalCount = task.subtasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <details open={isOpen} onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)} className="bg-brand-surface rounded-lg border border-brand-primary transition-all duration-300 overflow-hidden group">
      <summary className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 cursor-pointer hover:bg-brand-primary/20 list-none">
        <div className="flex-grow mb-3 sm:mb-0">
          <h3 className={`text-lg font-semibold text-brand-text-primary ${task.completed ? 'line-through text-brand-text-secondary' : ''}`}>{task.title}</h3>
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-brand-text-secondary">Progress</span>
              <span className="text-xs font-medium text-brand-text-secondary">{completedCount} / {totalCount}</span>
            </div>
            <div className="w-full bg-brand-primary rounded-full h-2.5">
              <div 
                className="bg-brand-accent h-2.5 rounded-full transition-all duration-500" 
                style={{width: `${progress}%`}}
              ></div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto sm:ml-4 flex-shrink-0">
            <svg className={`w-5 h-5 text-brand-text-secondary transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
      </summary>
      <div className="p-4 border-t border-brand-primary space-y-2">
        <h4 className="text-sm font-semibold text-brand-text-secondary mb-2">Sub-tasks:</h4>
        {task.subtasks.map(subtask => (
          <SubtaskItem 
            key={subtask.id} 
            subtask={subtask} 
            onToggle={() => onToggleSubtask(task.id, subtask.id)}
          />
        ))}
        {task.subtasks.length === 0 && (
             <p className="text-sm text-brand-text-secondary italic">No sub-tasks for this item.</p>
        )}
      </div>
    </details>
  );
};

export default TaskCard;
