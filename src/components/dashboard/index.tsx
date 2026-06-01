/* eslint-disable @typescript-eslint/no-explicit-any, react/no-unescaped-entities, @typescript-eslint/no-unused-vars */
"use client";

import { ReactNode, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { deleteQuote, updateQuoteStatus, sendQuoteEmail, logFollowUp } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AddQuoteSheet } from "./add-quote-sheet";
import { CsvMapper } from "./csv-mapper";
import { MetricCards } from "./metric-cards";
import { QuoteDetail } from "./quote-detail";
import { QuoteList, QuoteListEmpty } from "./quote-list";
import { type QuoteRow } from "./types";
import { dueDate, isDue, todayDate } from "./utils";
import { ThemeToggle } from "@/components/theme-toggle";

export type { QuoteRow };

export function Dashboard({
  children,
  paymentLink,
  quotes,
  userEmail,
  templates,
  profile,
}: {
  children: ReactNode;
  paymentLink: string;
  quotes: QuoteRow[];
  userEmail: string;
  templates: any[];
  profile: any;
}) {
  const [selectedId, setSelectedId] = useState(quotes[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"due" | "open" | "won">("due");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [csvOpen, setCsvOpen] = useState(false);
  const [copied, setCopied] = useState<"email" | "sms" | "link" | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedQuote = quotes.find((quote) => quote.id === selectedId) ?? quotes[0] ?? null;

  const visibleQuotes = useMemo(() => {
    return quotes.filter((quote) => {
      const matchesFilter =
        filter === "due"
          ? isDue(quote)
          : filter === "open"
            ? quote.status === "open" || quote.status === "snoozed"
            : quote.status === "won";
      const searchText =
        `${quote.customer_name} ${quote.contact_name} ${quote.service}`.toLowerCase();
      return matchesFilter && searchText.includes(query.toLowerCase());
    });
  }, [filter, query, quotes]);

  const stats = useMemo(() => {
    const active = quotes.filter((quote) => quote.status === "open" || quote.status === "snoozed");
    const won = quotes.filter((quote) => quote.status === "won");
    return {
      due: active.filter(isDue).length,
      openValue: active.reduce((sum, quote) => sum + quote.quote_amount_cents, 0),
      overdue: active.filter((quote) => dueDate(quote) < todayDate()).length,
      wonValue: won.reduce((sum, quote) => sum + quote.quote_amount_cents, 0),
    };
  }, [quotes]);

  async function changeStatus(id: string, status: QuoteRow["status"]) {
    const formData = new FormData();
    formData.set("id", id);
    formData.set("status", status);
    startTransition(async () => {
      const result = await updateQuoteStatus(formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      const messages: Record<QuoteRow["status"], string> = {
        won: "🎉 Quote marked as Won!",
        lost: "Quote marked as Lost.",
        snoozed: "Quote snoozed — we'll remind you later.",
        open: "Quote reopened.",
      };
      toast.success(messages[status]);
    });
  }

  async function removeQuote(id: string) {
    const formData = new FormData();
    formData.set("id", id);
    startTransition(async () => {
      const result = await deleteQuote(formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      if (selectedId === id) setSelectedId("");
      toast.info("Quote deleted.");
    });
  }

  async function copyMessage(kind: "email" | "sms" | "link", text: string, quoteId: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      toast.success(
        kind === "email" ? "Email copied to clipboard!" : 
        kind === "sms" ? "SMS copied to clipboard!" : "Client link copied!"
      );
      setTimeout(() => setCopied(null), 2000);
      
      if (kind !== "link") {
        await fetch("/api/events", {
          body: JSON.stringify({
            eventName: kind === "email" ? "email_copied" : "sms_copied",
            properties: { quote_id: quoteId },
          }),
          headers: { "content-type": "application/json" },
          method: "POST",
        });
      }
    } catch (err) {
      toast.error("Failed to copy to clipboard.");
    }
  }

  async function handleSendEmail(email: string, subject: string, body: string, quoteId: string) {
    if (!email) {
      toast.error("This quote doesn't have an email address.");
      return;
    }
    
    const formData = new FormData();
    formData.set("email", email);
    formData.set("subject", subject);
    formData.set("body", body);
    formData.set("quoteId", quoteId);
    
    startTransition(async () => {
      const result = await sendQuoteEmail(formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Email sent successfully!");
    });
  }

  async function handleLogFollowUp(id: string, channel: string, currentStage: number, quoteSentOn: string) {
    const formData = new FormData();
    formData.set("id", id);
    formData.set("channel", channel);
    formData.set("currentStage", currentStage.toString());
    formData.set("quoteSentOn", quoteSentOn);
    
    startTransition(async () => {
      const result = await logFollowUp(formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Follow-up logged and next date scheduled!");
    });
  }

  return (
    <div className="flex min-w-0 flex-col">
      <header className="flex flex-col gap-3 border-b border-border px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6 bg-background">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Today&apos;s follow-ups</h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            {new Date().toLocaleDateString("en-US", { dateStyle: "full" })} · Manage active quotes and follow-ups.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {paymentLink ? (
            <Button
              className="bg-[#F26522] hover:bg-[#e05a1a] text-white rounded-full font-bold text-[11px] uppercase tracking-wider px-5 h-9 border-none shadow-sm transition-all duration-200 cursor-pointer shrink-0 flex items-center justify-center hover:scale-[1.02]"
              render={<a href={paymentLink} target="_blank" rel="noreferrer" />}
            >
              Upgrade
            </Button>
          ) : null}
          <ThemeToggle />
          <CsvMapper open={csvOpen} onOpenChange={setCsvOpen} />
          <AddQuoteSheet open={sheetOpen} onOpenChange={setSheetOpen} />
          {children}
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        {!profile?.sender_name || !profile?.business_name ? (
          <div className="bg-[#F26522]/5 border border-[#F26522]/15 text-[#F26522] px-4 py-3 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-semibold tracking-tight shadow-[0_1px_2px_rgba(242,99,34,0.02)] gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F26522] animate-pulse shrink-0" />
              <span>✨ Complete your profile in <Link href="/settings" className="underline font-bold hover:text-[#e05a1a] transition-colors">Settings</Link> to ensure your follow-up emails don't use default placeholders!</span>
            </div>
            <Link href="/settings" className="bg-[#F26522] hover:bg-[#e05a1a] text-white rounded-full px-3.5 py-1.5 font-bold transition-all duration-200 hover:scale-[1.02] shrink-0 text-center text-[11px] uppercase tracking-wider">
              Set Up Now
            </Link>
          </div>
        ) : null}

        <MetricCards
          due={stats.due}
          openValue={stats.openValue}
          overdue={stats.overdue}
          wonValue={stats.wonValue}
        />

        {quotes.length === 0 ? (
          <QuoteListEmpty onAddFirst={() => setSheetOpen(true)} />
        ) : (
          <div className="grid flex-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px] items-start">
            
            {/* The Follow-up queue Card Container */}
            <div className="bg-card rounded-2xl border border-border inset-shadow-sm p-6 sm:p-8 min-w-0 flex flex-col gap-6">
              
              {/* Header and Controls block */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                <div>
                  <h2 className="text-base font-bold text-foreground tracking-tight">Active Pipeline</h2>
                  <p className="text-muted-foreground text-xs mt-1 leading-relaxed">Based on quote sent date and open status.</p>
                </div>
                
                {/* Search & Tabs filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="relative">
                    <Search className="text-gray-400 pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 w-4 h-4" />
                    <input
                      type="text"
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search quotes"
                      value={query}
                      className="w-full sm:w-48 h-9 pl-9 pr-3 text-[13px] bg-background hover:bg-muted border border-border focus:border-ring rounded-xl outline-none transition-all duration-200 text-foreground placeholder:text-muted-foreground font-semibold"
                    />
                  </div>
                  
                  {/* Clean sober control tabs */}
                  <div className="flex bg-muted border border-border p-0.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0">
                    {["due", "open", "won"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setFilter(tab as "due" | "open" | "won")}
                        className={cn(
                          "px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer",
                          filter === tab 
                            ? "bg-background text-foreground shadow-sm border border-border"
                            : "hover:text-foreground"
                        )}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Table List content */}
              <div className="min-w-0">
                <QuoteList
                  quotes={visibleQuotes}
                  selectedId={selectedQuote?.id ?? ""}
                  setSelectedId={setSelectedId}
                />
              </div>
            </div>

            {/* Quote details block */}
            <div className="xl:sticky xl:top-6">
              {selectedQuote ? (
                <QuoteDetail
                  copied={copied}
                  copyMessage={copyMessage}
                  sendEmail={handleSendEmail}
                  isPending={isPending}
                  quote={selectedQuote}
                  removeQuote={removeQuote}
                  updateStatus={changeStatus}
                  templates={templates}
                  profile={profile}
                  userEmail={userEmail}
                  logFollowUp={handleLogFollowUp}
                />
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
