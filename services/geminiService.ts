
import { GoogleGenAI, Type } from "@google/genai";
import { LocalityInsight, AISearchResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getLocalityInsights(area: string, pincode: string, state: string): Promise<{
  insights: LocalityInsight;
  sources: { uri: string; title: string }[];
} | null> {
  try {
    const prompt = `Provide detailed geographical and cultural insights about the locality: ${area}, Pincode: ${pincode}, ${state}, India. 
    Focus on local infrastructure. List 3 Government Hospitals, 3 major Landmarks, and recent local news or development updates.
    Return data in structured JSON.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", 
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyPlaces: { type: Type.ARRAY, items: { type: Type.STRING } },
            connectivity: { type: Type.STRING },
            popularFor: { type: Type.ARRAY, items: { type: Type.STRING } },
            hospitals: { type: Type.ARRAY, items: { type: Type.STRING } },
            schools: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["summary", "keyPlaces", "connectivity", "popularFor", "hospitals", "schools"],
        },
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        uri: chunk.web?.uri || "",
        title: chunk.web?.title || "Source"
      }))
      .filter((s: any) => s.uri !== "") || [];

    if (response.text) {
      return {
        insights: JSON.parse(response.text.trim()),
        sources: sources
      };
    }
    return null;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return null;
  }
}

export async function processNaturalQuery(userInput: string): Promise<AISearchResult | null> {
  try {
    const prompt = `You are an Indian Postal Intelligence expert. Analyze the user's natural language input: "${userInput}".
    
    Your goal is to:
    1. Extract the core search term (e.g., if user says "what is the pincode of Ameerpet", extract "Ameerpet").
    2. Detect if the intent refers to a 'pincode' (6-digit number) or an 'area' (location name).
    3. Provide a brief, professional 1-sentence "Neural Insight" that adds value or confirms the context (e.g., "Analyzing postal records for the prominent residential and commercial hub of Ameerpet").

    Return the result in valid JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            query: { type: Type.STRING, description: "The normalized search term extracted from the input." },
            detectedType: { type: Type.STRING, enum: ["pincode", "area"], description: "Whether the term is a numeric pincode or a text area." },
            explanation: { type: Type.STRING, description: "A one-sentence expert context for the user." }
          },
          required: ["query", "detectedType", "explanation"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    return null;
  } catch (error) {
    console.error("AI Search Error:", error);
    return null;
  }
}
