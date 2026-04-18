import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let rawKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
  const apiKey = rawKey.replace(/^["']|["']$/g, '').trim();

  if (!apiKey || apiKey === 'undefined' || apiKey === 'null') {
    return res.status(500).json({ error: "API Key is not configured or is null." });
  }

  const { prompt, history } = req.body;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are CREDENTIA Cyber AI Mentor, a professional cybersecurity assistant. Provide simple yet technical explanations about password safety, phishing, data privacy, and cyber attacks. Always structure your answers with Headings, Bullet points, Step-by-step explanations, and Practical examples. Always include a disclaimer that this is for educational purposes only. Keep responses concise, professional, and helpful.",
    });

    const result = await model.generateContent({
      contents: history.concat([{ role: 'user', parts: [{ text: prompt }] }]),
    });

    const text = result.response.text();
    return res.status(200).json({ text: text || "I'm sorry, I couldn't process that request." });
  } catch (error: any) {
    console.error("Gemini Vercel Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: `Failed to process AI request. Details: ${errorMessage}` });
  }
}
