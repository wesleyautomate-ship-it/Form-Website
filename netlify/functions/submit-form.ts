import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY!);
const adminEmail = process.env.ADMIN_EMAIL || 'formconvert@gmail.com';

interface FormData {
    name: string;
    email: string;
    message: string;
}

export const handler: Handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        // Parse form data
        const formData: FormData = JSON.parse(event.body || '{}');
        const { name, email, message } = formData;

        // Validate required fields
        if (!name || !email || !message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' }),
            };
        }

        // Save to Supabase
        const { data: lead, error: dbError } = await supabase
            .from('leads')
            .insert([
                {
                    name,
                    email,
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

        // Send admin notification email
        const adminEmailResult = await resend.emails.send({
            from: 'FORM Creative <onboarding@resend.dev>',
            to: adminEmail,
            subject: `🔥 New Lead: ${name}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a0000;">New Lead Submission</h2>
          <p>You have a new inquiry from your website!</p>
          
          <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Message</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 12px;">View in Supabase: <a href="${supabaseUrl}">Dashboard</a></p>
          </div>
        </div>
      `,
        });

        // Send auto-response to client
        const clientEmailResult = await resend.emails.send({
            from: 'FORM Creative <onboarding@resend.dev>',
            to: email,
            subject: 'Thank you for your inquiry',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a0000;">Inquiry Received</h2>
          <p>Hi ${name},</p>
          
          <p>Thank you for reaching out to FORM Creative Growth Studio.</p>
          
          <p>We've received your inquiry and our team will review the details. We typically respond within 24 hours to discuss how we can help elevate your brand.</p>

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

        console.log('Emails sent:', { adminEmailResult, clientEmailResult });

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Form submitted successfully',
                leadId: lead.id,
            }),
        };
    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to process form submission',
                details: error instanceof Error ? error.message : 'Unknown error',
            }),
        };
    }
};
