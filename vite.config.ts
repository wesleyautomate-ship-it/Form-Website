import path from 'path';
import { Buffer } from 'node:buffer';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { FormError, handleSubmitForm } from './api/submit-form-handler';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  Object.assign(process.env, env);
  const useMockApi = env.VITE_USE_MOCK_API?.toLowerCase() !== 'false';

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
            if (url.pathname !== '/api/submit-form') {
              next();
              return;
            }

            if (req.method !== 'POST') {
              sendJson(res, 405, { error: 'Method not allowed' });
              return;
            }

            if (useMockApi) {
              sendJson(res, 200, {
                success: true,
                message: 'Form submitted successfully (MOCK)',
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
          });
        }
      }
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    }
  };
});
