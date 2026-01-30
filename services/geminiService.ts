
import { GoogleGenAI } from "@google/genai";

// Fix: Initializing GoogleGenAI using the mandatory named parameter and direct environment variable access
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getHackerInsight = async (numbers: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this sequence of binary-like numbers: ${numbers.join(' ')}. 
      Respond as a scary underground hacker AI that has found something terrifying in these numbers. 
      Keep it short (2-3 sentences max), cryptic, and glitchy. Do not use formatting like bold or bullet points.`,
      config: {
        temperature: 0.9,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 150,
      }
    });
    // Fix: Using the .text property directly as specified in the SDK guidelines
    return response.text || "SYSTEM FAILURE: AI COGNITION DISRUPTED";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "THE NUMBERS... THEY MEAN SOMETHING... RUN.";
  }
};
