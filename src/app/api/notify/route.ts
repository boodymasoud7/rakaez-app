import { NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { sanitizeHtml } from '@/lib/sanitize';
import { updateJson } from '@/lib/content/writer';
import { generateId } from '@/lib/content/id';
import type { Inquiry } from '@/lib/content/types';

// Email & Inquiry notification API route

export async function POST(request: Request) {
  try {
    // Rate limit: 5 requests per minute per IP
    const ip = getClientIp(request);
    const { allowed, resetIn } = rateLimit(ip, 5, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Try again later.' },
        { status: 429, headers: { 'Retry-After': String(resetIn) } }
      );
    }

    const body = await request.json();
    const name = sanitizeHtml(body.name || '');
    const email = sanitizeHtml(body.email || '');
    const phone = sanitizeHtml(body.phone || '');
    const message = sanitizeHtml(body.message || '');
    const type = sanitizeHtml(body.type || 'contact');

    // Save inquiry to content/inquiries.json
    const newInquiry: Inquiry = {
      id: `inq_${generateId()}`,
      name,
      email,
      phone,
      type,
      message,
      status: 'new',
      created_at: new Date().toISOString(),
    };

    await updateJson<Inquiry[]>(
      'inquiries.json',
      (current) => [newInquiry, ...(current || [])],
      [],
      `feat: add new inquiry from ${name}`
    );

    // Log the inquiry (always works, no external service needed)
    console.log('=== NEW INQUIRY RECEIVED & SAVED ===');
    console.log(`ID: ${newInquiry.id}`);
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Phone: ${phone || 'N/A'}`);
    console.log(`Type: ${type}`);
    console.log(`Message: ${message}`);
    console.log('====================================');

    // If RESEND_API_KEY is configured, send email via Resend
    const resendKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.NOTIFY_EMAIL || 'admin@rakaez.com';
    // NOTIFY_FROM must be a verified Resend domain (or onboarding@resend.dev for testing)
    const notifyFrom = process.env.NOTIFY_FROM || 'Rakaez Website <onboarding@resend.dev>';

    if (resendKey) {
      try {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: notifyFrom,
            to: [notifyEmail],
            reply_to: email || undefined,
            subject: `New ${type} inquiry from ${name}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #1a365d; color: white; padding: 20px; text-align: center;">
                  <h1 style="margin: 0;">New Inquiry Received</h1>
                </div>
                <div style="padding: 20px; background: #f7fafc;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 10px; font-weight: bold; color: #4a5568;">Name</td><td style="padding: 10px;">${name}</td></tr>
                    <tr><td style="padding: 10px; font-weight: bold; color: #4a5568;">Email</td><td style="padding: 10px;"><a href="mailto:${email}">${email}</a></td></tr>
                    <tr><td style="padding: 10px; font-weight: bold; color: #4a5568;">Phone</td><td style="padding: 10px;">${phone || 'N/A'}</td></tr>
                    <tr><td style="padding: 10px; font-weight: bold; color: #4a5568;">Type</td><td style="padding: 10px;">${type}</td></tr>
                    <tr><td style="padding: 10px; font-weight: bold; color: #4a5568;">Message</td><td style="padding: 10px; white-space: pre-wrap;">${message}</td></tr>
                  </table>
                </div>
                <div style="padding: 15px; text-align: center; color: #a0aec0; font-size: 12px;">
                  Sent from Rakaez Website
                </div>
              </div>
            `,
          }),
        });

        if (!emailRes.ok) {
          const errText = await emailRes.text();
          console.error('Email send failed:', errText);
          return NextResponse.json(
            { error: 'Failed to send email', detail: errText },
            { status: 502 }
          );
        }
        console.log('✓ Email notification sent to:', notifyEmail);
      } catch (emailErr) {
        console.error('Email send error:', emailErr);
        return NextResponse.json(
          { error: 'Email service unreachable' },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json({ error: 'Failed to process notification' }, { status: 500 });
  }
}
