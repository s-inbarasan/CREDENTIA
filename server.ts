import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Serve presentation.html directly
  app.get("/presentation.html", (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'presentation.html'));
  });

  // Example OpenAI route (placeholder for future use)
  app.post("/api/openai", express.json(), async (req, res) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "OPENAI_API_KEY is not configured" });
    }
    // Handle OpenAI logic here...
    res.json({ message: "OpenAI endpoint ready" });
  });

  // Secure Gemini API route
  app.post("/api/gemini", express.json(), async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server" });
    }

    const { prompt, history } = req.body;

    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(apiKey);
      
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "You are CREDENTIA Cyber AI Mentor, a professional cybersecurity assistant. Provide simple yet technical explanations about password safety, phishing, data privacy, and cyber attacks. Always structure your answers with Headings, Bullet points, Step-by-step explanations, and Practical examples. Always include a disclaimer that this is for educational purposes only. Keep responses concise, professional, and helpful.",
      });

      const result = await model.generateContent({
        contents: history.concat([{ role: 'user', parts: [{ text: prompt }] }]),
      });

      const text = result.response.text();
      res.json({ text: text || "I'm sorry, I couldn't process that request." });
    } catch (error) {
      console.error("Gemini Backend Error:", error);
      res.status(500).json({ error: "Failed to process AI request" });
    }
  });

  // Breach monitoring proxy route

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
