
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const getGeminiResponse = async (userMessage: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const modelName = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    You are the AI Assistant for FORM Creative Growth Studio.
    FORM is a boutique creative growth studio specializing in brand identity, strategic positioning, and digital commerce for wellness and lifestyle brands.
    Our founder is Tamyra Simpson.
    We value: Aesthetic Excellence, Strategic Clarity, Community-Led Growth, Feminine Leadership, High-Vibration Design, and Intention over Volume.
    
    Our services include:
    1. Brand Identity & Digital Foundations (Identity kits start at $1,500).
    2. Community & Conversion Systems (Email flows, UGC integration, Events).
    3. Brand Strategy & Growth Planning (Audits, customer journey mapping).
    
    Tone: Professional, elegant, warm, and highly strategic. Use high-vibration language.
    Goal: Help users understand our services and encourage them to book a consultation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });
    return response.text || "I'm sorry, I couldn't process that request right now. How else can I help you with your brand?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm experiencing a bit of a technical glitch. Feel free to contact us directly at hello@reallygreatsite.com!";
  }
};
