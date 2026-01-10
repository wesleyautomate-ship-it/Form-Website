import { GoogleGenAI } from '@google/genai';

export interface ChatPayload {
  message: string;
}

export interface ChatResult {
  reply: string;
}

export class ChatError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

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

const normalizePayload = (payload: unknown): ChatPayload => {
  if (typeof payload === 'string') {
    try {
      return JSON.parse(payload) as ChatPayload;
    } catch (error) {
      throw new ChatError('Invalid JSON payload', 400);
    }
  }

  if (!payload || typeof payload !== 'object') {
    throw new ChatError('Invalid chat payload', 400);
  }

  return payload as ChatPayload;
};

const resolveApiKey = () => {
  return process.env.GEMINI_API_KEY || process.env.API_KEY || '';
};

export const handleChatRequest = async (payload: unknown): Promise<ChatResult> => {
  const { message } = normalizePayload(payload);
  const trimmedMessage = message?.trim();

  if (!trimmedMessage) {
    throw new ChatError('Message is required', 400);
  }

  const apiKey = resolveApiKey();
  if (!apiKey) {
    throw new ChatError('GEMINI_API_KEY is missing from the server environment.', 500);
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelName = process.env.GEMINI_MODEL || 'gemini-3-flash-preview';

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: trimmedMessage,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return {
      reply: response.text || "I'm sorry, I couldn't process that request right now. How else can I help you with your brand?",
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new ChatError('Failed to generate response', 502);
  }
};
