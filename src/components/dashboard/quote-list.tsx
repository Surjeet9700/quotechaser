/* eslint-disable react/no-unescaped-entities */
"use client";

import { Inbox, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { type QuoteRow } from "./types";
import { currency, dateLabel, dueDate, nextStage, statusTone } from "./utils";

function InfoTiny({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-400 dark:text-gray-500 text-[9px] uppercase tracking-wider font-bold">{label}</p>
      <p className="font-semibold text-gray-900 dark:text-gray-100 text-[11px] mt-0.5">{value}</p>
    </div>
  );
}

export function QuoteListEmpty({ onAddFirst }: { onAddFirst: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-gray-950 border border-gray-200/80 dark:border-gray-800 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.01)] dark:shadow-none min-h-[420px]">
      <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center mb-4">
        <Inbox className="w-6 h-6 text-[#F26522] dark:text-[#F26522]" />
      </div>
      <p className="text-gray-950 dark:text-gray-100 font-bold text-base tracking-tight">Add your first real quote</p>
      <p className="text-gray-400 dark:text-gray-500 text-xs mt-1 max-w-sm leading-relaxed">
        Most service businesses lose 30–40% of quotes just by not following up. Add your first quote and we'll place it in your Next-Action Queue.
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
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl min-h-[300px]">
        <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center mb-3">
          <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </div>
        <p className="text-gray-950 dark:text-gray-100 font-bold text-sm tracking-tight">No quotes match this view</p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5 leading-relaxed">Try another filter or search term.</p>
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
              "w-full bg-white dark:bg-gray-950 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.005)] dark:shadow-none",
              selectedId === quote.id 
                ? "border-[#F26522] ring-2 ring-[#F26522]/5 dark:ring-[#F26522]/10"
                : "border-gray-200/80 dark:border-gray-800"
            )}
            key={quote.id}
            onClick={() => setSelectedId(quote.id)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-bold text-gray-950 dark:text-gray-100 tracking-tight">{quote.customer_name}</p>
                <p className="text-gray-400 dark:text-gray-500 truncate text-[11px] font-semibold mt-0.5">{quote.service}</p>
              </div>
              <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold border capitalize shrink-0 shadow-sm", statusTone(quote.status))}>
                {quote.status}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] border-t border-gray-50 dark:border-gray-800/50 pt-3">
              <InfoTiny label="Amount" value={currency.format(quote.quote_amount_cents / 100)} />
              <InfoTiny label="Touch" value={nextStage(quote).tone} />
              <InfoTiny label="Due Date" value={dateLabel(dueDate(quote))} />
            </div>
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200/80 dark:border-gray-800 shadow-[0_1px_2px_rgba(0,0,0,0.005)] dark:shadow-none bg-white dark:bg-gray-950">
        <table className="min-w-full border-collapse text-[13px] text-gray-600 dark:text-gray-400">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-150 dark:border-gray-800 text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider text-left">
              <th className="px-4 py-3 h-10 font-bold">Customer</th>
              <th className="px-4 py-3 h-10 font-bold">Service</th>
              <th className="px-4 py-3 h-10 font-bold">Amount</th>
              <th className="px-4 py-3 h-10 font-bold">Next touch</th>
              <th className="px-4 py-3 h-10 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-medium">
            {quotes.map((quote) => {
              const isSelected = selectedId === quote.id;
              return (
                <tr
                  className={cn(
                    "cursor-pointer hover:bg-gray-50/40 dark:hover:bg-gray-900/40 transition-colors border-b border-gray-50 dark:border-gray-800",
                    isSelected 
                      ? "bg-[#F26522]/5 dark:bg-[#F26522]/10 text-gray-950 dark:text-gray-100 font-bold hover:bg-[#F26522]/8 dark:hover:bg-[#F26522]/20" 
                      : "text-gray-700 dark:text-gray-300"
                  )}
                  key={quote.id}
                  onClick={() => setSelectedId(quote.id)}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col">
                      <span className={cn("text-[13px] tracking-tight font-bold", isSelected ? "text-gray-950 dark:text-gray-100" : "text-gray-900 dark:text-gray-100")}>
                        {quote.customer_name}
                      </span>
                      <span className="text-gray-400 dark:text-gray-500 text-[11px] mt-0.5 font-semibold">
                        {quote.contact_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 max-w-[180px] truncate text-gray-600 dark:text-gray-400 font-semibold">{quote.service}</td>
                  <td className="px-4 py-3.5 font-bold text-gray-950 dark:text-gray-100">
                    {currency.format(quote.quote_amount_cents / 100)}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 dark:text-gray-100">{nextStage(quote).tone}</span>
                      <span className="text-gray-400 dark:text-gray-500 text-[11px] mt-0.5 font-semibold">
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
