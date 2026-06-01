/* eslint-disable @next/next/no-img-element, @typescript-eslint/no-unused-vars */
import { Clipboard } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { currency } from "@/components/dashboard/utils";
import { QuoteRow } from "@/components/dashboard/types";
import { FeedbackWidget } from "@/components/dashboard/feedback-widget";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: quotes } = await supabase
    .from("quotes")
    .select("quote_amount_cents, status")
    .eq("user_id", user.id);

  const active = (quotes || []).filter((q) => q.status === "open" || q.status === "snoozed");
  const openValue = active.reduce((sum, q) => sum + q.quote_amount_cents, 0);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="bg-background hidden lg:flex flex-col border-r border-border px-4 py-6 w-[232px] shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-3 px-1 pb-6 border-b border-border">
          <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center p-1.5 shadow-sm border border-border">
            <img src="/logo.png" alt="QuoteChaser Logo" className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal dark:invert" />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="text-[14px] font-semibold tracking-tight">QuoteChaser</span>
            <span className="text-muted-foreground truncate text-[11px] font-medium">{user.email}</span>
          </div>
        </div>
        
        <SidebarNav />

        <div className="mt-auto flex items-center justify-between px-1 mb-4">
          <span className="text-xs font-semibold text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>

        <div className="bg-card rounded-2xl border border-border p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] inset-shadow-sm">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Revenue at Risk</p>
          </div>
          <p className="text-2xl font-bold tracking-tight">{currency.format(openValue / 100)}</p>
          <p className="text-muted-foreground mt-1 text-[11px] leading-relaxed font-medium">Open quotes requiring automated follow-up.</p>
        </div>
      </aside>

      {/* Main content */}
      <section className="flex flex-1 min-w-0 flex-col bg-background relative">
        <div className="flex items-center p-3 lg:hidden border-b border-border justify-between bg-background">
          <div className="flex items-center gap-2">
            <MobileNav userEmail={user.email || ""} openValue={openValue} />
            <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center p-1 shadow-sm border border-border">
              <img src="/logo.png" alt="QuoteChaser" className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal dark:invert" />
            </div>
            <span className="font-semibold text-sm tracking-tight">QuoteChaser</span>
          </div>
          <ThemeToggle />
        </div>
        {children}
        <FeedbackWidget />
      </section>
    </div>
  );
}
