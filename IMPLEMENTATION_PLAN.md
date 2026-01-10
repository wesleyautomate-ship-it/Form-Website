# Automation Implementation Plan (Resend + Supabase + Notion)

Status: On hold (copywriting phase)

## Goal
Capture form submissions, send Resend emails, store email events, and sync leads into Notion.

## Current State
- Form submit handler exists in `api/submit-form.ts`.
- Shared logic lives in `api/submit-form-handler.ts`.
- Local dev can use mock or live automation via `VITE_USE_MOCK_API`.

## Dependencies
- Supabase project with access to SQL editor
- Resend API key + verified sending domain
- Notion integration token + CRM database ID

## Data Model
Leads table (`leads`)
- id, created_at, name, email, phone, business_name, message, status, source

Email events table (`email_events`)
- id, created_at, lead_id, resend_id, email_kind, event_type, recipient, subject, payload

## Implementation Steps
1) Supabase schema
   - Create/confirm `leads`.
   - Create `email_events`.
   - Enable RLS and choose either anon insert policy or service role key.
2) Resend email sending
   - Set `RESEND_API_KEY`, `ADMIN_EMAIL`, `RESEND_FROM`.
   - Confirm sending from verified domain.
3) Resend webhook
   - Add `/api/resend-webhook` to accept events.
   - Verify signature if enabled.
   - Insert into `email_events` with `lead_id` lookup.
4) Notion CRM sync
   - Create Notion integration, share database.
   - Map fields from lead payload to database properties.
   - Insert a Notion page on each new lead.
5) QA
   - Submit a form and verify: Supabase row, admin email, client email, email events, Notion page.
6) Deployment
   - Add env vars to hosting provider.
   - Redeploy and re-test live.

## Acceptance Criteria
- Every form submission creates a Supabase lead row.
- Admin + client emails send successfully via Resend.
- Resend events are stored in `email_events`.
- Each lead appears in Notion CRM.

## On Hold Notes
- Pause all automation work until copywriting is reviewed and approved.
