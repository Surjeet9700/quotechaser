/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactNode, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Search, Plus, Upload, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { deleteQuote, updateQuoteStatus, sendQuoteEmail, logFollowUp } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AddQuoteSheet } from "./add-quote-sheet";
import { CsvMapper } from "./csv-mapper";
import { MetricCards } from "./metric-cards";
import { QuoteDetail } from "./quote-detail";
import { QuoteList } from "./quote-list";
import { WelcomeCard } from "./welcome-card";
import { type QuoteRow } from "./types";
import { dueDate, isDue, todayDate } from "./utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export type { QuoteRow };

export function Dashboard({
  children,
  paymentLink,
  quotes,
  templates,
  profile,
}: {
  children: ReactNode;
  paymentLink: string;
  quotes: QuoteRow[];
  templates: any[];
  profile: any;
}) {
  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"due" | "open" | "won">("due");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [csvOpen, setCsvOpen] = useState(false);
  const [copied, setCopied] = useState<"email" | "sms" | "link" | null>(null);
  const [isPending, startTransition] = useTransition();

  const profileComplete = Boolean(profile?.sender_name && profile?.business_name);
  const isEmpty = quotes.length === 0;

  const [welcomeOpen, setWelcomeOpen] = useState(isEmpty);

  const welcomedRef = useRef(false);
  useEffect(() => {
    if (welcomedRef.current) return;
    if (!isEmpty) return;
    welcomedRef.current = true;
    void fetch("/api/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        eventName: "welcome_card_viewed",
        properties: { profile_complete: profileComplete },
      }),
    });
  }, [isEmpty, profileComplete]);

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

  const selectedQuote = visibleQuotes.find((quote) => quote.id === selectedId) ?? null;

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
    } catch {
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
      <div className="flex flex-col gap-4 p-4 sm:p-8 pb-24 max-w-[1400px] mx-auto w-full">
        {!profileComplete && !isEmpty ? (
          <div className="bg-muted border border-border text-foreground px-4 py-3 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-medium tracking-tight gap-3">
            <span>
              Complete your profile in{" "}
              <Link
                href="/settings"
                className="underline font-semibold hover:text-foreground/80 transition-colors"
              >
                Settings
              </Link>{" "}
              to enable email placeholders.
            </span>
            <Link
              href="/settings"
              className="bg-foreground text-background rounded-md px-3 py-1.5 font-medium transition-all text-[11px] shrink-0"
            >
              Set Up Now
            </Link>
          </div>
        ) : null}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2 flex-wrap">
              Today
              <span className="text-sm font-medium text-muted-foreground">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {paymentLink ? (
              <Button
                className="bg-brand hover:bg-brand/90 text-primary-foreground rounded-md font-medium text-[12px] px-3 h-8 border-none shadow-sm transition-all duration-200 cursor-pointer shrink-0 flex items-center justify-center"
                render={<a href={paymentLink} target="_blank" rel="noreferrer" />}
              >
                Upgrade
              </Button>
            ) : null}

            <button
              type="button"
              onClick={() => setCsvOpen(true)}
              className="rounded-md bg-background border border-border hover:bg-muted active:scale-[0.98] text-foreground px-3 h-8 font-medium text-[12px] transition-all duration-200 shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Import CSV</span>
              <span className="sr-only sm:hidden">Import CSV</span>
            </button>

            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="rounded-md bg-foreground hover:bg-foreground/90 active:scale-[0.98] text-background px-3 h-8 font-medium text-[12px] transition-all duration-200 shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add quote</span>
            </button>

            {children}
          </div>
        </div>

        <MetricCards
          due={stats.due}
          openValue={stats.openValue}
          overdue={stats.overdue}
          wonValue={stats.wonValue}
        />

        <div className="grid flex-1 gap-6 items-start grid-cols-1">
          <div className="bg-card rounded-md border border-border p-4 sm:p-6 lg:p-8 min-w-0 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-5">
              <div className="min-w-0">
                <h2 className="text-base font-bold text-foreground tracking-tight">
                  Active Pipeline
                </h2>
                <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                  Based on quote sent date and open status.
                </p>
              </div>

              {!isEmpty && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="relative">
                    <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 w-4 h-4" />
                    <input
                      type="text"
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search quotes"
                      value={query}
                      className="w-full sm:w-48 h-9 pl-9 pr-3 text-[13px] bg-background hover:bg-muted border border-border focus:border-ring rounded-md outline-none transition-all duration-200 text-foreground placeholder:text-muted-foreground font-semibold"
                    />
                  </div>

                  <div className="flex bg-muted border border-border p-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0">
                    {["due", "open", "won"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setFilter(tab as "due" | "open" | "won")}
                        className={cn(
                          "flex-1 sm:flex-none px-3 py-1.5 rounded-md transition-all duration-200 cursor-pointer",
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
              )}
            </div>

            <div className="min-w-0">
              {isEmpty ? (
                <div className="flex flex-col items-center justify-center text-center py-12 sm:py-16 px-4">
                  <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center mb-4">
                    <Sparkles className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-foreground font-semibold text-sm tracking-tight">
                    Your pipeline is empty
                  </p>
                  <p className="text-muted-foreground text-[13px] mt-1 max-w-xs leading-relaxed">
                    Add your first quote and we&apos;ll schedule the next follow-up automatically.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 mt-5 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setSheetOpen(true)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-md bg-foreground hover:bg-foreground/90 active:scale-[0.98] text-background h-9 px-4 font-medium text-[13px] transition-all shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add first quote
                    </button>
                    <button
                      type="button"
                      onClick={() => setCsvOpen(true)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-md bg-background border border-border hover:bg-muted text-foreground h-9 px-4 font-medium text-[13px] transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Import CSV
                    </button>
                  </div>
                </div>
              ) : (
                <QuoteList
                  quotes={visibleQuotes}
                  selectedId={selectedQuote?.id ?? ""}
                  setSelectedId={setSelectedId}
                  updateStatus={changeStatus}
                />
              )}
            </div>
          </div>
        </div>

        <WelcomeCard
          open={welcomeOpen}
          onOpenChange={setWelcomeOpen}
          onAddQuote={() => setSheetOpen(true)}
          onImport={() => setCsvOpen(true)}
          profileComplete={profileComplete}
        />

        <AddQuoteSheet open={sheetOpen} onOpenChange={setSheetOpen} showTrigger={false} />
        <CsvMapper open={csvOpen} onOpenChange={setCsvOpen} showTrigger={false} />

        <Dialog open={!!selectedQuote} onOpenChange={(open) => !open && setSelectedId("")}>
          <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-border bg-background rounded-2xl shadow-xl">
            <DialogTitle className="sr-only">Quote Details</DialogTitle>
            {selectedQuote && (
              <div className="p-4 sm:p-6 lg:p-8 max-h-[85vh] overflow-y-auto">
                <QuoteDetail
                  copied={copied}
                  copyMessage={copyMessage}
                  sendEmail={handleSendEmail}
                  isPending={isPending}
                  quote={selectedQuote}
                  removeQuote={removeQuote}
                  templates={templates}
                  profile={profile}
                  logFollowUp={handleLogFollowUp}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
