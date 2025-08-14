
import { GoogleGenAI, Type } from "@google/genai";
import type { Task, Thought, AIInsight } from '../../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

/**
 * Orchestrates AI logic across the entire application, ensuring context is shared
 * and suggestions are consistent between the Brain Dump and Task Management systems.
 */
class AICoordinator {

  constructor() {
    console.log("AI Coordinator initialized.");
  }

  async generateCrossSystemInsights(thoughts: Thought[], tasks: Task[]): Promise<AIInsight[]> {
    if (thoughts.length === 0 || tasks.length === 0) return [];
    
    const thoughtSummary = thoughts.map(t => `- Thought: ${t.content}`).join('\n');
    const taskSummary = tasks.map(t => `- Task: ${t.title} (${t.completed ? 'completed' : 'active'})`).join('\n');

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Analyze the user's thoughts and tasks to find 1-3 insightful connections or patterns.
        
        Guidelines:
        - Identify links between thoughts and tasks (e.g., a recurring thought theme that matches an active task).
        - Suggest actions based on observed patterns (e.g., "You have several thoughts about 'learning to code', maybe create a task for it?").
        - Keep insights concise, positive, and supportive.
        - Ground every insight in the provided data.
        
        User's Thoughts:
        ${thoughtSummary}
        
        User's Tasks:
        ${taskSummary}
        `,
        config: {
          systemInstruction: "You are a helpful AI assistant for a user with ADHD, designed to find non-obvious connections between their scattered thoughts and their formal tasks.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
                insights: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            content: { type: Type.STRING, description: "The text of the insight." },
                            type: { type: Type.STRING, description: "Insight type: 'connection', 'pattern', 'suggestion'." }
                        },
                         required: ["content", "type"]
                    }
                }
            },
            required: ["insights"]
          },
          temperature: 0.6,
        }
      });
      const jsonText = response.text.trim();
      const parsed = JSON.parse(jsonText);
      return parsed.insights.map((i: any) => ({ ...i, id: crypto.randomUUID() })) || [];
    } catch(e) {
      console.error("Failed to generate cross-system insights:", e);
      return [];
    }
  }

  async suggestTasksFromThoughts(thoughts: Thought[]): Promise<Thought[]> {
      const actionableThoughts = thoughts.filter(t => !t.convertedToTaskId);
      if (actionableThoughts.length < 3) return [];

      const thoughtContent = actionableThoughts.map(t => `ID: ${t.id}\nContent: ${t.content}`).join('\n\n');

      try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `From the following list of thoughts, identify the top 1-3 that are most actionable and would make good tasks.
            
            Guidelines:
            - Look for thoughts that express intent, a problem to solve, or a clear to-do item.
            - Ignore vague musings or simple observations.
            - Prioritize thoughts that seem to have energy or urgency behind them.

            Thoughts:
            ---
            ${thoughtContent}
            ---
            `,
            config: {
                systemInstruction: "You are an AI assistant helping a user with ADHD identify which of their thoughts are ready to become concrete actions. Your goal is to spot potential tasks in a sea of ideas.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            description: "Array of suggested thought IDs to convert to tasks.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    thoughtId: { type: Type.STRING, description: "The ID of the thought to suggest." }
                                },
                                required: ["thoughtId"]
                            }
                        }
                    },
                    required: ["suggestions"]
                },
                temperature: 0.3
            }
        });
        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        
        if (parsed && Array.isArray(parsed.suggestions)) {
            const suggestedIds = new Set(parsed.suggestions.map((s: any) => s.thoughtId));
            return actionableThoughts.filter(t => suggestedIds.has(t.id));
        }
        return [];
      } catch(e) {
        console.error("Failed to get task suggestions:", e);
        return [];
      }
  }
}

// Export a singleton instance
export const aiCoordinator = new AICoordinator();
