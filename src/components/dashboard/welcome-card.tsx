"use client";

import Link from "next/link";
import { ArrowRight, FileUp, Settings } from "lucide-react";

const ACTIVATION_STEPS = [
  { label: "Add a quote" },
  { label: "Send follow-up" },
  { label: "Mark done" },
] as const;

export function WelcomeCard({
  onAddQuote,
  onImport,
  profileComplete,
}: {
  onAddQuote: () => void;
  onImport?: () => void;
  profileComplete: boolean;
}) {
  return (
    <section
      aria-label="Set up your follow-up queue"
      className="bg-card border border-border rounded-md p-6 sm:p-8"
    >
      <div className="flex flex-col gap-2 max-w-2xl">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
          Set up your follow-up queue
        </h2>
        <p className="text-[13px] sm:text-sm text-muted-foreground leading-relaxed">
          Add one quote you already sent. QuoteChaser will schedule the next follow-up automatically.
        </p>
        <p className="text-xs text-muted-foreground/80">
          Less than two minutes from here.
        </p>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2">
        <button
          type="button"
          onClick={onAddQuote}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-foreground hover:bg-foreground/90 text-background h-9 px-4 font-medium text-[13px] transition-colors"
        >
          Add first quote
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>

        {!profileComplete && (
          <Link
            href="/settings"
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-background border border-border hover:bg-muted text-foreground h-9 px-4 font-medium text-[13px] transition-colors"
          >
            <Settings className="w-3.5 h-3.5" aria-hidden="true" />
            Complete profile
          </Link>
        )}

        {onImport && (
          <button
            type="button"
            onClick={onImport}
            className="inline-flex items-center justify-center gap-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted h-9 px-3 font-medium text-[13px] transition-colors"
          >
            <FileUp className="w-3.5 h-3.5" aria-hidden="true" />
            Import CSV
          </button>
        )}
      </div>

      <ol
        aria-label="Activation steps"
        className="mt-6 flex flex-wrap items-center gap-x-1 gap-y-2 text-[11px] font-medium"
      >
        {ACTIVATION_STEPS.map((step, idx) => {
          const isCurrent = idx === 0;
          const isLast = idx === ACTIVATION_STEPS.length - 1;
          return (
            <li key={step.label} className="flex items-center">
              <span
                aria-current={isCurrent ? "step" : undefined}
                className={
                  isCurrent
                    ? "flex size-5 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-semibold"
                    : "flex size-5 items-center justify-center rounded-full border border-border text-muted-foreground text-[10px] font-medium"
                }
              >
                {idx + 1}
              </span>
              <span
                className={
                  isCurrent
                    ? "ml-2 text-foreground"
                    : "ml-2 text-muted-foreground"
                }
              >
                {step.label}
              </span>
              {!isLast && (
                <span
                  aria-hidden="true"
                  className="mx-2 sm:mx-3 h-px w-6 sm:w-8 bg-border"
                />
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
