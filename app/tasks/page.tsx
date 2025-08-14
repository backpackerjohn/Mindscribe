import React, { useState, useMemo } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useCategories } from '../../hooks/useCategories';
import { ClipboardListIcon, PlusIcon } from '../../components/icons';
import TaskCard from './components/TaskCard';
import AddTaskModal from './components/AddTaskModal';
import AdhdQuote from './components/AdhdQuote';
import CategoryFilter from './components/CategoryFilter';
import type { SubTask } from '../../types';
import { ListSkeleton } from '../../components/Skeletons';

interface TasksPageProps {
    onStartFocus: (taskId: string) => void;
}

const TasksPage: React.FC<TasksPageProps> = ({ onStartFocus }) => {
    const { tasks, isLoading: isLoadingTasks, addTask, toggleSubtask, updateTaskCategory, removeCategoryFromTasks, deleteTask } = useTasks();
    const { categories, isLoading: isLoadingCategories, deleteCategory } = useCategories();
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

    const handleAddTask = async (title: string, subtasks: Pick<SubTask, 'content'>[], categoryId?: string) => {
        await addTask(title, subtasks, categoryId);
        setIsAddTaskModalOpen(false);
    };

    const handleCategoryDelete = (categoryId: string) => {
        // This function now orchestrates deletion across both hooks
        deleteCategory(categoryId); // from useCategories
        removeCategoryFromTasks(categoryId); // from useTasks
        if (activeCategoryId === categoryId) {
            setActiveCategoryId(null);
        }
    };

    const filteredTasks = useMemo(() => {
        if (!activeCategoryId) return tasks;
        return tasks.filter(task => task.categoryId === activeCategoryId);
    }, [tasks, activeCategoryId]);
    
    const isLoading = isLoadingTasks || isLoadingCategories;

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
                    <aside className="w-full md:w-1/4 md:sticky md:top-24 self-start">
                       <CategoryFilter 
                            categories={categories}
                            tasks={tasks}
                            activeCategoryId={activeCategoryId}
                            setActiveCategoryId={setActiveCategoryId}
                            onCategoryDelete={handleCategoryDelete} // Pass the orchestrator function
                       />
                    </aside>
                    
                    <main className="flex-1">
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={() => setIsAddTaskModalOpen(true)}
                                className="flex items-center justify-center gap-1 px-4 py-2 bg-brand-accent text-white rounded-md font-semibold hover:bg-red-500 transition-colors duration-200"
                            >
                                <PlusIcon className="h-5 w-5" />
                                <span>New Task</span>
                            </button>
                        </div>
                        
                        {isLoading ? (
                             <ListSkeleton type="task" />
                        ) : filteredTasks.length > 0 ? (
                            <div className="space-y-4">
                                {filteredTasks.map(task => (
                                    <TaskCard 
                                        key={task.id} 
                                        task={task} 
                                        categories={categories}
                                        onToggleSubtask={toggleSubtask} 
                                        onStartFocus={onStartFocus}
                                        onUpdateCategory={updateTaskCategory}
                                        onDeleteTask={deleteTask}
                                    />
                                ))}
                            </div>
                        ) : (
                             <div className="text-center text-brand-text-secondary p-8 rounded-lg bg-brand-surface border-2 border-dashed border-brand-primary">
                                <h3 className="text-lg font-semibold text-brand-text-primary">
                                    {tasks.length === 0 ? "No tasks yet!" : "No tasks in this category"}
                                </h3>
                                <p className="mt-1">
                                    {tasks.length === 0 ? "Click \"New Task\" to get started." : "Try selecting another category or adding a new task."}
                                </p>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {isAddTaskModalOpen && (
                <AddTaskModal
                    categories={categories}
                    onClose={() => setIsAddTaskModalOpen(false)}
                    onAddTask={handleAddTask}
                />
            )}
        </div>
    );
};

export default TasksPage;