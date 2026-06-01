# Project Structure

## Overview

QuoteChaser — a Next.js 16 web app for tracking business quotes and automating email/SMS follow-ups. Users sign in, add quotes they have sent, and the app schedules a 2/7/14/30-day follow-up cadence. The active quote list, customer details, and suggested follow-up copy are managed from a single dashboard. Upgrades are handled via Stripe.

---

## Routes

App-router segments under `src/app/`:

- `(auth)/login` — email/password sign-in (Supabase Auth)
- `(dashboard)/dashboard` — main workspace (active pipeline, metric cards, quote detail modal)
- `(dashboard)/quotes` — full quote management
- `(dashboard)/templates` — follow-up email templates per stage
- `(dashboard)/settings` — sender profile, business info, theme
- `(marketing)/` — landing page
- `(marketing)/terms`, `(marketing)/privacy` — legal pages
- `quote/[id]` — public quote link (used by the "Copy Link" action)
- `api/` — server endpoints (events tracking, etc.)
- `actions.ts` — Next.js server actions (quotes, status updates, email send, follow-up log)

## Components

- `src/components/auth/` — `login-form`, `login-background`
- `src/components/dashboard/`
  - `index.tsx` — main `Dashboard` component, state container
  - `metric-cards.tsx` — 4 KPI tiles
  - `quote-list.tsx` — pipeline list (mobile cards + desktop table), in-row status actions
  - `quote-detail.tsx` — modal contents: copy, follow-up log, action buttons
  - `add-quote-sheet.tsx`, `edit-quote-sheet.tsx` — form sheets
  - `csv-mapper.tsx` — bulk import with column mapping
  - `sidebar-nav.tsx`, `mobile-nav.tsx` — navigation
  - `stripe-button.tsx`, `feedback-widget.tsx`
- `src/components/marketing/`
  - `landing-client.tsx`, `sections/{hero,features,about,pricing,cta,site-footer}.tsx`, `ui/roll-text.tsx`
- `src/components/ui/` — shadcn primitives (button, sheet, dialog, card, table, select, input, etc.)
- `src/components/theme-provider.tsx`, `theme-toggle.tsx`

## Lib

- `src/lib/supabase/{client,server,admin,proxy}.ts` — Supabase clients (browser, server, service-role, proxy refresh)
- `src/lib/email.ts` — Resend wrapper for outbound follow-up email
- `src/lib/schemas.ts` — Zod schemas
- `src/lib/utils.ts` — `cn` and other helpers

## Scripts

- `src/scripts/` — Supabase schema apply, type generation
- `supabase/` — SQL migrations and config

## Styling

- Tailwind CSS 4 with PostCSS
- Theme tokens: `bg-background`, `bg-foreground`, `bg-muted`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-brand` (orange)
- Components use `rounded-md`, `h-8`/`h-9` controls, and `font-medium` by default
- Dark mode via `next-themes`

## Key Conventions

- All dashboard components are `"use client"`
- Server actions live in `src/app/actions.ts`; components import named exports
- QuoteRow / TemplateRow / ProfileRow types are declared in `src/components/dashboard/types.ts`
- UI primitives from shadcn (`@/components/ui/*`) and `@base-ui/react` (Select)
- State management is local React state + `useTransition` for server actions; no global store
