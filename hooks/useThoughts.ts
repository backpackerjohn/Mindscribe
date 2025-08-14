
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Thought, ViewMode, AIThoughtGroup, AIInsight } from '../types';
import { generateTags } from '../services/geminiService';
import { clusterThoughts } from '../lib/ai/brain-dump/thought-organizer';
import { generateInsights } from '../lib/ai/brain-dump/insight-generator';
import { useAuth } from '../contexts/AuthContext';

export const useThoughts = () => {
  const { user } = useAuth();
  const LOCAL_STORAGE_KEY = useMemo(() => user ? `mindscribe-thoughts-${user.id}` : null, [user]);

  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // New state for PRP 2
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [clusters, setClusters] = useState<AIThoughtGroup[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isOrganizing, setIsOrganizing] = useState(false);


  useEffect(() => {
    setIsLoading(true);
    if (!LOCAL_STORAGE_KEY) {
        setThoughts([]);
        setIsLoading(false);
        return;
    }
    try {
      const storedThoughts = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedThoughts) {
        setThoughts(JSON.parse(storedThoughts));
      } else {
        setThoughts([]);
      }
    } catch (error) {
      console.error("Failed to load thoughts from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, [LOCAL_STORAGE_KEY]);

  useEffect(() => {
    if (!LOCAL_STORAGE_KEY || isLoading) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(thoughts));
    } catch (error) {
      console.error("Failed to save thoughts to localStorage", error);
    }
  }, [thoughts, LOCAL_STORAGE_KEY, isLoading]);

  const addThought = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const newThought: Thought = {
      id: crypto.randomUUID(),
      content,
      tags: [],
      createdAt: new Date().toISOString(),
      isTagging: true,
      isSaving: true,
    };

    setThoughts(prev => [newThought, ...prev]);

    setTimeout(() => {
         setThoughts(prev => prev.map(t => t.id === newThought.id ? { ...t, isSaving: false } : t));
    }, 500);

    const generatedTags = await generateTags(content);
    
    setThoughts(prev => 
      prev.map(t => 
        t.id === newThought.id ? { ...t, tags: generatedTags, isTagging: false } : t
      )
    );
    // When a new thought is added, existing clusters might be stale.
    setClusters([]);
    setInsights([]);
    if(viewMode === 'cluster'){
        setViewMode('list');
    }
  }, [viewMode]);

  const organizeThoughts = useCallback(async () => {
    if (thoughts.length < 3) {
        alert("You need at least 3 thoughts to use the organizer.");
        return;
    }
    setIsOrganizing(true);
    setInsights([]);
    try {
        const thoughtGroups = await clusterThoughts(thoughts);
        
        // Map full thought objects back into clusters for rendering
        const hydratedGroups = thoughtGroups.map(group => ({
            ...group,
            thoughts: group.thoughtIds.map(id => thoughts.find(t => t.id === id)).filter(Boolean) as Thought[],
        }));
        setClusters(hydratedGroups);
        
        const generatedInsights = await generateInsights(hydratedGroups);
        setInsights(generatedInsights);
        
        setViewMode('cluster');
    } catch (error) {
        console.error("Failed to organize thoughts:", error);
        alert("There was an error organizing your thoughts. Please try again.");
    } finally {
        setIsOrganizing(false);
    }
  }, [thoughts]);

  const linkThoughtToTask = useCallback((thoughtId: string, taskId: string) => {
    setThoughts(prev => prev.map(t => t.id === thoughtId ? {
      ...t,
      convertedToTaskId: taskId,
      relatedTasks: [...(t.relatedTasks || []), taskId]
    } : t));
  }, []);

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    thoughts.forEach(thought => {
      thought.tags.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [thoughts]);

  const filteredThoughts = useMemo(() => {
    return thoughts.filter(thought => {
      const searchMatch = searchTerm ? thought.content.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      const tagMatch = activeTag ? thought.tags.includes(activeTag) : true;
      return searchMatch && tagMatch;
    });
  }, [thoughts, searchTerm, activeTag]);
  
  const clearFilters = () => {
    setSearchTerm('');
    setActiveTag(null);
  }

  return {
    thoughts: filteredThoughts,
    allThoughts: thoughts,
    allTags,
    isLoading,
    addThought,
    searchTerm,
    setSearchTerm,
    activeTag,
    setActiveTag,
    clearFilters,
    linkThoughtToTask,
    // PRP 2
    viewMode,
    setViewMode,
    clusters,
    insights,
    isOrganizing,
    organizeThoughts,
  };
};