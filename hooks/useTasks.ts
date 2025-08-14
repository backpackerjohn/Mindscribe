
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Task, SubTask } from '../types';
import { generateSubtasks } from '../lib/ai/task-management/subtask-generator';
import { useAuth } from '../contexts/AuthContext';

export const useTasks = () => {
  const { user } = useAuth();
  const LOCAL_STORAGE_KEY = useMemo(() => user ? `mindscribe-tasks-${user.id}` : null, [user]);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (!LOCAL_STORAGE_KEY) {
        setTasks([]);
        setIsLoading(false);
        return;
    }
    try {
      const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, [LOCAL_STORAGE_KEY]);

  useEffect(() => {
    if (!LOCAL_STORAGE_KEY || isLoading) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to localStorage", error);
    }
  }, [tasks, LOCAL_STORAGE_KEY, isLoading]);

  const addTask = useCallback(async (title: string, subtasks: Pick<SubTask, 'content'>[], categoryId?: string, sourceThoughtId?: string): Promise<Task> => {
    if (!title.trim()) throw new Error("Task title cannot be empty.");

    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      subtasks: subtasks.map(st => ({ ...st, id: crypto.randomUUID(), completed: false })),
      categoryId,
      completed: false,
      createdAt: new Date().toISOString(),
      aiBreakdownRan: subtasks.length > 0,
      relatedBrainDumpEntries: sourceThoughtId ? [sourceThoughtId] : [],
      sourceThoughtId: sourceThoughtId,
    };

    setTasks(prev => [newTask, ...prev]);
    return newTask;
  }, []);
  
  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks(prevTasks => {
        const newTasks = prevTasks.map(task => {
            if (task.id === taskId) {
                const newSubtasks = task.subtasks.map(subtask => {
                    if (subtask.id === subtaskId) {
                        return { ...subtask, completed: !subtask.completed };
                    }
                    return subtask;
                });
                const allCompleted = newSubtasks.every(st => st.completed);
                return { ...task, subtasks: newSubtasks, completed: allCompleted };
            }
            return task;
        });
        return newTasks;
    });
  }, []);

  const updateTaskCategory = useCallback((taskId: string, categoryId: string | undefined) => {
      setTasks(prev => prev.map(task => task.id === taskId ? { ...task, categoryId } : task));
  }, []);

  const removeCategoryFromTasks = useCallback((categoryId: string) => {
    setTasks(prev => prev.map(task => task.categoryId === categoryId ? {...task, categoryId: undefined} : task));
  }, []);


  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  return {
    tasks,
    isLoading,
    addTask,
    toggleSubtask,
    deleteTask,
    updateTaskCategory,
    removeCategoryFromTasks,
  };
};