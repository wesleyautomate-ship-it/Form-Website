import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export interface FormData {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  message: string;
}

export interface SubmitResult {
  leadId: string;
}

export class FormError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

const getEnvConfig = () => {
  return {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_ANON_KEY,
    resendKey: process.env.RESEND_API_KEY,
    adminEmail: process.env.ADMIN_EMAIL || 'formconverts@gmail.com',
    emailFrom: process.env.RESEND_FROM || 'FORM Creative <onboarding@resend.dev>',
  };
};

const assertRequired = (value: string | undefined, label: string) => {
  if (!value) {
    throw new FormError(`${label} is missing from the server environment.`, 500);
  }
};

const sanitizeFormData = (data: FormData) => ({
  name: data.name?.trim(),
  email: data.email?.trim(),
  phone: data.phone?.trim(),
  businessName: data.businessName?.trim(),
  message: data.message?.trim(),
});

const normalizePayload = (payload: unknown): FormData => {
  if (typeof payload === 'string') {
    try {
      return JSON.parse(payload) as FormData;
    } catch (error) {
      throw new FormError('Invalid JSON payload', 400);
    }
  }

  if (!payload || typeof payload !== 'object') {
    throw new FormError('Invalid form payload', 400);
  }

  return payload as FormData;
};

export const handleSubmitForm = async (payload: unknown): Promise<SubmitResult> => {
  const formData = sanitizeFormData(normalizePayload(payload));

  if (!formData.name || !formData.email || !formData.phone || !formData.businessName || !formData.message) {
    throw new FormError('Missing required fields', 400);
  }

  const { supabaseUrl, supabaseKey, resendKey, adminEmail, emailFrom } = getEnvConfig();

  assertRequired(supabaseUrl, 'SUPABASE_URL');
  assertRequired(supabaseKey, 'SUPABASE_ANON_KEY');
  assertRequired(resendKey, 'RESEND_API_KEY');

  const supabase = createClient(supabaseUrl, supabaseKey);
  const resend = new Resend(resendKey);

  const { data: lead, error: dbError } = await supabase
    .from('leads')
    .insert([
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        business_name: formData.businessName,
        message: formData.message,
        status: 'new',
        source: 'website',
      },
    ])
    .select()
    .single();

  if (dbError) {
    console.error('Database error:', dbError);
    throw new FormError('Failed to save lead to database', 500);
  }

  const adminSend = await resend.emails.send({
    from: emailFrom,
    to: adminEmail,
    subject: `New Lead: ${formData.name} (${formData.businessName})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4a0000;">New Lead Submission</h2>
        <p>You have a new inquiry from your website!</p>
        
        <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Contact Details</h3>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
          <p><strong>Phone:</strong> ${formData.phone}</p>
          <p><strong>Business Name:</strong> ${formData.businessName}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Message</h3>
          <p style="white-space: pre-wrap;">${formData.message}</p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">View in Supabase Dashboard</p>
        </div>
      </div>
    `,
  });

  if (adminSend.error) {
    console.error('Resend admin email error:', adminSend.error);
    throw new FormError('Failed to send admin notification email', 502);
  }

  const clientSend = await resend.emails.send({
    from: emailFrom,
    to: formData.email,
    subject: 'Thank you for your inquiry',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4a0000;">Inquiry Received</h2>
        <p>Hi ${formData.name},</p>
        
        <p>Thank you for reaching out to FORM Creative Growth Studio regarding <strong>${formData.businessName}</strong>.</p>
        
        <p>We've received your inquiry and our team will review the details. We typically respond within 24 hours to the phone number (${formData.phone}) or email provided to discuss how we can help elevate your brand.</p>

        <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin: 30px 0;">
          <h3 style="margin-top: 0;">What happens next?</h3>
          <ol style="line-height: 1.8;">
            <li>Our team reviews your vision and requirements</li>
            <li>We'll reach out within 24 hours for an initial consultation</li>
            <li>Together, we'll determine if we're the right fit for your brand</li>
          </ol>
        </div>

        <p>In the meantime, feel free to explore our work and philosophy on our website.</p>

        <p style="margin-top: 30px;">
          <strong>The FORM Team</strong><br>
          <span style="font-style: italic; color: #666;">Aesthetic Precision & Strategic Prescience</span>
        </p>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #999; font-size: 11px;">
            This is an automated response confirming receipt of your inquiry.<br>
            If you have urgent questions, please reply to this email.
          </p>
        </div>
      </div>
    `,
  });

  if (clientSend.error) {
    console.error('Resend client email error:', clientSend.error);
    throw new FormError('Failed to send confirmation email', 502);
  }

  return {
    leadId: lead.id,
  };
};
