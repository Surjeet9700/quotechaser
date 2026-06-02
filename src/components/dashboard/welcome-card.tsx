"use client";

import Link from "next/link";
import { ArrowRight, FileUp, Settings, Sparkles, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const STEPS = [
  "Add the quote you already sent",
  "We schedule the next follow-up",
  "Mark won, lost or snooze in one tap",
] as const;

export function WelcomeCard({
  open,
  onOpenChange,
  onAddQuote,
  onImport,
  profileComplete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddQuote: () => void;
  onImport?: () => void;
  profileComplete: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 overflow-hidden border-border bg-background rounded-2xl shadow-xl sm:max-w-md w-[calc(100%-1.5rem)] max-h-[calc(100dvh-2rem)]"
        showCloseButton
      >
        <div className="flex flex-col max-h-[calc(100dvh-2rem)] overflow-y-auto">
        <div className="relative px-6 pt-8 pb-6 sm:px-8 sm:pt-10 sm:pb-7 bg-gradient-to-br from-muted/40 via-background to-background border-b border-border">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-foreground text-background mb-4 shadow-sm">
            <Sparkles className="w-5 h-5" aria-hidden="true" />
          </div>
          <DialogTitle className="text-xl sm:text-[22px] font-semibold tracking-tight text-foreground leading-tight">
            Welcome to QuoteChaser
          </DialogTitle>
          <DialogDescription className="text-[13px] sm:text-sm text-muted-foreground mt-2 leading-relaxed">
            Stop losing deals to slow follow-up. Add your first quote and we&apos;ll handle the chase for you.
          </DialogDescription>
        </div>

        <div className="px-6 sm:px-8 py-5 space-y-4">
          <ul className="space-y-2.5" aria-label="What happens next">
            {STEPS.map((step, idx) => (
              <li key={step} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted border border-border text-foreground text-[10px] font-semibold">
                  {idx + 1}
                </span>
                <span className="text-[13px] text-foreground leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>

          {profileComplete ? (
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground px-3 py-2 rounded-md bg-muted/40 border border-border">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
              <span>Profile complete — emails will personalize automatically.</span>
            </div>
          ) : (
            <Link
              href="/settings"
              onClick={() => onOpenChange(false)}
              className="flex items-center justify-between gap-2 text-[12px] px-3 py-2 rounded-md bg-muted/40 border border-border hover:bg-muted transition-colors group"
            >
              <span className="flex items-center gap-2 text-foreground">
                <Settings className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                Finish your profile for personalized emails
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0" aria-hidden="true" />
            </Link>
          )}
        </div>

        <div className="px-6 sm:px-8 pb-6 pt-2 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-border bg-muted/20">
          {onImport ? (
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                onImport();
              }}
              className="inline-flex items-center justify-center gap-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted h-9 px-3 font-medium text-[13px] transition-colors w-full sm:w-auto"
            >
              <FileUp className="w-3.5 h-3.5" aria-hidden="true" />
              Import CSV instead
            </button>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={() => {
              onOpenChange(false);
              onAddQuote();
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-foreground hover:bg-foreground/90 active:scale-[0.98] text-background h-9 px-4 font-medium text-[13px] transition-all shadow-sm w-full sm:w-auto"
          >
            Add first quote
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
