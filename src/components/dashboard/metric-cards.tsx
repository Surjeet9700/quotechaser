"use client";

import { CalendarClock, Clock3, DollarSign, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "amber" | "blue" | "green";

const toneClasses: Record<Tone, string> = {
  amber: "text-amber-500",
  blue: "text-blue-500",
  green: "text-green-500",
  neutral: "text-muted-foreground",
};

function MetricCard({
  icon: Icon,
  label,
  tone = "neutral",
  value,
}: {
  icon: typeof Clock3;
  label: string;
  tone?: Tone;
  value: string;
}) {
  return (
    <div className="bg-background rounded-md border border-border p-4 shadow-sm flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
        <Icon className={cn("w-3.5 h-3.5", toneClasses[tone])} />
        <span className="text-[12px] font-medium">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-semibold tracking-tight text-foreground">{value}</span>
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
      <MetricCard icon={Clock3} label="Due today" value={String(due)} />
      <MetricCard
        icon={CalendarClock}
        label="Overdue"
        value={String(overdue)}
        tone="amber"
      />
      <MetricCard
        icon={DollarSign}
        label="Open quote value"
        value={fmt.format(openValue / 100)}
        tone="blue"
      />
      <MetricCard
        icon={Trophy}
        label="Won value"
        value={fmt.format(wonValue / 100)}
        tone="green"
      />
    </div>
  );
}
