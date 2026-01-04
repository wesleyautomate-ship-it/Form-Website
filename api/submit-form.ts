import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const resendKey = process.env.RESEND_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials missing from environment');
}

if (!resendKey) {
  console.warn('Resend API key missing from environment');
}

const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// Initialize Resend client
const resend = resendKey ? new Resend(resendKey) : null;
const adminEmail = process.env.ADMIN_EMAIL || 'formconverts@gmail.com';

interface FormData {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  message: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, businessName, message } = req.body as FormData;

    // Validate required fields
    if (!name || !email || !phone || !businessName || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Save to Supabase
    let leadId = 'mock-id';
    if (supabase) {
      const { data: lead, error: dbError } = await supabase
        .from('leads')
        .insert([
          {
            name,
            email,
            phone,
            business_name: businessName,
            message,
            status: 'new',
            source: 'website',
          },
        ])
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save lead to database');
      }
      leadId = lead.id;
    }

    // Send admin notification email
    if (resend) {
      await resend.emails.send({
        from: 'FORM Creative <onboarding@resend.dev>',
        to: adminEmail,
        subject: `🔥 New Lead: ${name} (${businessName})`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a0000;">New Lead Submission</h2>
          <p>You have a new inquiry from your website!</p>
          
          <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Business Name:</strong> ${businessName}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Message</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 12px;">View in Supabase Dashbord</p>
          </div>
        </div>
      `,
      });

      // Send auto-response to client
      await resend.emails.send({
        from: 'FORM Creative <onboarding@resend.dev>',
        to: email,
        subject: 'Thank you for your inquiry',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a0000;">Inquiry Received</h2>
          <p>Hi ${name},</p>
          
          <p>Thank you for reaching out to FORM Creative Growth Studio regarding <strong>${businessName}</strong>.</p>
          
          <p>We've received your inquiry and our team will review the details. We typically respond within 24 hours to the phone number (${phone}) or email provided to discuss how we can help elevate your brand.</p>

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

    }


    return res.status(200).json({
      success: true,
      message: 'Form submitted successfully',
      leadId: leadId,
    });
  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({
      error: 'Failed to process form submission',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
