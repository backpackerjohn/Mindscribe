
import { useState, useEffect, useCallback } from 'react';
import type { Task, SubTask } from '../types';
import { generateSubtasks } from '../lib/ai/task-management/subtask-generator';

const LOCAL_STORAGE_KEY = 'mindscribe-tasks';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to localStorage", error);
    }
  }, [tasks]);

  const addTask = useCallback(async (title: string, subtasks: Pick<SubTask, 'content'>[]) => {
    if (!title.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      subtasks: subtasks.map(st => ({ ...st, id: crypto.randomUUID(), completed: false })),
      completed: false,
      createdAt: new Date().toISOString(),
      aiBreakdownRan: true,
      relatedBrainDumpEntries: [],
    };

    setTasks(prev => [newTask, ...prev]);
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


  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  return {
    tasks,
    isLoading,
    addTask,
    toggleSubtask,
    deleteTask,
  };
};
