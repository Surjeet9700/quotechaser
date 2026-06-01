 
"use client";

import { useRef, useTransition } from "react";
import { Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateQuote } from "@/app/actions";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { QuoteRow } from "./types";

export function EditQuoteSheet({
  quote,
}: {
  quote: QuoteRow;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  async function handleUpdateQuote(formData: FormData) {
    startTransition(async () => {
      const result = await updateQuote(formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Quote updated successfully!");
    });
  }

  return (
    <Sheet>
      <SheetTrigger render={
        <button className="rounded-md bg-background hover:bg-muted text-muted-foreground hover:text-foreground px-3 h-8 border border-border font-medium text-[11px] transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98] flex items-center gap-1.5">
          <Edit2 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
      } />
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl bg-background p-6 rounded-l-3xl border-l border-border">
        <form action={handleUpdateQuote} ref={formRef} className="space-y-6">
          <input type="hidden" name="id" value={quote.id} />
          
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle className="text-lg font-semibold text-foreground tracking-tight">Edit Quote</SheetTitle>
            <SheetDescription className="text-muted-foreground text-[13px] mt-1 leading-relaxed">
              Update contract info, quote amount, or specific notes.
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
                  defaultValue={quote.customer_name} 
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
                  defaultValue={quote.contact_name} 
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
                  defaultValue={quote.email || ""} 
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
                  defaultValue={quote.phone || ""} 
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
                defaultValue={quote.service} 
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
                  defaultValue={quote.quote_amount_cents / 100}
                  className="w-full h-9 px-3 bg-background border border-border focus:border-ring focus:ring-1 focus:ring-ring rounded-md outline-none transition-all duration-200 text-[13px] text-foreground placeholder:text-muted-foreground font-medium"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="quoteSentOn" className="text-[13px] font-medium text-foreground mb-1.5 block">
                  Sent Date (Read-only)
                </label>
                <input
                  id="quoteSentOn"
                  name="quoteSentOn"
                  type="date"
                  disabled
                  readOnly
                  defaultValue={quote.quote_sent_on}
                  className="w-full h-9 px-3 bg-muted border border-border rounded-md outline-none text-[13px] text-muted-foreground font-medium cursor-not-allowed"
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
                defaultValue={quote.notes || ""}
                className="w-full min-h-[90px] p-3 bg-background border border-border focus:border-ring focus:ring-1 focus:ring-ring rounded-md outline-none transition-all duration-200 text-[13px] text-foreground placeholder:text-muted-foreground font-medium resize-none leading-relaxed"
              />
            </div>
          </div>

          <SheetFooter className="border-t border-border pt-4 flex items-center justify-end gap-2">
            <button 
              disabled={isPending} 
              type="submit"
              className="rounded-md bg-foreground hover:bg-foreground/90 active:scale-[0.98] text-background font-medium text-[13px] px-4 h-9 border-none shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin text-background" /> : null}
              <span>{isPending ? "Saving..." : "Save changes"}</span>
            </button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
