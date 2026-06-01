"use client";

import { Inbox, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { type QuoteRow } from "./types";
import { currency, dateLabel, dueDate, nextStage, statusTone } from "./utils";

function InfoTiny({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground text-[9px] uppercase tracking-wider font-bold">{label}</p>
      <p className="font-semibold text-foreground text-[11px] mt-0.5">{value}</p>
    </div>
  );
}

export function QuoteListEmpty({ onAddFirst }: { onAddFirst: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-border rounded-2xl inset-shadow-sm min-h-[420px]">
      <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center mb-4">
        <Inbox className="w-6 h-6 text-brand" />
      </div>
      <p className="text-foreground font-bold text-base tracking-tight">Create your first quote</p>
      <p className="text-muted-foreground text-xs mt-1 max-w-sm leading-relaxed">
        Track your proposals and automate follow-ups to close more deals.
      </p>
      <button
        onClick={onAddFirst}
        className="mt-6 rounded-full bg-[#F26522] hover:bg-[#e05a1a] hover:scale-[1.02] active:scale-[0.98] text-white font-bold text-[12px] uppercase tracking-wider px-5 h-9 border-none shadow-sm transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
      >
        <PlusIcon className="w-3.5 h-3.5" />
        <span>Add first quote</span>
      </button>
    </div>
  );
}

function PlusIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

export function QuoteList({
  quotes,
  selectedId,
  setSelectedId,
}: {
  quotes: QuoteRow[];
  selectedId: string;
  setSelectedId: (id: string) => void;
}) {
  if (quotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-border rounded-2xl min-h-[300px]">
        <div className="w-10 h-10 rounded-2xl bg-background border border-border flex items-center justify-center mb-3">
          <Search className="w-5 h-5 text-muted-foreground" />
        </div>
        <p className="text-foreground font-bold text-sm tracking-tight">No quotes match this view</p>
        <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">Try another filter or search term.</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile card list */}
      <div className="flex flex-col gap-2 md:hidden">
        {quotes.map((quote) => (
          <button
            className={cn(
              "w-full bg-card hover:bg-muted/50 rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer inset-shadow-sm",
              selectedId === quote.id 
                ? "border-brand ring-2 ring-brand/10"
                : "border-border"
            )}
            key={quote.id}
            onClick={() => setSelectedId(quote.id)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-bold text-foreground tracking-tight">{quote.customer_name}</p>
                <p className="text-muted-foreground truncate text-[11px] font-semibold mt-0.5">{quote.service}</p>
              </div>
              <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold border capitalize shrink-0 shadow-sm", statusTone(quote.status))}>
                {quote.status}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] border-t border-border pt-3">
              <InfoTiny label="Amount" value={currency.format(quote.quote_amount_cents / 100)} />
              <InfoTiny label="Touch" value={nextStage(quote).tone} />
              <InfoTiny label="Due Date" value={dateLabel(dueDate(quote))} />
            </div>
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border inset-shadow-sm bg-card">
        <table className="min-w-full border-collapse text-[13px] text-muted-foreground">
          <thead>
            <tr className="bg-muted/40 border-b border-border text-[10px] uppercase font-bold text-muted-foreground tracking-wider text-left">
              <th className="px-4 py-3 h-10 font-bold">Customer</th>
              <th className="px-4 py-3 h-10 font-bold">Service</th>
              <th className="px-4 py-3 h-10 font-bold">Amount</th>
              <th className="px-4 py-3 h-10 font-bold">Next touch</th>
              <th className="px-4 py-3 h-10 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-medium">
            {quotes.map((quote) => {
              const isSelected = selectedId === quote.id;
              return (
                <tr
                  className={cn(
                    "cursor-pointer hover:bg-muted/50 transition-colors border-b border-border",
                    isSelected 
                      ? "bg-brand/10 text-foreground font-bold hover:bg-brand/15" 
                      : "text-muted-foreground"
                  )}
                  key={quote.id}
                  onClick={() => setSelectedId(quote.id)}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col">
                      <span className={cn("text-[13px] tracking-tight font-bold", isSelected ? "text-foreground" : "text-foreground")}>
                        {quote.customer_name}
                      </span>
                      <span className="text-muted-foreground text-[11px] mt-0.5 font-semibold">
                        {quote.contact_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 max-w-[180px] truncate text-muted-foreground font-semibold">{quote.service}</td>
                  <td className="px-4 py-3.5 font-bold text-foreground">
                    {currency.format(quote.quote_amount_cents / 100)}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{nextStage(quote).tone}</span>
                      <span className="text-muted-foreground text-[11px] mt-0.5 font-semibold">
                        {dateLabel(dueDate(quote))}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold border capitalize shadow-sm", statusTone(quote.status))}>
                      {quote.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
