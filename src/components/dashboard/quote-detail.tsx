"use client";

import { Check, Copy, Mail, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { type QuoteRow, type TemplateRow, type ProfileRow } from "./types";
import { buildSms, currency, nextStage, parseTemplate, statusTone } from "./utils";
import { EditQuoteSheet } from "./edit-quote-sheet";

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">{label}</p>
      <p className="mt-1 truncate text-[13px] font-medium text-foreground">{value}</p>
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
  templates,
  profile,
  logFollowUp,
}: {
  copied: "email" | "sms" | "link" | null;
  copyMessage: (kind: "email" | "sms" | "link", text: string, quoteId: string) => Promise<void>;
  sendEmail: (email: string, subject: string, body: string, quoteId: string) => Promise<void>;
  isPending: boolean;
  quote: QuoteRow;
  removeQuote: (id: string) => Promise<void>;
  templates: TemplateRow[];
  profile: ProfileRow | null;
  logFollowUp?: (id: string, channel: string, currentStage: number, quoteSentOn: string) => Promise<void>;
}) {
  const stage = nextStage(quote);
  
  // Find the custom template for this stage, or fallback to an empty string to avoid crashes
  const template = templates.find((t) => t.stage_day === stage.day);
  const emailBody = template ? parseTemplate(template.body, quote, profile) : "No template found for this stage.";
  const smsBody = buildSms(quote);

  return (
    <div className="bg-background flex flex-col space-y-6 min-w-0">
      
      {/* Header section with customer name, service type, edit triggers and status */}
      <div className="flex justify-between items-start gap-4 pb-4 border-b border-border">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-foreground tracking-tight truncate">
            {quote.customer_name}
          </h2>
          <p className="text-muted-foreground text-[13px] font-medium mt-0.5 truncate">
            {quote.service}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <EditQuoteSheet quote={quote} />
          <button 
            disabled={isPending} 
            onClick={() => {
              if (confirm("Are you sure you want to permanently delete this quote?")) {
                removeQuote(quote.id);
              }
            }}
            className="text-muted-foreground hover:bg-muted hover:text-destructive transition-colors p-1.5 rounded-md border border-transparent"
            title="Delete quote"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border capitalize", statusTone(quote.status))}>
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
          <h4 className="text-[13px] font-semibold text-foreground tracking-tight">
            Suggested Follow-up <span className="text-muted-foreground font-normal">({stage.label})</span>
          </h4>
        </div>

        {/* Raw draft preview */}
        <div className="bg-background rounded-md border border-border p-3">
          <div className="text-[13px] text-foreground font-sans leading-relaxed whitespace-pre-wrap min-h-[140px] max-h-[220px] overflow-y-auto pr-1">
            {emailBody}
          </div>
        </div>

        {/* Primary Action */}
        <div className="pt-2">
          <button
            onClick={() => {
              if (logFollowUp && quote.follow_up_stage) {
                logFollowUp(quote.id, "manual", quote.follow_up_stage, quote.quote_sent_on);
              }
            }}
            disabled={isPending || !quote.next_follow_up_at}
            className="w-full bg-foreground hover:bg-foreground/90 text-background rounded-md font-medium text-[13px] h-9 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
          >
            <Check className="w-4 h-4" />
            <span>I Followed Up - Advance to Next Stage</span>
          </button>
        </div>

        {/* Action Triggers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <button
            disabled={isPending || !quote.email}
            onClick={() => sendEmail(quote.email || "", template?.name || "Quote Follow-up", emailBody, quote.id)}
            className="bg-background hover:bg-muted text-foreground border border-border rounded-md font-medium text-[11px] h-8 flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Send Email</span>
          </button>
          
          <button
            onClick={() => copyMessage("email", emailBody, quote.id)}
            className="bg-background hover:bg-muted text-foreground border border-border rounded-md font-medium text-[11px] h-8 flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98]"
          >
            {copied === "email" ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 animate-in zoom-in duration-200" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            )}
            <span>{copied === "email" ? "Copied" : "Copy email"}</span>
          </button>
          
          <button 
            onClick={() => copyMessage("sms", smsBody, quote.id)} 
            className="bg-background hover:bg-muted text-foreground border border-border rounded-md font-medium text-[11px] h-8 flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98]"
          >
            {copied === "sms" ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 animate-in zoom-in duration-200" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            )}
            <span>{copied === "sms" ? "Copied" : "Copy SMS"}</span>
          </button>
          
          <button 
            onClick={() => {
              const url = `${window.location.origin}/quote/${quote.id}`;
              copyMessage("link", url, quote.id);
            }} 
            className="bg-background hover:bg-muted text-foreground border border-border rounded-md font-medium text-[11px] h-8 flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98]"
          >
            {copied === "link" ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 animate-in zoom-in duration-200" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            )}
            <span>{copied === "link" ? "Copied" : "Copy Link"}</span>
          </button>
        </div>
      </div>

      {/* Quote Notes Section */}
      <div className="space-y-2.5 pt-2 border-t border-border mt-4">
        <h4 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
          Quote Notes
        </h4>
        <div className="text-foreground text-[13px] leading-relaxed font-medium transition-colors">
          {quote.notes || <span className="text-muted-foreground italic">No notes added for this quote.</span>}
        </div>
      </div>

    </div>
  );
}
