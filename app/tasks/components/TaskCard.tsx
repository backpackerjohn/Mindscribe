import React, { useState, useMemo } from 'react';
import type { Task, Category } from '../../../types';
import SubtaskItem from './SubtaskItem';
import { BrainCircuitIcon, TrashIcon } from '../../../components/icons';

interface TaskCardProps {
  task: Task;
  categories: Category[];
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onStartFocus: (taskId: string) => void;
  onUpdateCategory: (taskId: string, categoryId: string | undefined) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, categories, onToggleSubtask, onStartFocus, onUpdateCategory, onDeleteTask }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const completedCount = task.subtasks.filter(st => st.completed).length;
  const totalCount = task.subtasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  const category = useMemo(() => categories.find(c => c.id === task.categoryId), [categories, task.categoryId]);

  const handleFocusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStartFocus(task.id);
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    onUpdateCategory(task.id, e.target.value || undefined);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the task "${task.title}"?`)) {
        onDeleteTask(task.id);
    }
  }

  return (
    <details open={isOpen} onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)} className="bg-brand-surface rounded-lg border border-brand-primary transition-all duration-300 overflow-hidden group">
      <summary className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 cursor-pointer hover:bg-brand-primary/20 list-none">
        <div className="flex-grow mb-3 sm:mb-0 pr-4">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            {task.sourceThoughtId && <BrainCircuitIcon className="h-5 w-5 text-brand-secondary flex-shrink-0" title="Created from a thought"/>}
            <h3 className={`text-lg font-semibold text-brand-text-primary ${task.completed ? 'line-through text-brand-text-secondary' : ''}`}>{task.title}</h3>
            {category && (
                <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{backgroundColor: `${category.color}40`, color: category.color}}>
                    {category.name}
                </span>
            )}
          </div>
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
        <div className="flex items-center gap-2 ml-auto sm:ml-4 flex-shrink-0 self-center">
            <button 
                onClick={handleFocusClick}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-brand-primary text-brand-text-secondary rounded-md hover:bg-brand-accent hover:text-white transition-colors"
                title="Start Focus Session"
                aria-label={`Start focus session for ${task.title}`}
                disabled={task.completed || totalCount === 0}
            >
                <BrainCircuitIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Focus</span>
            </button>
            <svg className={`w-5 h-5 text-brand-text-secondary transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
      </summary>
      <div className="p-4 border-t border-brand-primary space-y-2">
        <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-semibold text-brand-text-secondary">Sub-tasks:</h4>
            <div className="flex items-center gap-2">
                <select
                    value={task.categoryId || ''}
                    onChange={handleCategoryChange}
                    onClick={e => e.stopPropagation()}
                    className="bg-brand-primary border border-brand-secondary text-white text-xs rounded-md p-1 focus:ring-2 focus:ring-brand-accent"
                    aria-label={`Change category for task ${task.title}`}
                >
                    <option value="">No Category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                <button
                    onClick={handleDeleteClick}
                    className="text-brand-text-secondary hover:text-red-500 transition-colors p-1"
                    title="Delete Task"
                    aria-label={`Delete task ${task.title}`}
                >
                    <TrashIcon className="w-4 h-4"/>
                </button>
            </div>
        </div>
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

export default React.memo(TaskCard);