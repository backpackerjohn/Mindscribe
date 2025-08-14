import { GoogleGenAI, Type } from "@google/genai";
import type { Thought, AIThoughtGroup } from "../../../types";

const API_KEY = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY! });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        clusters: {
            type: Type.ARRAY,
            description: "Array of 3-8 thought clusters.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "A short, intuitive, non-technical name for the cluster (e.g., 'Home Projects', 'Work Ideas')." },
                    description: { type: Type.STRING, description: "A one-sentence summary of the cluster's theme." },
                    thoughtIds: {
                        type: Type.ARRAY,
                        description: "Array of original thought IDs belonging to this cluster.",
                        items: { type: Type.STRING }
                    }
                },
                required: ["name", "description", "thoughtIds"]
            }
        }
    },
    required: ["clusters"]
};

export async function clusterThoughts(thoughts: Thought[]): Promise<Omit<AIThoughtGroup, 'thoughts'>[]> {
    if (!API_KEY) {
        console.warn("API_KEY not set. AI clustering is disabled.");
        return [];
    }
    
    const thoughtContent = thoughts.map(t => `ID: ${t.id}\nContent: ${t.content}`).join('\n\n');

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the following thoughts and group them into 3 to 8 meaningful clusters.
            
            Guidelines:
            - Create gentle, intuitive, non-technical cluster names. Think of them as book sections.
            - Clusters should be based on common themes, topics, or potential areas of focus.
            - Ensure every thought is assigned to exactly one cluster.

            Thoughts to analyze:
            ---
            ${thoughtContent}
            ---
            `,
            config: {
                systemInstruction: "You are an AI assistant with the persona of a calm, insightful librarian helping a user with ADHD. Your goal is to gently find patterns and create order from scattered thoughts.",
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.3,
            }
        });

        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        
        if (parsed && Array.isArray(parsed.clusters)) {
            return parsed.clusters.map((c: any) => ({
                id: crypto.randomUUID(),
                name: c.name,
                description: c.description,
                thoughtIds: c.thoughtIds,
                type: 'topic', // Default type
                relevanceScore: Math.random() // Placeholder score
            }));
        }
        return [];

    } catch (error) {
        console.error("Error clustering thoughts with Gemini API:", error);
        throw new Error("The AI failed to organize your thoughts. The response might have been blocked or invalid.");
    }
}