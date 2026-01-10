<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/190jCagEi3ffLpxOMYyAIHQEcMSFo_10j

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create `.env.local` (see `.env.local.example` for the full list).
   - Required for the AI assistant: `GEMINI_API_KEY`
   - Required for live form automation: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `RESEND_API_KEY`
   - Optional: `ADMIN_EMAIL`, `RESEND_FROM`
   - By default the form endpoint is mocked; set `VITE_USE_MOCK_API=false` to use live email + database automation locally.
3. Run the app:
   `npm run dev`
