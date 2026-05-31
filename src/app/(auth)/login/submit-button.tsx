"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from "lucide-react";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="w-full bg-[#F26522] hover:bg-[#e05a1a] text-white rounded-full font-semibold h-10 flex items-center justify-center gap-2 border-none shadow-sm transition-all duration-200 cursor-pointer hover:scale-[1.02] mt-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
      <span>{pending ? "Sending..." : "Send magic link"}</span>
    </Button>
  );
}
