/// <reference types="vite/client" />

export const getCyberResponse = async (prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, history }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to get response from AI");
    }

    const data = await response.json();
    return data.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini Proxy Error:", error);
    return "Connection error. Please check your network or contact support.";
  }
};
