 
/**
 * Shared types and constants for the dashboard.
 * Imported by all dashboard sub-components — single source of truth.
 */

export type QuoteRow = {
  id: string;
  customer_name: string;
  contact_name: string;
  email: string | null;
  phone: string | null;
  service: string;
  quote_amount_cents: number;
  quote_sent_on: string;
  status: "open" | "won" | "lost" | "snoozed";
  last_touch_at: string | null;
  notes: string | null;
  next_follow_up_at: string | null;
  follow_up_stage: number | null;
  last_follow_up_channel: string | null;
  created_at: string;
};

export type TemplateRow = {
  id?: string;
  stage_day: number;
  name: string;
  body: string;
  created_at?: string;
  user_id?: string;
};

export type ProfileRow = {
  id?: string;
  business_name?: string | null;
  sender_name?: string | null;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  stripe_price_id?: string | null;
  stripe_current_period_end?: string | null;
};

export type Stage = {
  day: number;
  label: string;
  tone: string;
};

export const stages: Stage[] = [
  { day: 2, label: "Friendly check-in", tone: "Day 2" },
  { day: 7, label: "Value recap", tone: "Day 7" },
  { day: 14, label: "Decision nudge", tone: "Day 14" },
  { day: 30, label: "Close the loop", tone: "Day 30" },
];
