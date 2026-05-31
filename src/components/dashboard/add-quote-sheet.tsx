 
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
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
      <SheetTrigger render={
        <button className="rounded-full bg-gray-900 hover:bg-black hover:scale-[1.02] active:scale-[0.98] text-white px-4 h-9 font-bold text-[12px] uppercase tracking-wider transition-all duration-200 shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm">
          <Plus className="w-3.5 h-3.5" />
          <span>Add quote</span>
        </button>
      } />
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl bg-white p-6 rounded-l-3xl border-l border-gray-150">
        <form action={handleCreateQuote} ref={formRef} className="space-y-6">
          
          <SheetHeader className="border-b border-gray-100 pb-4">
            <SheetTitle className="text-lg font-bold text-gray-950 tracking-tight">Add Quote</SheetTitle>
            <SheetDescription className="text-gray-400 text-xs mt-1 leading-relaxed">
              Create a new quote tracking item in your pipeline.
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
                  placeholder="Acme Dental" 
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
                  placeholder="Jordan Lee" 
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
                  placeholder="client@example.com" 
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
                  placeholder="(555) 555-0123" 
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
                placeholder="Monthly office cleaning" 
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
                  placeholder="1850"
                  className="w-full h-10 px-3 bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-lg outline-none transition-all duration-200 text-[13px] text-gray-900 placeholder:text-gray-400 font-medium"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="quoteSentOn" className="text-[12px] font-semibold text-gray-700 mb-1.5 block">
                  Sent Date
                </label>
                <input
                  id="quoteSentOn"
                  name="quoteSentOn"
                  required
                  type="date"
                  defaultValue={new Date().toISOString().slice(0, 10)}
                  className="w-full h-10 px-3 bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-lg outline-none transition-all duration-200 text-[13px] text-gray-900 placeholder:text-gray-400 font-medium"
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
                placeholder="Decision maker, concerns, next step..."
                className="w-full min-h-[90px] p-3 bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-lg outline-none transition-all duration-200 text-[13px] text-gray-900 placeholder:text-gray-400 font-medium resize-none leading-relaxed"
              />
            </div>

            {/* Premium textual Follow-up Roadmap card */}
            <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 space-y-3 shadow-[inset_0_1px_2px_rgba(0,0,0,0.005)]">
              <h4 className="text-[11px] font-bold text-gray-950 uppercase tracking-wider">
                Follow-up Schedule Cadence
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {stages.map((stage) => (
                  <div className="bg-white border border-gray-150/70 rounded-xl px-3 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.005)]" key={stage.day}>
                    <p className="font-bold text-[#F26522]">Day {stage.day}</p>
                    <p className="text-gray-400 font-semibold mt-0.5">{stage.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <SheetFooter className="border-t border-gray-100 pt-4 flex items-center justify-end gap-2">
            <button
              disabled={isPending}
              type="submit"
              className="rounded-full bg-[#F26522] hover:bg-[#e05a1a] hover:scale-[1.02] active:scale-[0.98] text-white font-bold text-[11px] uppercase tracking-wider px-5 h-9 border-none shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <Plus className="w-3.5 h-3.5 text-white" />
              )}
              <span>{isPending ? "Creating..." : "Create Follow-up"}</span>
            </button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
