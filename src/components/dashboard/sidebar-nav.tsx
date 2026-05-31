 
"use client";

import { LayoutDashboard, Inbox, MessageSquare, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function SidebarNav() {
  const pathname = usePathname();

  const links = [
    { name: "Today", href: "/dashboard", icon: LayoutDashboard },
    { name: "Quotes", href: "/quotes", icon: Inbox },
    { name: "Templates", href: "/templates", icon: MessageSquare },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <nav className="mt-8 flex flex-col gap-1.5">
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "flex h-10 items-center gap-3 rounded-xl px-3.5 text-left text-[13px] transition-all duration-200 group",
              isActive
                ? "bg-[#F26522]/10 text-[#F26522] font-semibold"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-950 font-medium"
            )}
          >
            <Icon className={cn("size-4 shrink-0 transition-colors", isActive ? "text-[#F26522]" : "text-gray-400 group-hover:text-gray-950")} />
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
