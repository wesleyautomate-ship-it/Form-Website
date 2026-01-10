# Lockdown Notes

Status: Paused pending copywriting updates.

## Scope Locked
- Lead capture to Supabase.
- Email send + event tracking via Resend.
- Lead sync to Notion CRM.

## Out of Scope (for now)
- UI changes, copywriting changes, new integrations.

## Secrets Handling
- Store keys only in `.env.local` or hosting env vars.
- Do not commit credentials.

## Resume Checklist
- Confirm RLS strategy (anon policy vs service role key).
- Confirm Resend webhook events list.
- Confirm Notion database property names.
