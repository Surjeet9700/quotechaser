# MVP Research Notes

## What Changed

The first prototype looked like a dashboard, but it was not a real MVP because it used dummy data and had no account, persistence, payment path, or feedback loop.

The corrected MVP follows this standard:

- Real users only.
- Real quote records only.
- One complete workflow.
- Manual outreach and onboarding.
- Payment intent through a simple Stripe Payment Link before full billing.
- Event tracking for activation.

## Sources Checked

- YC Startup School / MVP guidance: successful MVPs are built to learn from real users quickly, not to mimic a mature product.
- Paul Graham, “Do Things That Don’t Scale”: early users are recruited manually; growth rarely starts by passively launching a website.
- Stripe docs for startups and Payment Links: validate payment with a simple hosted payment path before building full billing infrastructure.
- Supabase official docs and best-practice guidance: Supabase SSR auth, Postgres RLS, indexes on user ownership columns, and optimized RLS policies.
- Next.js official docs: use App Router, Server Actions for form mutations, and `proxy.ts` for request-level auth/cookie refresh in current Next versions.

## Build Rules

- No fake customers in the production app.
- Demo data must be explicit if added later.
- AI is optional and should improve message quality only after the core loop works.
- Automated SMS/email sending comes after users prove they will copy/send messages manually.
- Full Stripe subscriptions come after payment intent is validated.

## First Customer Test

Target users:

- Solo cleaners.
- Landscapers.
- Painters.
- Pest control operators.
- Freelancers and tiny agencies.

Outreach script:

> I’m building a tiny quote follow-up tracker for solo service businesses. It does not replace your invoicing or CRM. You add a quote, it tells you when to follow up, and gives you a clean SMS/email to copy. Can I set it up with 3 quotes you already sent and see if it saves one deal?

Pass condition:

- At least 5 users try it with real quotes.
- At least 3 copy a message.
- At least 1 pays, prepays, or agrees to a paid setup.
