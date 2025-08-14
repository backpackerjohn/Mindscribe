import { GoogleGenAI, Type } from "@google/genai";
import type { SubTask } from "../../../types";

const API_KEY = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY! });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        subtasks: {
            type: Type.ARRAY,
            description: "Array of 3-7 concise, actionable subtasks.",
            items: { type: Type.STRING }
        }
    },
    required: ["subtasks"]
};

export async function generateSubtasks(taskTitle: string): Promise<Pick<SubTask, 'content'>[]> {
    if (!API_KEY) {
        console.warn("API_KEY not set. AI subtask generation is disabled.");
        return [];
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Break down the following task into 3-7 small, clear, and actionable steps. Each step should be a manageable subtask.
            
            Task: "${taskTitle}"
            
            Guidelines:
            - Start each subtask with an action verb (e.g., 'Draft', 'Call', 'Schedule').
            - Keep each subtask concise and focused on a single action.
            - The goal is to reduce overwhelm and build momentum.

            Return a JSON object with a "subtasks" key containing an array of strings.
            `,
            config: {
                systemInstruction: "You are an AI assistant acting as an energetic and practical productivity coach for a user with ADHD. Your goal is to break down big, overwhelming tasks into small, clear, actionable steps that are easy to start.",
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.4,
            }
        });

        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        
        if (parsed && Array.isArray(parsed.subtasks)) {
            return parsed.subtasks.map((content: string) => ({ content }));
        }
        return [];

    } catch (error) {
        console.error("Error generating subtasks with Gemini API:", error);
        throw new Error("The AI failed to break down your task. Please try again.");
    }
}