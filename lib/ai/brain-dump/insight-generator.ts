
import { GoogleGenAI, Type } from "@google/genai";
import type { AIThoughtGroup, AIInsight } from "../../../types";

const API_KEY = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY! });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        insights: {
            type: Type.ARRAY,
            description: "Array of 2-4 actionable and supportive insights.",
            items: {
                type: Type.OBJECT,
                properties: {
                    content: { type: Type.STRING, description: "The text of the insight. Should be positive and non-generic." },
                    type: { type: Type.STRING, description: "The type of insight: 'pattern', 'suggestion', or 'connection'." },
                    relatedThoughtIds: {
                        type: Type.ARRAY,
                        description: "Array of thought IDs that this insight is based on.",
                        items: { type: Type.STRING }
                    }
                },
                required: ["content", "type", "relatedThoughtIds"]
            }
        }
    },
    required: ["insights"]
};


export async function generateInsights(thoughtGroups: AIThoughtGroup[]): Promise<AIInsight[]> {
    if (!API_KEY) {
        console.warn("API_KEY environment variable not set. AI insight generation is disabled.");
        return [];
    }
    
    const clusterSummary = thoughtGroups.map(g => 
        `Cluster: "${g.name}"\nDescription: ${g.description}\nThought IDs: [${g.thoughtIds.join(', ')}]`
    ).join('\n\n');

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the following thought clusters, generate 2-4 actionable and supportive insights.
            
            Guidelines:
            - Insights must be grounded in the provided thoughts. Avoid generic advice.
            - Identify patterns, suggest potential actions, or highlight connections between clusters.
            - Frame insights positively and supportively, like a kind librarian suggesting a new book.
            - Do not invent information. Base insights ONLY on the provided text.

            Thought Clusters:
            ---
            ${clusterSummary}
            ---
            `,
            config: {
                systemInstruction: "You are a supportive and insightful AI librarian for a user with ADHD. Your role is to look over their organized thoughts and find gentle, encouraging connections and patterns.",
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.5,
            }
        });

        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        
        if (parsed && Array.isArray(parsed.insights)) {
            return parsed.insights.map((i: any) => ({
                id: crypto.randomUUID(),
                ...i,
            }));
        }
        return [];

    } catch (error) {
        console.error("Error generating insights with Gemini API:", error);
        // Gracefully fail
        return [];
    }
}
