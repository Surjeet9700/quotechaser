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
    <div className="flex min-h-screen bg-[#F9F9F9] dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 hidden lg:flex flex-col border-r border-gray-100 dark:border-gray-800 px-4 py-6 w-[232px] shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-3 px-1 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center p-1.5 shadow-sm border border-gray-100 dark:border-gray-800">
            <img src="/logo.png" alt="QuoteChaser Logo" className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal dark:invert" />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="text-[14px] font-semibold text-gray-900 dark:text-gray-100 tracking-tight">QuoteChaser</span>
            <span className="text-gray-400 dark:text-gray-500 truncate text-[11px] font-medium">{user.email}</span>
          </div>
        </div>
        
        <SidebarNav />

        <div className="mt-auto flex items-center justify-between px-1 mb-4">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Theme</span>
          <ThemeToggle />
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] dark:shadow-none">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F26522] animate-pulse" />
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">Revenue at Risk</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">{currency.format(openValue / 100)}</p>
          <p className="text-gray-400 dark:text-gray-500 mt-1 text-[11px] leading-relaxed font-medium">Open quotes requiring automated follow-up.</p>
        </div>
      </aside>

      {/* Main content */}
      <section className="flex flex-1 min-w-0 flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 relative">
        <div className="flex items-center p-3 lg:hidden border-b border-gray-100 dark:border-gray-800 justify-between bg-white dark:bg-gray-950">
          <div className="flex items-center gap-2">
            <MobileNav userEmail={user.email || ""} openValue={openValue} />
            <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center p-1 shadow-sm border border-gray-100 dark:border-gray-800">
              <img src="/logo.png" alt="QuoteChaser" className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal dark:invert" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm tracking-tight">QuoteChaser</span>
          </div>
          <ThemeToggle />
        </div>
        {children}
        <FeedbackWidget />
      </section>
    </div>
  );
}
