import React, { useState, useEffect } from 'react';
import { useTasks } from '../../../hooks/useTasks';
import { useCategories } from '../../../hooks/useCategories';
import { generateSubtasks } from '../../../lib/ai/task-management/subtask-generator';
import type { Thought, SubTask } from '../../../types';
import { SparklesIcon, PlusIcon } from '../../../components/icons';

interface ConvertThoughtModalProps {
  thought: Thought;
  onClose: () => void;
  onTaskCreated: (thoughtId: string, taskId: string) => void;
}

const ConvertThoughtModal: React.FC<ConvertThoughtModalProps> = ({ thought, onClose, onTaskCreated }) => {
  const { addTask } = useTasks();
  const { categories } = useCategories();
  
  const [title, setTitle] = useState(thought.content);
  const [categoryId, setCategoryId] = useState<string>('');
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const generateBreakdown = async () => {
      setIsGenerating(true);
      setError(null);
      try {
        const generated = await generateSubtasks(thought.content);
        setSubtasks(generated.map(s => s.content));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsGenerating(false);
      }
    };
    generateBreakdown();
  }, [thought.content]);

  const handleCreateTask = async () => {
    if (!title.trim()) {
        setError("Task title cannot be empty.");
        return;
    }
    setIsCreating(true);
    setError(null);
    try {
        const newSubtasks = subtasks.map(s => ({ content: s }));
        const newTask = await addTask(title, newSubtasks, categoryId || undefined, thought.id);
        onTaskCreated(thought.id, newTask.id);
    } catch(err) {
        setError((err as Error).message);
        setIsCreating(false);
    }
    // onClose is called via onTaskCreated in the parent
  };

  return (
    <div className="fixed inset-0 bg-brand-background/80 backdrop-blur-sm z-30 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="convert-modal-title"
    >
      <div className="bg-brand-surface border border-brand-primary rounded-lg shadow-2xl w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-brand-text-secondary hover:text-white text-2xl leading-none z-10" aria-label="Close modal">&times;</button>
        
        <div className="p-6">
            <h2 id="convert-modal-title" className="text-2xl font-bold text-brand-text-primary mb-4">Convert to Task</h2>

            {error && <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-md text-sm mb-4">{error}</div>}

            <div className="space-y-4">
                <div>
                    <label htmlFor="task-title" className="block text-sm font-medium text-brand-text-secondary mb-1">Task Title</label>
                    <textarea
                        id="task-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-brand-background border border-brand-primary rounded-md px-3 py-2 text-brand-text-primary focus:ring-2 focus:ring-brand-accent"
                        rows={3}
                        autoFocus
                    />
                </div>
                <div>
                    <label htmlFor="task-category" className="block text-sm font-medium text-brand-text-secondary mb-1">Category (Optional)</label>
                    <select id="task-category" value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full bg-brand-background border border-brand-primary rounded-md px-3 py-2 text-brand-text-primary focus:ring-2 focus:ring-brand-accent">
                        <option value="">No Category</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-brand-text-secondary mb-1">Suggested Sub-tasks</label>
                    {isGenerating ? (
                         <div className="text-sm text-brand-text-secondary animate-subtle-pulse">AI is breaking it down...</div>
                    ) : (
                        <ul className="space-y-2 bg-brand-background p-3 rounded-md border border-brand-primary max-h-40 overflow-y-auto">
                            {subtasks.map((st, index) => (
                                <li key={index} className="text-brand-text-primary list-disc list-inside">{st}</li>
                            ))}
                            {subtasks.length === 0 && <li className="text-brand-text-secondary italic">No sub-tasks suggested.</li>}
                        </ul>
                    )}
                </div>
                <button
                    onClick={handleCreateTask}
                    disabled={isGenerating || isCreating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-accent text-white rounded-md font-semibold disabled:opacity-50 hover:bg-red-500 transition-colors"
                    >
                    {isCreating ? 'Creating...' : 'Create Task'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ConvertThoughtModal;