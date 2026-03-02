import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// We use the GEMINI_API_KEY from the environment variables
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const models = {
  // Using the recommended model for complex text tasks
  text: "gemini-2.5-flash", 
};

export async function generateContent(prompt: string, systemInstruction?: string) {
  try {
    const response = await ai.models.generateContent({
      model: models.text,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}

export async function generateJSON<T>(prompt: string, schema: any, systemInstruction?: string): Promise<T> {
  try {
    const response = await ai.models.generateContent({
      model: models.text,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: systemInstruction,
      }
    });
    
    if (!response.text) {
      throw new Error("No response text generated");
    }

    return JSON.parse(response.text) as T;
  } catch (error) {
    console.error("Error generating JSON:", error);
    throw error;
  }
}
