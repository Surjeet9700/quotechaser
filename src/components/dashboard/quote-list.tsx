"use client";

import { Search, Check, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { type QuoteRow } from "./types";
import { currency, dateLabel, dueDate, nextStage, statusTone } from "./utils";

export function QuoteList({
  quotes,
  selectedId,
  setSelectedId,
  updateStatus,
}: {
  quotes: QuoteRow[];
  selectedId: string;
  setSelectedId: (id: string) => void;
  updateStatus?: (id: string, status: QuoteRow["status"]) => void;
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
              "w-full bg-background hover:bg-muted/50 rounded-md border text-left transition-all duration-200 cursor-pointer flex flex-col gap-2 p-3",
              selectedId === quote.id 
                ? "border-foreground"
                : "border-border"
            )}
            key={quote.id}
            onClick={() => setSelectedId(quote.id)}
          >
            <div className="flex items-start justify-between gap-3 w-full">
              <div className="min-w-0 flex flex-col">
                <span className="truncate text-[13px] font-semibold text-foreground">{quote.customer_name}</span>
                <span className="text-muted-foreground truncate text-[12px] mt-0.5">{quote.service}</span>
              </div>
              <span className="text-[13px] font-medium text-foreground">{currency.format(quote.quote_amount_cents / 100)}</span>
            </div>
            <div className="flex items-center justify-between w-full mt-1">
              <span className="text-muted-foreground text-[12px]">{dateLabel(dueDate(quote))}</span>
              <div className="flex items-center gap-2">
                {updateStatus && (
                  <div className="flex items-center gap-1 opacity-80">
                    <button onClick={(e) => { e.stopPropagation(); updateStatus(quote.id, "won"); }} className="p-1 hover:bg-muted-foreground/20 rounded-md text-foreground transition-colors" title="Mark Won"><Check className="w-3.5 h-3.5" /></button>
                    <button onClick={(e) => { e.stopPropagation(); updateStatus(quote.id, "lost"); }} className="p-1 hover:bg-muted-foreground/20 rounded-md text-foreground transition-colors" title="Mark Lost"><X className="w-3.5 h-3.5" /></button>
                    <button onClick={(e) => { e.stopPropagation(); updateStatus(quote.id, "snoozed"); }} className="p-1 hover:bg-muted-foreground/20 rounded-md text-foreground transition-colors" title="Snooze"><Clock className="w-3.5 h-3.5" /></button>
                  </div>
                )}
                <span className={cn("inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border capitalize", statusTone(quote.status))}>
                  {quote.status}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-md border border-border bg-background">
        <table className="min-w-full border-collapse text-[13px] text-muted-foreground">
          <thead>
            <tr className="border-b border-border text-[11px] font-medium text-muted-foreground text-left">
              <th className="px-3 py-2 font-medium">Customer</th>
              <th className="px-3 py-2 font-medium">Service</th>
              <th className="px-3 py-2 font-medium">Amount</th>
              <th className="px-3 py-2 font-medium">Next touch</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {quotes.map((quote) => {
              const isSelected = selectedId === quote.id;
              return (
                <tr
                  className={cn(
                    "cursor-pointer transition-colors relative group",
                    isSelected 
                      ? "bg-muted text-foreground" 
                      : "text-muted-foreground hover:bg-muted/50"
                  )}
                  key={quote.id}
                  onClick={() => setSelectedId(quote.id)}
                >
                  <td className="px-3 py-2">
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-foreground" />
                    )}
                    <div className="flex flex-col">
                      <span className={cn("text-[13px] font-medium", isSelected ? "text-foreground" : "text-foreground")}>
                        {quote.customer_name}
                      </span>
                      <span className="text-muted-foreground text-[12px]">
                        {quote.contact_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 max-w-[180px] truncate">{quote.service}</td>
                  <td className="px-3 py-2 font-medium text-foreground">
                    {currency.format(quote.quote_amount_cents / 100)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{nextStage(quote).tone}</span>
                      <span className="text-muted-foreground text-[12px]">
                        {dateLabel(dueDate(quote))}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border capitalize", statusTone(quote.status))}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    {updateStatus && (
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button onClick={(e) => { e.stopPropagation(); updateStatus(quote.id, "won"); }} className="p-1.5 hover:bg-muted-foreground/20 rounded-md text-foreground transition-colors" title="Mark Won"><Check className="w-3.5 h-3.5" /></button>
                        <button onClick={(e) => { e.stopPropagation(); updateStatus(quote.id, "lost"); }} className="p-1.5 hover:bg-muted-foreground/20 rounded-md text-foreground transition-colors" title="Mark Lost"><X className="w-3.5 h-3.5" /></button>
                        <button onClick={(e) => { e.stopPropagation(); updateStatus(quote.id, "snoozed"); }} className="p-1.5 hover:bg-muted-foreground/20 rounded-md text-foreground transition-colors" title="Snooze"><Clock className="w-3.5 h-3.5" /></button>
                      </div>
                    )}
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
