 
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function StripeButton({ isSubscribed }: { isSubscribed: boolean }) {
  const [loading, setLoading] = useState(false);

  const handleStripe = async () => {
    setLoading(true);
    try {
      const res = await fetch(isSubscribed ? "/api/stripe/portal" : "/api/stripe/checkout", {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleStripe}
      disabled={loading}
      className={cn(
        "rounded-full font-semibold text-[12px] uppercase tracking-wider px-5 h-9 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-sm shrink-0 border",
        isSubscribed
          ? "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
          : "bg-[#F26522] hover:bg-[#e05a1a] text-white border-none hover:scale-[1.02]"
      )}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : null}
      <span>{isSubscribed ? "Manage Billing" : "Upgrade to Pro"}</span>
    </Button>
  );
}
