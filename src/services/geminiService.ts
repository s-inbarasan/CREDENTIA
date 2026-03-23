/// <reference types="vite/client" />
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });

export const getCyberResponse = async (prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: history.concat([{ role: 'user', parts: [{ text: prompt }] }]),
      config: {
        systemInstruction: "You are CREDENTIA Cyber AI Mentor, a professional cybersecurity assistant. Provide simple yet technical explanations about password safety, phishing, data privacy, and cyber attacks. Always structure your answers with Headings, Bullet points, Step-by-step explanations, and Practical examples. Always include a disclaimer that this is for educational purposes only. Keep responses concise, professional, and helpful.",
      },
    });
    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Connection error. Please check your network or API key.";
  }
};

export interface ThreatAnalysisResult {
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  suspicious: boolean;
  reasons: string[];
  details: string;
  recommendations: string[];
}

export const analyzeThreat = async (input: string): Promise<ThreatAnalysisResult | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following URL or IP address for potential cybersecurity threats: "${input}". Provide a risk assessment.`,
      config: {
        systemInstruction: "You are a cybersecurity threat intelligence analyst. Analyze the provided URL or IP address. Return a JSON object with the following structure: { \"riskLevel\": \"Low\" | \"Medium\" | \"High\" | \"Critical\", \"suspicious\": boolean, \"reasons\": string[], \"details\": string, \"recommendations\": string[] }",
        responseMimeType: "application/json",
      },
    });
    return JSON.parse(response.text || "{}") as ThreatAnalysisResult;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
