
import React, { useState, useMemo, useEffect } from 'react';
import { useThoughts } from '../../hooks/useThoughts';
import { useTasks } from '../../hooks/useTasks';
import { useCategories } from '../../hooks/useCategories';
import { aiCoordinator } from '../../lib/ai/ai-coordinator';
import type { Thought, Task, Category, AIInsight } from '../../types';
import TaskCard from '../tasks/components/TaskCard';
import ThoughtCard from '../../components/ThoughtCard';
import ConvertThoughtModal from '../brain-dump/components/ConvertThoughtModal';
import { BrainCircuitIcon, ClipboardListIcon, SparklesIcon, SearchIcon } from '../../components/icons';

interface DashboardPageProps {
    onStartFocus: (taskId: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onStartFocus }) => {
    const { allThoughts, linkThoughtToTask, isLoading: isLoadingThoughts } = useThoughts();
    const { tasks, toggleSubtask, updateTaskCategory, removeCategoryFromTasks, deleteTask, isLoading: isLoadingTasks } = useTasks();
    const { categories, deleteCategory, isLoading: isLoadingCategories } = useCategories();

    const [convertingThought, setConvertingThought] = useState<Thought | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleTaskCreated = (thoughtId: string, taskId: string) => {
        linkThoughtToTask(thoughtId, taskId);
        setConvertingThought(null);
    };

    const handleCategoryDelete = (categoryId: string) => {
        deleteCategory(categoryId);
        removeCategoryFromTasks(categoryId);
    };

    const filteredThoughts = useMemo(() => {
        return allThoughts.filter(thought => thought.content.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [allThoughts, searchTerm]);

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [tasks, searchTerm]);
    
    const isLoading = isLoadingThoughts || isLoadingTasks || isLoadingCategories;
    
    if (isLoading) {
        return <div className="text-center text-brand-text-secondary p-8">Loading dashboard...</div>;
    }

    return (
        <>
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto w-full">
                    <header className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-brand-text-primary tracking-tight">
                            Unified Dashboard
                        </h1>
                        <p className="text-brand-text-secondary mt-1">
                            Your thoughts and tasks, harmonized.
                        </p>
                    </header>
                    
                    <div className="relative mb-6">
                        <SearchIcon className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-brand-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search across thoughts and tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-brand-surface border border-brand-primary rounded-md text-brand-text-primary placeholder-brand-text-secondary focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main content column */}
                        <div className="lg:col-span-2 space-y-6">
                            <ActiveTasksWidget 
                                tasks={filteredTasks} 
                                categories={categories} 
                                onToggleSubtask={toggleSubtask} 
                                onStartFocus={onStartFocus}
                                onUpdateCategory={updateTaskCategory}
                                onDeleteTask={deleteTask}
                            />
                            <RecentThoughtsWidget thoughts={filteredThoughts} onConvertToTask={setConvertingThought} />
                        </div>

                        {/* Sidebar column */}
                        <div className="space-y-6">
                           <StatsWidget thoughts={allThoughts} tasks={tasks} />
                           <SuggestionsWidget thoughts={allThoughts} onConvertToTask={setConvertingThought} />
                           <InsightsWidget thoughts={allThoughts} tasks={tasks} />
                        </div>
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

// --- WIDGETS ---

const StatsWidget = ({ thoughts, tasks }: { thoughts: Thought[], tasks: Task[] }) => {
    const completedTasks = tasks.filter(t => t.completed).length;
    return (
        <div className="bg-brand-surface p-4 rounded-lg border border-brand-primary">
            <h3 className="text-lg font-semibold text-brand-text-primary mb-3">At a Glance</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                    <p className="text-3xl font-bold text-brand-accent">{thoughts.length}</p>
                    <p className="text-sm text-brand-text-secondary">Thoughts Captured</p>
                </div>
                 <div>
                    <p className="text-3xl font-bold text-brand-accent">{tasks.length}</p>
                    <p className="text-sm text-brand-text-secondary">Total Tasks</p>
                </div>
                 <div>
                    <p className="text-3xl font-bold text-brand-accent">{completedTasks}</p>
                    <p className="text-sm text-brand-text-secondary">Tasks Completed</p>
                </div>
                 <div>
                    <p className="text-3xl font-bold text-brand-accent">{thoughts.filter(t => t.convertedToTaskId).length}</p>
                    <p className="text-sm text-brand-text-secondary">Thoughts Converted</p>
                </div>
            </div>
        </div>
    );
};

const ActiveTasksWidget = ({ tasks, categories, onToggleSubtask, onStartFocus, onUpdateCategory, onDeleteTask }: { 
    tasks: Task[], categories: Category[] } & Omit<React.ComponentProps<typeof TaskCard>, 'task' | 'categories'>
) => {
    const activeTasks = tasks.filter(t => !t.completed).slice(0, 5);
    return (
        <div className="bg-brand-surface p-4 rounded-lg border border-brand-primary">
            <div className="flex items-center gap-2 mb-3">
                <ClipboardListIcon className="h-6 w-6 text-brand-accent"/>
                <h3 className="text-lg font-semibold text-brand-text-primary">Active Tasks</h3>
            </div>
            {activeTasks.length > 0 ? (
                <div className="space-y-3">
                    {activeTasks.map(task => (
                        <TaskCard 
                            key={task.id} 
                            task={task} 
                            categories={categories}
                            onToggleSubtask={onToggleSubtask}
                            onStartFocus={onStartFocus}
                            onUpdateCategory={onUpdateCategory}
                            onDeleteTask={onDeleteTask}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-sm text-brand-text-secondary text-center py-4">No active tasks. Great job, or time to plan!</p>
            )}
        </div>
    );
};

const RecentThoughtsWidget = ({ thoughts, onConvertToTask }: { thoughts: Thought[], onConvertToTask: (thought: Thought) => void }) => {
    const recentThoughts = thoughts.slice(0, 3);
     return (
        <div className="bg-brand-surface p-4 rounded-lg border border-brand-primary">
            <div className="flex items-center gap-2 mb-3">
                <SparklesIcon className="h-6 w-6 text-brand-accent"/>
                <h3 className="text-lg font-semibold text-brand-text-primary">Recent Thoughts</h3>
            </div>
             {recentThoughts.length > 0 ? (
                <div className="space-y-3">
                    {recentThoughts.map(thought => (
                        <ThoughtCard key={thought.id} thought={thought} onConvertToTask={onConvertToTask} />
                    ))}
                </div>
            ) : (
                <p className="text-sm text-brand-text-secondary text-center py-4">Capture a thought in the Brain Dump to see it here.</p>
            )}
        </div>
    );
};

const SuggestionsWidget = ({ thoughts, onConvertToTask }: { thoughts: Thought[], onConvertToTask: (thought: Thought) => void }) => {
    const [suggestions, setSuggestions] = useState<Thought[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestions = async () => {
            setIsLoading(true);
            const unconverted = thoughts.filter(t => !t.convertedToTaskId);
            if (unconverted.length > 2) {
                try {
                    const suggestedThoughts = await aiCoordinator.suggestTasksFromThoughts(unconverted);
                    setSuggestions(suggestedThoughts);
                } catch(e){ console.error(e); setSuggestions([]);}
            } else {
                setSuggestions([]);
            }
            setIsLoading(false);
        };
        fetchSuggestions();
    }, [thoughts]);
    
    if (isLoading) return <div className="bg-brand-surface p-4 rounded-lg border border-brand-primary text-sm text-brand-text-secondary">Checking for suggestions...</div>;
    if (suggestions.length === 0) return null;

    return (
        <div className="bg-brand-surface p-4 rounded-lg border border-brand-primary">
            <h3 className="text-lg font-semibold text-brand-text-primary mb-3">Actionable Thoughts</h3>
            <div className="space-y-2">
                {suggestions.map(thought => (
                    <div key={thought.id} className="bg-brand-primary/50 p-3 rounded-md">
                        <p className="text-sm text-brand-text-secondary italic line-clamp-2">"{thought.content}"</p>
                        <button onClick={() => onConvertToTask(thought)} className="text-xs font-semibold text-brand-accent hover:underline mt-2">Convert to Task</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const InsightsWidget = ({ thoughts, tasks }: { thoughts: Thought[], tasks: Task[] }) => {
    const [insights, setInsights] = useState<AIInsight[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchInsights = async () => {
            if (thoughts.length > 2 && tasks.length > 0) {
                setIsLoading(true);
                try {
                    const crossInsights = await aiCoordinator.generateCrossSystemInsights(thoughts, tasks);
                    setInsights(crossInsights);
                } catch(e) { console.error(e); setInsights([]); }
                setIsLoading(false);
            } else {
                 setInsights([]);
                 setIsLoading(false);
            }
        };
        fetchInsights();
    }, [thoughts, tasks]);

    return (
        <div className="bg-brand-surface p-4 rounded-lg border border-brand-primary">
            <div className="flex items-center gap-2 mb-3">
                <BrainCircuitIcon className="h-6 w-6 text-brand-accent"/>
                <h3 className="text-lg font-semibold text-brand-text-primary">Cross-System Insights</h3>
            </div>
            {isLoading ? (
                <p className="text-sm text-brand-text-secondary animate-subtle-pulse">AI is analyzing...</p>
            ) : insights.length > 0 ? (
                <ul className="space-y-2">
                    {insights.map(insight => (
                        <li key={insight.id} className="text-sm text-brand-text-secondary list-disc list-inside ml-2">{insight.content}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-brand-text-secondary">Add more thoughts and tasks to unlock AI insights.</p>
            )}
        </div>
    )
}


export default DashboardPage;