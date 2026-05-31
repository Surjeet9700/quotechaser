/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Pure utility functions for the dashboard.
 * No React imports — these are plain functions that can be unit-tested in isolation.
 */

import { stages, type QuoteRow, type Stage } from "./types";

export const currency = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 0,
  style: "currency",
});

export function todayDate(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export function addDays(value: string, days: number): Date {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date;
}

export function nextStage(quote: QuoteRow): Stage {
  return stages.find((s) => s.day === quote.follow_up_stage) ?? stages[stages.length - 1];
}

export function dueDate(quote: QuoteRow): Date {
  return quote.next_follow_up_at ? new Date(quote.next_follow_up_at) : addDays(quote.quote_sent_on, nextStage(quote).day);
}

export function isDue(quote: QuoteRow): boolean {
  if (quote.status !== "open" && quote.status !== "snoozed") return false;
  if (!quote.next_follow_up_at) return false;
  return new Date(quote.next_follow_up_at) <= todayDate();
}

export function dateLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

export function parseTemplate(body: string, quote: QuoteRow, profile: any): string {
  const customerName = quote.contact_name.split(" ")[0] || "there";
  
  return body
    .replace(/\{\{customer_name\}\}/g, customerName)
    .replace(/\{\{service\}\}/g, quote.service.toLowerCase())
    .replace(/\{\{sender_name\}\}/g, profile?.sender_name || "[Your Name]")
    .replace(/\{\{business_name\}\}/g, profile?.business_name || "[Business Name]")
    .replace(/\{\{amount\}\}/g, currency.format(quote.quote_amount_cents / 100));
}

export function buildSms(quote: QuoteRow): string {
  const firstName = quote.contact_name.split(" ")[0] || "there";
  return `Hi ${firstName}, quick follow-up on the ${quote.service.toLowerCase()} quote. Any questions I can answer?`;
}

export function statusTone(status: QuoteRow["status"]): string {
  if (status === "won") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "lost") return "border-zinc-200 bg-zinc-50 text-zinc-600";
  if (status === "snoozed") return "border-blue-200 bg-blue-50 text-blue-700";
  return "border-amber-200 bg-amber-50 text-amber-700";
}
