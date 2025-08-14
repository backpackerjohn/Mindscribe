
import React, { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { ClipboardListIcon, PlusIcon } from '../../components/icons';
import TaskCard from './components/TaskCard';
import AddTaskModal from './components/AddTaskModal';
import AdhdQuote from './components/AdhdQuote';
import CategoryFilter from './components/CategoryFilter';
import type { SubTask } from '../../types';


const TasksPage: React.FC = () => {
    const { tasks, isLoading, addTask, toggleSubtask } = useTasks();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddTask = async (title: string, subtasks: Pick<SubTask, 'content'>[]) => {
        await addTask(title, subtasks);
        setIsModalOpen(false);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto w-full">
                <header className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3">
                        <ClipboardListIcon className="h-8 w-8 text-brand-accent"/>
                        <h1 className="text-3xl sm:text-4xl font-bold text-brand-text-primary tracking-tight">
                        Task Manager
                        </h1>
                    </div>
                     <p className="text-brand-text-secondary mt-2">
                        Break down your goals into manageable steps.
                    </p>
                </header>

                <div className="mb-6">
                    <AdhdQuote />
                </div>
                
                <div className="flex flex-col md:flex-row gap-8">
                    <aside className="w-full md:w-1/4">
                       <CategoryFilter />
                    </aside>
                    
                    <main className="flex-1">
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center justify-center gap-1 px-4 py-2 bg-brand-accent text-white rounded-md font-semibold hover:bg-red-500 transition-colors duration-200"
                            >
                                <PlusIcon className="h-5 w-5" />
                                <span>New Task</span>
                            </button>
                        </div>
                        
                        {isLoading ? (
                             <div className="text-center text-brand-text-secondary p-8">Loading tasks...</div>
                        ) : tasks.length > 0 ? (
                            <div className="space-y-4">
                                {tasks.map(task => (
                                    <TaskCard key={task.id} task={task} onToggleSubtask={toggleSubtask} />
                                ))}
                            </div>
                        ) : (
                             <div className="text-center text-brand-text-secondary p-8 rounded-lg bg-brand-surface border-2 border-dashed border-brand-primary">
                                <h3 className="text-lg font-semibold text-brand-text-primary">No tasks yet!</h3>
                                <p className="mt-1">Click "New Task" to get started.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {isModalOpen && (
                <AddTaskModal
                    onClose={() => setIsModalOpen(false)}
                    onAddTask={handleAddTask}
                />
            )}
        </div>
    );
};

export default TasksPage;
