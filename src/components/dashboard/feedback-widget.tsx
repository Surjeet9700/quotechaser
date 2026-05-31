 
"use client";

import { useState } from "react";
import { MessageSquare, X, Send, Smile, Meh, Frown } from "lucide-react";
import { submitFeedback } from "@/app/actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentiment, setSentiment] = useState<"positive" | "neutral" | "negative" | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    if (sentiment) {
      formData.set("sentiment", sentiment);
    }
    
    const result = await submitFeedback(formData);
    setIsSubmitting(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Feedback sent! Thank you.");
      setIsOpen(false);
      setSentiment(null);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 p-5 flex flex-col animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              Send Feedback
            </h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 hover:bg-slate-200 rounded-full p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">How is your experience?</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSentiment("positive")}
                  className={`flex-1 py-2 rounded-lg border flex justify-center items-center transition-colors ${
                    sentiment === "positive" 
                      ? "bg-emerald-50 border-emerald-200 text-emerald-600" 
                      : "border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                  }`}
                >
                  <Smile className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setSentiment("neutral")}
                  className={`flex-1 py-2 rounded-lg border flex justify-center items-center transition-colors ${
                    sentiment === "neutral" 
                      ? "bg-amber-50 border-amber-200 text-amber-600" 
                      : "border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                  }`}
                >
                  <Meh className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setSentiment("negative")}
                  className={`flex-1 py-2 rounded-lg border flex justify-center items-center transition-colors ${
                    sentiment === "negative" 
                      ? "bg-red-50 border-red-200 text-red-600" 
                      : "border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                  }`}
                >
                  <Frown className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <textarea 
              name="message"
              required
              placeholder="What can we improve? Or what do you love?"
              className="w-full text-sm resize-none h-24 p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Sending..." : (
                <>
                  <Send className="w-4 h-4" />
                  Send to Founder
                </>
              )}
            </Button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-5 py-3 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-medium text-sm group"
        >
          <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Feedback
        </button>
      )}
    </div>
  );
}
