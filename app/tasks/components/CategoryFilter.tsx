
import React, { useState, useMemo } from 'react';
import type { Category, Task } from '../../../types';
import { Cog6ToothIcon } from '../../../components/icons';
import ManageCategoriesModal from './ManageCategoriesModal';

interface CategoryFilterProps {
    categories: Category[];
    tasks: Task[];
    activeCategoryId: string | null;
    setActiveCategoryId: (id: string | null) => void;
    onCategoryDelete: (categoryId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, tasks, activeCategoryId, setActiveCategoryId, onCategoryDelete }) => {
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);

    const taskCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        categories.forEach(cat => counts[cat.id] = 0);
        tasks.forEach(task => {
            if (task.categoryId && counts[task.categoryId] !== undefined) {
                counts[task.categoryId]++;
            }
        });
        return counts;
    }, [categories, tasks]);

    const baseItemClass = "w-full flex items-center justify-between gap-2 p-2 rounded-md cursor-pointer transition-colors text-left";
    const activeItemClass = "bg-brand-accent text-white font-semibold";
    const inactiveItemClass = "text-brand-text-secondary hover:bg-brand-primary/50 hover:text-white";

    return (
        <>
            <div className="bg-brand-surface p-4 rounded-lg border border-brand-primary animate-fade-in h-full">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-brand-text-primary">Categories</h4>
                    <button onClick={() => setIsManageModalOpen(true)} className="text-brand-text-secondary hover:text-white" title="Manage Categories">
                        <Cog6ToothIcon className="w-6 h-6"/>
                    </button>
                </div>
                <div className="space-y-2">
                    <button 
                        onClick={() => setActiveCategoryId(null)}
                        className={`${baseItemClass} ${activeCategoryId === null ? activeItemClass : inactiveItemClass}`}
                    >
                        <span>All Tasks</span>
                        <span className="text-xs font-mono bg-brand-background px-2 py-0.5 rounded">{tasks.length}</span>
                    </button>
                    {categories.map(cat => (
                        <button 
                            key={cat.id}
                            onClick={() => setActiveCategoryId(cat.id)}
                            className={`${baseItemClass} ${activeCategoryId === cat.id ? activeItemClass : inactiveItemClass}`}
                        >
                           <div className="flex items-center gap-2 overflow-hidden">
                             <div className="w-3 h-3 rounded-full flex-shrink-0" style={{backgroundColor: cat.color}}></div>
                             <span className="truncate" title={cat.name}>{cat.name}</span>
                           </div>
                           <span className="text-xs font-mono bg-brand-background px-2 py-0.5 rounded flex-shrink-0">{taskCounts[cat.id] ?? 0}</span>
                        </button>
                    ))}
                </div>
            </div>

            {isManageModalOpen && (
                <ManageCategoriesModal 
                    onClose={() => setIsManageModalOpen(false)} 
                    onCategoryDelete={onCategoryDelete}
                />
            )}
        </>
    );
};

export default CategoryFilter;