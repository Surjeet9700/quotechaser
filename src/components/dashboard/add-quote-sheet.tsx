 
"use client";

import { useRef, useTransition } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createQuote } from "@/app/actions";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { stages } from "./types";

export function AddQuoteSheet({
  open,
  onOpenChange,
  showTrigger = true,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showTrigger?: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  async function handleCreateQuote(formData: FormData) {
    startTransition(async () => {
      const result = await createQuote(formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      formRef.current?.reset();
      onOpenChange(false);
      toast.success("Quote added to pipeline!");
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {showTrigger ? (
        <SheetTrigger render={
          <button className="rounded-md bg-foreground hover:bg-foreground/90 active:scale-[0.98] text-background px-3 h-8 font-medium text-[12px] transition-all duration-200 shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm">
            <Plus className="w-3.5 h-3.5" />
            <span>Add quote</span>
          </button>
        } />
      ) : null}
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl bg-background p-4 sm:p-6 sm:rounded-l-3xl border-l border-border">
        <form action={handleCreateQuote} ref={formRef} className="space-y-6">
          
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle className="text-lg font-semibold text-foreground tracking-tight">Add Quote</SheetTitle>
            <SheetDescription className="text-muted-foreground text-[13px] mt-1 leading-relaxed">
              Create a new quote tracking item in your pipeline.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col">
                <label htmlFor="customerName" className="text-[13px] font-medium text-foreground mb-1.5 block">
                  Customer
                </label>
                <input 
                  id="customerName" 
                  name="customerName" 
                  type="text"
                  required 
                  placeholder="Acme Dental" 
                  className="w-full h-9 px-3 bg-background border border-border focus:border-ring focus:ring-1 focus:ring-ring rounded-md outline-none transition-all duration-200 text-[13px] text-foreground placeholder:text-muted-foreground font-medium"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="contactName" className="text-[13px] font-medium text-foreground mb-1.5 block">
                  Contact
                </label>
                <input 
                  id="contactName" 
                  name="contactName" 
                  type="text"
                  required 
                  placeholder="Jordan Lee" 
                  className="w-full h-9 px-3 bg-background border border-border focus:border-ring focus:ring-1 focus:ring-ring rounded-md outline-none transition-all duration-200 text-[13px] text-foreground placeholder:text-muted-foreground font-medium"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col">
                <label htmlFor="email" className="text-[13px] font-medium text-foreground mb-1.5 block">
                  Email
                </label>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="client@example.com" 
                  className="w-full h-9 px-3 bg-background border border-border focus:border-ring focus:ring-1 focus:ring-ring rounded-md outline-none transition-all duration-200 text-[13px] text-foreground placeholder:text-muted-foreground font-medium"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="phone" className="text-[13px] font-medium text-foreground mb-1.5 block">
                  Phone
                </label>
                <input 
                  id="phone" 
                  name="phone" 
                  type="text"
                  placeholder="(555) 555-0123" 
                  className="w-full h-9 px-3 bg-background border border-border focus:border-ring focus:ring-1 focus:ring-ring rounded-md outline-none transition-all duration-200 text-[13px] text-foreground placeholder:text-muted-foreground font-medium"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="service" className="text-[13px] font-medium text-foreground mb-1.5 block">
                Service
              </label>
              <input 
                id="service" 
                name="service" 
                type="text"
                required 
                placeholder="Monthly office cleaning" 
                className="w-full h-9 px-3 bg-background border border-border focus:border-ring focus:ring-1 focus:ring-ring rounded-md outline-none transition-all duration-200 text-[13px] text-foreground placeholder:text-muted-foreground font-medium"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col">
                <label htmlFor="amount" className="text-[13px] font-medium text-foreground mb-1.5 block">
                  Quote Amount ($)
                </label>
                <input
                  id="amount"
                  name="amount"
                  min="1"
                  required
                  step="1"
                  type="number"
                  placeholder="1850"
                  className="w-full h-9 px-3 bg-background border border-border focus:border-ring focus:ring-1 focus:ring-ring rounded-md outline-none transition-all duration-200 text-[13px] text-foreground placeholder:text-muted-foreground font-medium"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="quoteSentOn" className="text-[13px] font-medium text-foreground mb-1.5 block">
                  Sent Date
                </label>
                <input
                  id="quoteSentOn"
                  name="quoteSentOn"
                  required
                  type="date"
                  defaultValue={new Date().toISOString().slice(0, 10)}
                  className="w-full h-9 px-3 bg-background border border-border focus:border-ring focus:ring-1 focus:ring-ring rounded-md outline-none transition-all duration-200 text-[13px] text-foreground placeholder:text-muted-foreground font-medium"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="notes" className="text-[13px] font-medium text-foreground mb-1.5 block">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Decision maker, concerns, next step..."
                className="w-full min-h-[90px] p-3 bg-background border border-border focus:border-ring focus:ring-1 focus:ring-ring rounded-md outline-none transition-all duration-200 text-[13px] text-foreground placeholder:text-muted-foreground font-medium resize-none leading-relaxed"
              />
            </div>

            {/* Premium textual Follow-up Roadmap card */}
            <div className="bg-muted/30 border border-border rounded-xl p-4 space-y-3">
              <h4 className="text-[12px] font-semibold text-foreground tracking-tight">
                Follow-up Schedule Cadence
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[12px]">
                {stages.map((stage) => (
                  <div className="bg-background border border-border rounded-md px-3 py-2 shadow-sm" key={stage.day}>
                    <p className="font-medium text-foreground">Day {stage.day}</p>
                    <p className="text-muted-foreground mt-0.5 text-[11px]">{stage.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <SheetFooter className="border-t border-border pt-4 flex items-center justify-end gap-2">
            <button
              disabled={isPending}
              type="submit"
              className="rounded-md bg-foreground hover:bg-foreground/90 active:scale-[0.98] text-background font-medium text-[13px] px-4 h-9 border-none shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin text-background" />
              ) : (
                <Plus className="w-4 h-4 text-background" />
              )}
              <span>{isPending ? "Creating..." : "Create Follow-up"}</span>
            </button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
