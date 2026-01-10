import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ChatError, handleChatRequest } from './chat-handler';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await handleChatRequest(req.body);
    return res.status(200).json({ reply: result.reply });
  } catch (error) {
    console.error('Chat function error:', error);
    const status = error instanceof ChatError ? error.status : 500;
    return res.status(status).json({
      error: 'Failed to generate response',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
