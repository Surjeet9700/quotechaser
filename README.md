# QuoteChaser

QuoteChaser is a narrow MVP for solo service businesses that lose revenue by not following up on quotes.

The product intentionally starts empty. There is no seeded customer data in the app. A user must sign in, add a real quote, copy a follow-up message, and mark the outcome.

## Current MVP

- Magic-link auth through Supabase.
- User-owned quotes stored in Postgres.
- Row Level Security for quote and event data.
- Follow-up queue based on quote sent date.
- Day 2, Day 7, Day 14, and Day 30 stages.
- Copy email/SMS message actions.
- Mark quote won, lost, or snoozed.
- Activation events for quote creation and message copy.
- Optional Stripe Payment Link via `NEXT_PUBLIC_STRIPE_PAYMENT_LINK`.

## Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env.local`.
4. Set:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=
```

5. Run:

```bash
npm install
npm run dev
```

## Validation Loop

The first real success metric is not page views. It is:

1. User signs in.
2. User adds one real quote.
3. User copies one follow-up message.
4. User marks a quote won, lost, or snoozed.

Do not add AI, automated SMS, CRM integrations, dashboards, or team features until at least a few real users complete that loop.

## Research Basis

- YC MVP guidance: launch quickly, get initial customers, talk to users, iterate.
- Paul Graham, “Do Things That Don’t Scale”: manually recruit early users.
- Stripe startup/payment guidance: use the simplest payment path first.
- Supabase guidance: use RLS, indexed ownership columns, and server-side auth helpers.
