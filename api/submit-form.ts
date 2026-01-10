import type { VercelRequest, VercelResponse } from '@vercel/node';
import { FormError, handleSubmitForm } from './submit-form-handler';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await handleSubmitForm(req.body);

    return res.status(200).json({
      success: true,
      message: 'Form submitted successfully',
      leadId: result.leadId,
    });
  } catch (error) {
    console.error('Function error:', error);
    const status = error instanceof FormError ? error.status : 500;
    return res.status(status).json({
      error: 'Failed to process form submission',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
