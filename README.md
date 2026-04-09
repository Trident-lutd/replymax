# ReplyMax deploy-ready MVP

This is a simple Next.js MVP for a dating reply optimizer.

## What is included
- Landing page and working UI
- `/api/generate` endpoint for OpenAI-powered replies
- Fallback reply engine so the app still works without API keys
- `/api/create-checkout-session` route for Stripe Checkout subscriptions
- Success and cancel pages

## 1. Install
```bash
npm install
```

## 2. Configure env vars
Copy `.env.example` to `.env.local`.

```bash
cp .env.example .env.local
```

Then fill in:
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_ID`
- `NEXT_PUBLIC_APP_URL`

## 3. Run locally
```bash
npm run dev
```

Open `http://localhost:3000`.

## 4. Deploy to Vercel
- Push this folder to GitHub.
- Import the repo into Vercel.
- Add the same environment variables in Vercel project settings.
- Redeploy.

## 5. What to add next
- Stripe webhook to mark paying users in your database
- Authentication
- Rate limiting and usage tracking
- Database storage for users and message history

## Suggested production routes to add later
- `/api/stripe/webhook`
- `/api/me`
- `/api/usage`
