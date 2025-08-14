
import { GoogleGenAI, Type } from "@google/genai";
import type { SubTask, ClarifyingQuestion } from "../../../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const clarifyingQuestionsSchema = {
    type: Type.OBJECT,
    properties: {
        questions: {
            type: Type.ARRAY,
            description: "Array of 3-4 multiple-choice clarifying questions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The clarifying question to ask the user." },
                    options: {
                        type: Type.ARRAY,
                        description: "An array of 2-4 short, distinct answer options.",
                        items: { type: Type.STRING }
                    }
                },
                required: ["question", "options"]
            }
        }
    },
    required: ["questions"]
};

export async function generateClarifyingQuestions(taskTitle: string): Promise<Omit<ClarifyingQuestion, 'id'>[]> {
    if (!API_KEY) {
        console.warn("API_KEY environment variable not set. AI question generation is disabled.");
        return [];
    }
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `To help me break down the task "${taskTitle}", I need to ask a few questions to understand the goal. Generate 3-4 multiple-choice questions to reduce ambiguity and define the scope. Each question should have 2-4 short, distinct options.
            
            Example for "plan a trip": "What is the primary goal of this trip?" with options ["Relaxation", "Adventure", "Family Time"].
            
            The questions should be practical and help define the task's boundaries or goals. Return a JSON object matching the provided schema.
            `,
            config: {
                systemInstruction: "You are an AI assistant acting as an energetic and practical productivity coach for a user with ADHD. Your goal is to help them clarify tasks to make them less overwhelming.",
                responseMimeType: "application/json",
                responseSchema: clarifyingQuestionsSchema,
                temperature: 0.5,
            }
        });

        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        
        if (parsed && Array.isArray(parsed.questions)) {
            return parsed.questions;
        }
        return [];

    } catch (error) {
        console.error("Error generating clarifying questions with Gemini API:", error);
        throw new Error("The AI failed to generate clarifying questions. The response might have been blocked or invalid.");
    }
}


const refinedSubtasksSchema = {
    type: Type.OBJECT,
    properties: {
        subtasks: {
            type: Type.ARRAY,
            description: "Array of 3-7 concise, actionable subtasks based on the user's answers.",
            items: { type: Type.STRING }
        }
    },
    required: ["subtasks"]
};


export async function refineSubtasks(taskTitle: string, answers: Record<string, string>): Promise<Pick<SubTask, 'content'>[]> {
    if (!API_KEY) {
        console.warn("API_KEY environment variable not set. AI subtask refinement is disabled.");
        return [];
    }

    const answersString = Object.entries(answers)
        .map(([question, answer]) => `- For the question "${question}", the user chose: "${answer}".`)
        .join('\n');

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Awesome! Thanks for the answers. Now I can create a much better plan for your task: "${taskTitle}".

            Here are the clarifications you provided:
            ---
            ${answersString}
            ---
            
            Based on this, here is a new, refined list of 3-7 small, clear, and actionable subtasks. Each subtask will start with an action verb to make it easy to start.
            `,
            config: {
                systemInstruction: "You are an AI assistant acting as an energetic and practical productivity coach for a user with ADHD. You've just asked some clarifying questions and now you're creating the perfect, tailored action plan.",
                responseMimeType: "application/json",
                responseSchema: refinedSubtasksSchema,
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
        console.error("Error refining subtasks with Gemini API:", error);
        throw new Error("The AI failed to refine your task breakdown. Please try again.");
    }
}
