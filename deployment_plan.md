# Deployment Plan & External Service Integration

This plan details how to manage environment variables and connect to external services (Supabase & Resend) for a production deployment on **Vercel**.

## 1. Environment Variable Management

In a production environment, you should **never** upload your `.env` file. Instead, follow these steps to securely configure your secrets on Vercel:

### Vercel Configuration
1.  Go to your **Vercel Dashboard**.
2.  Select your project: `Tamyra Form Website`.
3.  Go to **Settings** > **Environment Variables**.
4.  Add the following keys and values:

| Key | Example Value | Notes |
| :--- | :--- | :--- |
| `SUPABASE_URL` | `https://xyz...supabase.co` | Found in Supabase > Settings > API |
| `SUPABASE_ANON_KEY` | `eyJ...` | Found in Supabase > Settings > API |
| `RESEND_API_KEY` | `re_...` | Found in [Resend > API Keys](https://resend.com/api-keys) |
| `ADMIN_EMAIL` | `formconverts@gmail.com` | Where you want notifications sent |

> [!IMPORTANT]
> After adding these, you must **Redeploy** the project for the changes to take effect.

---

## 2. Supabase Integration (Leads Database)

To ensure the form can save submissions, your database must be ready:

1.  **Open Supabase SQL Editor**.
2.  **Paste and Run** this script to create the `leads` table:
    ```sql
    create table leads (
      id uuid default gen_random_uuid() primary key,
      created_at timestamptz default now(),
      name text not null,
      email text not null,
      message text not null,
      status text default 'new',
      source text default 'website'
    );
    ```
3.  **Check Permissions**: By using the `SUPABASE_ANON_KEY`, the serverless function can securely write to this table if you have RLS (Row Level Security) enabled and configured with a "Service Role" or public insert policy. For easiest setup, ensure "Insert" is allowed for anon roles or use the `SUPABASE_SERVICE_ROLE_KEY` if you need to bypass RLS.

---

## 3. Resend Integration (Email Automation)

To send emails live without being flagged as spam:

1.  **Verify your Domain**:
    - Go to [Resend > Domains](https://resend.com/domains).
    - Add your domain (e.g., `tamyraform.com`).
    - Update your DNS settings with the records provided by Resend.
2.  **Update "From" Address**:
    - Once verified, update the `from` field in `api/submit-form.ts`.
    - Change `onboarding@resend.dev` to `hello@tamyraform.com` (or your chosen prefix).
3.  **Auto-Responses**: The current code automatically sends a "Thank You" email to the client and a "New Lead" notification to you.

---

## 4. Final Deployment Steps

1.  **Push to GitHub**: (COMPLETED) All latest fixes are now on the `main` branch.
2.  **Vercel Deployment**: Link your GitHub repository to a new project in Vercel.
3.  **Check Build Logs**: Ensure the Vercel build succeeds.
4.  **Test Live**: Navigate to your live URL and submit the inquiry form.
