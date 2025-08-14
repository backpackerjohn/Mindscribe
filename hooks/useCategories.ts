
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Category } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORY_COLORS } from '../components/ColorPicker';

const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'Work', color: CATEGORY_COLORS[8] }, // blue
  { name: 'Personal', color: CATEGORY_COLORS[4] }, // green
  { name: 'Urgent', color: CATEGORY_COLORS[0] }, // red
  { name: 'Ideas', color: CATEGORY_COLORS[1] }, // orange
  { name: 'Health', color: CATEGORY_COLORS[10] }, // purple
];

export const useCategories = () => {
  const { user } = useAuth();
  const LOCAL_STORAGE_KEY = useMemo(() => user ? `mindscribe-categories-${user.id}` : null, [user]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (!LOCAL_STORAGE_KEY) {
      setCategories([]);
      setIsLoading(false);
      return;
    }
    try {
      const storedCategories = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        // Seed with default categories for a new user
        const newCategories = DEFAULT_CATEGORIES.map(cat => ({ ...cat, id: crypto.randomUUID() }));
        setCategories(newCategories);
      }
    } catch (error) {
      console.error("Failed to load categories from localStorage", error);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [LOCAL_STORAGE_KEY]);

  useEffect(() => {
    if (!LOCAL_STORAGE_KEY || isLoading) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(categories));
    } catch (error) {
      console.error("Failed to save categories to localStorage", error);
    }
  }, [categories, LOCAL_STORAGE_KEY, isLoading]);

  const addCategory = useCallback((categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: crypto.randomUUID(),
    };
    setCategories(prev => [...prev, newCategory]);
  }, []);

  const updateCategory = useCallback((updatedCategory: Category) => {
    setCategories(prev => prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat));
  }, []);

  const deleteCategory = useCallback((categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  }, []);

  return { categories, isLoading, addCategory, updateCategory, deleteCategory };
};