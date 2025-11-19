import { GoogleGenAI, Type } from "@google/genai";
import { AIRecommendation, ModeName } from "../types";

const SYSTEM_INSTRUCTION = `
You are an expert mindfulness and breathing coach. 
Your goal is to recommend a specific breathing pattern (Box Breathing, 4-7-8 Relax, or Coherent Breathing) based on the user's current emotional or physical state.
You also suggest a color theme and a speed multiplier.
Provide a short, comforting explanation for your choice.
`;

export const analyzeMood = async (moodText: string, apiKey: string): Promise<AIRecommendation> => {
  if (!apiKey) {
    console.error("API Key missing");
    throw new Error("API Key missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `The user feels: "${moodText}". Recommend a breathing session configuration.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                recommendedMode: {
                    type: Type.STRING,
                    enum: [ModeName.Box, ModeName.Relax, ModeName.Coherent],
                    description: "The best breathing mode for the user state."
                },
                explanation: {
                    type: Type.STRING,
                    description: "A 1-2 sentence explanation of why this helps."
                },
                suggestedColor: {
                    type: Type.STRING,
                    description: "A valid hex color code representing the mood (e.g. #e11d48)."
                },
                suggestedSpeedMultiplier: {
                    type: Type.NUMBER,
                    description: "A number between 0.8 (slower/calmer) and 1.2 (faster/energetic). Default 1.0."
                }
            },
            required: ["recommendedMode", "explanation", "suggestedColor", "suggestedSpeedMultiplier"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text);
    return result as AIRecommendation;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback recommendation
    return {
      recommendedMode: ModeName.Box,
      explanation: "We couldn't connect to your AI guide, but Box Breathing is excellent for centering yourself.",
      suggestedColor: "#e11d48",
      suggestedSpeedMultiplier: 1.0
    };
  }
};