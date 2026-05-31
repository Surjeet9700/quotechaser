/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { CalendarClock, Clock3, DollarSign, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "amber" | "blue" | "green";

const toneClasses: Record<Tone, string> = {
  amber: "bg-[#E8704E]/5 text-[#E8704E] border border-[#E8704E]/10",
  blue: "bg-blue-50 text-blue-600 border border-blue-100/30",
  green: "bg-[#22C55E]/5 text-[#22C55E] border border-[#22C55E]/10",
  neutral: "bg-gray-50 text-gray-700 border border-gray-100",
};

function MetricCard({
  detail,
  icon: Icon,
  label,
  tone = "neutral",
  value,
}: {
  detail: string;
  icon: typeof Clock3;
  label: string;
  tone?: Tone;
  value: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] transition-all duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex items-start justify-between relative overflow-hidden group">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">{label}</span>
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 mt-1.5">{value}</span>
        <span className="text-gray-400 dark:text-gray-500 text-[11px] mt-1 font-medium leading-relaxed">{detail}</span>
      </div>
      <div
        className={cn("flex size-9 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 shrink-0", toneClasses[tone])}
      >
        <Icon className="w-4 h-4" />
      </div>
    </div>
  );
}

export function MetricCards({
  due,
  openValue,
  overdue,
  wonValue,
}: {
  due: number;
  openValue: number;
  overdue: number;
  wonValue: number;
}) {
  const fmt = new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  });

  return (
    <div className="grid gap-3 md:grid-cols-4">
      <MetricCard icon={Clock3} label="Due today" value={String(due)} detail="Ready for outreach" />
      <MetricCard
        icon={CalendarClock}
        label="Overdue"
        value={String(overdue)}
        detail="Needs attention"
        tone="amber"
      />
      <MetricCard
        icon={DollarSign}
        label="Open quote value"
        value={fmt.format(openValue / 100)}
        detail="Still recoverable"
        tone="blue"
      />
      <MetricCard
        icon={Trophy}
        label="Won value"
        value={fmt.format(wonValue / 100)}
        detail="Recovered by QuoteChaser"
        tone="green"
      />
    </div>
  );
}
