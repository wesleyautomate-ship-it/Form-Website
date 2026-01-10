import path from 'path';
import { Buffer } from 'node:buffer';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { ChatError, handleChatRequest } from './api/chat-handler';
import { FormError, handleSubmitForm } from './api/submit-form-handler';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  Object.assign(process.env, env);
  const useMockApi = env.VITE_USE_MOCK_API?.toLowerCase() !== 'false';
  const geminiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY || '';

  const sendJson = (res: ServerResponse, status: number, body: unknown) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(body));
  };

  const readJsonBody = async (req: IncomingMessage) => {
    const chunks: Uint8Array[] = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }

    const rawBody = Buffer.concat(chunks).toString('utf8').trim();
    if (!rawBody) {
      return null;
    }

    try {
      return JSON.parse(rawBody);
    } catch (error) {
      throw new Error('Invalid JSON body');
    }
  };

  return {
    server: {
      port: 5173,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      {
        name: 'dev-api',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (!req.url) {
              next();
              return;
            }

            const url = new URL(req.url, 'http://localhost');
            const isSubmitForm = url.pathname === '/api/submit-form';
            const isChat = url.pathname === '/api/chat';

            if (!isSubmitForm && !isChat) {
              next();
              return;
            }

            if (req.method !== 'POST') {
              sendJson(res, 405, { error: 'Method not allowed' });
              return;
            }

            if (useMockApi) {
              if (isSubmitForm) {
                sendJson(res, 200, {
                  success: true,
                  message: 'Form submitted successfully (MOCK)',
                });
                return;
              }

              sendJson(res, 200, {
                reply: "Thanks for reaching out. FORM's team will follow up shortly.",
              });
              return;
            }

            let body: unknown;
            try {
              body = await readJsonBody(req);
            } catch (error) {
              sendJson(res, 400, { error: 'Invalid JSON body' });
              return;
            }

            if (isSubmitForm) {
              try {
                const result = await handleSubmitForm(body);
                sendJson(res, 200, {
                  success: true,
                  message: 'Form submitted successfully',
                  leadId: result.leadId,
                });
              } catch (error) {
                const status = error instanceof FormError ? error.status : 500;
                sendJson(res, status, {
                  error: 'Failed to process form submission',
                  details: error instanceof Error ? error.message : 'Unknown error',
                });
              }
              return;
            }

            try {
              const result = await handleChatRequest(body);
              sendJson(res, 200, {
                reply: result.reply,
              });
            } catch (error) {
              const status = error instanceof ChatError ? error.status : 500;
              sendJson(res, status, {
                error: 'Failed to generate response',
                details: error instanceof Error ? error.message : 'Unknown error',
              });
            }
          });
        }
      }
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(geminiKey),
      'process.env.GEMINI_API_KEY': JSON.stringify(geminiKey)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    }
  };
});
