"use client";

import { Check, Clock3, Copy, Mail, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { type QuoteRow, type TemplateRow, type ProfileRow } from "./types";
import { buildSms, currency, nextStage, parseTemplate, statusTone } from "./utils";
import { EditQuoteSheet } from "./edit-quote-sheet";

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border border-gray-200/50 dark:border-gray-800/50 p-3 transition-colors">
      <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider">{label}</p>
      <p className="mt-1 truncate text-[13px] font-semibold text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  );
}

export function QuoteDetail({
  copied,
  copyMessage,
  sendEmail,
  isPending,
  quote,
  removeQuote,
  updateStatus,
  templates,
  profile,
  userEmail,
  logFollowUp,
}: {
  copied: "email" | "sms" | "link" | null;
  copyMessage: (kind: "email" | "sms" | "link", text: string, quoteId: string) => Promise<void>;
  sendEmail: (email: string, subject: string, body: string, quoteId: string) => Promise<void>;
  isPending: boolean;
  quote: QuoteRow;
  removeQuote: (id: string) => Promise<void>;
  updateStatus: (id: string, status: QuoteRow["status"]) => Promise<void>;
  templates: TemplateRow[];
  profile: ProfileRow | null;
  userEmail?: string;
  logFollowUp?: (id: string, channel: string, currentStage: number, quoteSentOn: string) => Promise<void>;
}) {
  const stage = nextStage(quote);
  
  // Find the custom template for this stage, or fallback to an empty string to avoid crashes
  const template = templates.find((t) => t.stage_day === stage.day);
  const emailBody = template ? parseTemplate(template.body, quote, profile) : "No template found for this stage.";
  const smsBody = buildSms(quote);

  return (
    <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-[0_1px_2px_rgba(0,0,0,0.01)] dark:shadow-none p-6 sm:p-8 space-y-6 min-w-0 transition-colors">
      
      {/* Header section with customer name, service type, edit triggers and status */}
      <div className="flex justify-between items-start gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-gray-950 dark:text-gray-50 tracking-tight truncate">
            {quote.customer_name}
          </h2>
          <p className="text-gray-400 dark:text-gray-500 text-xs font-medium mt-0.5 truncate">
            {quote.service}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <EditQuoteSheet quote={quote} />
          <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize shadow-sm", statusTone(quote.status))}>
            {quote.status}
          </span>
        </div>
      </div>

      {/* Quote Details Grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <InfoBlock label="Quote Amount" value={currency.format(quote.quote_amount_cents / 100)} />
        <InfoBlock label="Next Follow Up" value={quote.next_follow_up_at ? new Date(quote.next_follow_up_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : "None"} />
        <InfoBlock label="Client Email" value={quote.email || "Missing"} />
        <InfoBlock label="Client Phone" value={quote.phone || "Missing"} />
      </div>

      {/* Suggested Outreach Message Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-[12px] font-bold text-gray-950 dark:text-gray-100 uppercase tracking-wider">
            Suggested Follow-up
          </h4>
          <span className="text-[10px] font-bold text-[#F26522] dark:text-[#ff7836] bg-[#F26522]/5 dark:bg-[#F26522]/10 px-2.5 py-0.5 rounded-full border border-[#F26522]/10 dark:border-[#F26522]/20 uppercase tracking-wider shrink-0">
            {stage.label}
          </span>
        </div>

        {/* Beautiful document-style mock email card preview */}
        <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 shadow-[0_1px_3px_rgba(0,0,0,0.015)] dark:shadow-none p-5 space-y-4 transition-colors">
          
          {/* Mock headers */}
          <div className="text-[11px] space-y-2 border-b border-gray-100 dark:border-gray-800 pb-3">
            <div className="flex">
              <span className="text-gray-400 dark:text-gray-500 font-semibold w-14 shrink-0">From:</span>
              <span className="text-gray-700 dark:text-gray-300 font-semibold truncate">
                {profile?.sender_name || "Your Name"}{" "}
                <span className="text-gray-400 dark:text-gray-500 font-normal">&lt;{userEmail || "you@business.com"}&gt;</span>
              </span>
            </div>
            <div className="flex">
              <span className="text-gray-400 dark:text-gray-500 font-semibold w-14 shrink-0">To:</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium truncate">
                {quote.contact_name}{" "}
                {quote.email ? <span className="text-gray-400 dark:text-gray-500 font-normal">&lt;{quote.email}&gt;</span> : <span className="text-amber-500 dark:text-amber-400 italic font-semibold">(No email configured)</span>}
              </span>
            </div>
            <div className="flex">
              <span className="text-gray-400 dark:text-gray-500 font-semibold w-14 shrink-0">Subject:</span>
              <span className="text-gray-800 dark:text-gray-200 font-bold truncate">
                Re: Quote for {quote.service} - {profile?.business_name || "Your Business"}
              </span>
            </div>
          </div>

          {/* Body draft */}
          <div className="text-[13px] text-gray-700 dark:text-gray-300 font-sans leading-relaxed whitespace-pre-wrap min-h-[140px] max-h-[220px] overflow-y-auto pr-1">
            {emailBody}
          </div>
        </div>

        {/* Action Triggers Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
          <button
            disabled={isPending || !quote.email}
            onClick={() => sendEmail(quote.email || "", template?.name || "Quote Follow-up", emailBody, quote.id)}
            className="bg-[#F26522] hover:bg-[#e05a1a] text-white rounded-full font-bold text-[11px] uppercase tracking-wider h-10 px-3 flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Send Email</span>
          </button>
          
          <button
            onClick={() => copyMessage("email", emailBody, quote.id)}
            className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-full font-bold text-[11px] uppercase tracking-wider h-10 px-3 flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            {copied === "email" ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500 animate-in zoom-in duration-200" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
            )}
            <span>{copied === "email" ? "Copied" : "Copy email"}</span>
          </button>
          
          <button 
            onClick={() => copyMessage("sms", smsBody, quote.id)} 
            className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-full font-bold text-[11px] uppercase tracking-wider h-10 px-3 flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            {copied === "sms" ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500 animate-in zoom-in duration-200" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
            )}
            <span>{copied === "sms" ? "Copied" : "Copy SMS"}</span>
          </button>
          
          <button 
            onClick={() => {
              const url = `${window.location.origin}/quote/${quote.id}`;
              copyMessage("link", url, quote.id);
            }} 
            className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-full font-bold text-[11px] uppercase tracking-wider h-10 px-3 flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98] col-span-3 sm:col-span-1"
          >
            {copied === "link" ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500 animate-in zoom-in duration-200" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
            )}
            <span>{copied === "link" ? "Copied" : "Copy Link"}</span>
          </button>
        </div>

        {/* Follow Up Confirmation */}
        <div className="pt-2">
          <button
            onClick={() => {
              if (logFollowUp && quote.follow_up_stage) {
                logFollowUp(quote.id, "manual", quote.follow_up_stage, quote.quote_sent_on);
              }
            }}
            disabled={isPending || !quote.next_follow_up_at}
            className="w-full bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-full font-bold text-[12px] uppercase tracking-wider h-11 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
          >
            <Check className="w-4 h-4" />
            <span>I Followed Up - Advance to Next Stage</span>
          </button>
        </div>
      </div>

      {/* Quote Notes Section */}
      <div className="space-y-2.5 pt-2">
        <h4 className="text-[12px] font-bold text-gray-950 dark:text-gray-100 uppercase tracking-wider">
          Quote Notes
        </h4>
        <div className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 rounded-xl border border-gray-200/50 dark:border-gray-800/50 p-4 text-[13px] leading-relaxed font-medium transition-colors">
          {quote.notes || <span className="text-gray-300 dark:text-gray-600 italic">No notes added for this quote.</span>}
        </div>
      </div>

      {/* Footer CRM Status Operations Grid */}
      <div className="grid grid-cols-4 gap-2 pt-4 border-t border-gray-100 dark:border-gray-800 text-[11px] font-bold uppercase tracking-wider">
        <button 
          disabled={isPending} 
          onClick={() => updateStatus(quote.id, "won")}
          className="bg-white dark:bg-gray-900 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/40 text-emerald-600 border border-gray-200 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-800 rounded-full h-9 flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <Check className="w-3.5 h-3.5 text-emerald-500" />
          <span className="hidden sm:inline">Won</span>
        </button>

        <button
          disabled={isPending}
          onClick={() => updateStatus(quote.id, "snoozed")}
          className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 rounded-full h-9 flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <Clock3 className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
          <span className="hidden sm:inline">Snooze</span>
        </button>

        <button
          disabled={isPending}
          onClick={() => updateStatus(quote.id, "lost")}
          className="bg-white dark:bg-gray-900 hover:bg-rose-50/40 dark:hover:bg-rose-950/40 text-rose-600 border border-gray-200 dark:border-gray-800 hover:border-rose-200 dark:hover:border-rose-800 rounded-full h-9 flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <X className="w-3.5 h-3.5 text-rose-500" />
          <span className="hidden sm:inline">Lost</span>
        </button>

        <button 
          disabled={isPending} 
          onClick={() => {
            if (confirm("Are you sure you want to permanently delete this quote?")) {
              removeQuote(quote.id);
            }
          }}
          className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-full h-9 flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <Trash2 className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>

    </div>
  );
}
