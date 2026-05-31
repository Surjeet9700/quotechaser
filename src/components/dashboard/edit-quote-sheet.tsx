 
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
        <button className="rounded-full bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 px-3.5 h-7 border border-gray-200 font-bold text-[10px] uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1">
          <Edit2 className="w-3.5 h-3.5 text-gray-400" />
          <span>Edit</span>
        </button>
      } />
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl bg-white p-6 rounded-l-3xl border-l border-gray-150">
        <form action={handleUpdateQuote} ref={formRef} className="space-y-6">
          <input type="hidden" name="id" value={quote.id} />
          
          <SheetHeader className="border-b border-gray-100 pb-4">
            <SheetTitle className="text-lg font-bold text-gray-950 tracking-tight">Edit Quote</SheetTitle>
            <SheetDescription className="text-gray-400 text-xs mt-1 leading-relaxed">
              Update contract info, quote amount, or specific notes.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col">
                <label htmlFor="customerName" className="text-[12px] font-semibold text-gray-700 mb-1.5 block">
                  Customer
                </label>
                <input 
                  id="customerName" 
                  name="customerName" 
                  type="text"
                  required 
                  defaultValue={quote.customer_name} 
                  className="w-full h-10 px-3 bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-lg outline-none transition-all duration-200 text-[13px] text-gray-900 placeholder:text-gray-400 font-medium"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="contactName" className="text-[12px] font-semibold text-gray-700 mb-1.5 block">
                  Contact
                </label>
                <input 
                  id="contactName" 
                  name="contactName" 
                  type="text"
                  required 
                  defaultValue={quote.contact_name} 
                  className="w-full h-10 px-3 bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-lg outline-none transition-all duration-200 text-[13px] text-gray-900 placeholder:text-gray-400 font-medium"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col">
                <label htmlFor="email" className="text-[12px] font-semibold text-gray-700 mb-1.5 block">
                  Email
                </label>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  defaultValue={quote.email || ""} 
                  className="w-full h-10 px-3 bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-lg outline-none transition-all duration-200 text-[13px] text-gray-900 placeholder:text-gray-400 font-medium"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="phone" className="text-[12px] font-semibold text-gray-700 mb-1.5 block">
                  Phone
                </label>
                <input 
                  id="phone" 
                  name="phone" 
                  type="text"
                  defaultValue={quote.phone || ""} 
                  className="w-full h-10 px-3 bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-lg outline-none transition-all duration-200 text-[13px] text-gray-900 placeholder:text-gray-400 font-medium"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="service" className="text-[12px] font-semibold text-gray-700 mb-1.5 block">
                Service
              </label>
              <input 
                id="service" 
                name="service" 
                type="text"
                required 
                defaultValue={quote.service} 
                className="w-full h-10 px-3 bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-lg outline-none transition-all duration-200 text-[13px] text-gray-900 placeholder:text-gray-400 font-medium"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col">
                <label htmlFor="amount" className="text-[12px] font-semibold text-gray-700 mb-1.5 block">
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
                  className="w-full h-10 px-3 bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-lg outline-none transition-all duration-200 text-[13px] text-gray-900 placeholder:text-gray-400 font-medium"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="quoteSentOn" className="text-[12px] font-semibold text-gray-700 mb-1.5 block">
                  Sent Date (Read-only)
                </label>
                <input
                  id="quoteSentOn"
                  name="quoteSentOn"
                  type="date"
                  disabled
                  readOnly
                  defaultValue={quote.quote_sent_on}
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-[13px] text-gray-400 font-medium cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="notes" className="text-[12px] font-semibold text-gray-700 mb-1.5 block">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                defaultValue={quote.notes || ""}
                className="w-full min-h-[90px] p-3 bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-lg outline-none transition-all duration-200 text-[13px] text-gray-900 placeholder:text-gray-400 font-medium resize-none leading-relaxed"
              />
            </div>
          </div>

          <SheetFooter className="border-t border-gray-100 pt-4 flex items-center justify-end gap-2">
            <button 
              disabled={isPending} 
              type="submit"
              className="rounded-full bg-[#F26522] hover:bg-[#e05a1a] hover:scale-[1.02] active:scale-[0.98] text-white font-bold text-[11px] uppercase tracking-wider px-5 h-9 border-none shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> : null}
              <span>{isPending ? "Saving..." : "Save changes"}</span>
            </button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
