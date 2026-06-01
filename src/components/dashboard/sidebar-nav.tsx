 
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
              "flex h-9 items-center gap-2.5 rounded-md px-3 text-left text-[13px] transition-all duration-200 group",
              isActive
                ? "bg-muted text-foreground font-medium"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium"
            )}
          >
            <Icon className={cn("size-4 shrink-0 transition-colors", isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")} />
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
