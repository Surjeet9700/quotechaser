 
"use client";

import { Menu, Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNav } from "./sidebar-nav";
import { useState } from "react";

export function MobileNav({
  userEmail,
}: {
  userEmail: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="size-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      } />
      <SheetContent side="left" className="w-[280px] p-0 flex flex-col bg-sidebar text-sidebar-foreground border-r-0">
        <div className="flex flex-col h-full px-3 py-4">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <Clipboard />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-sm font-semibold">QuoteChaser</span>
              <span className="text-muted-foreground truncate text-xs">{userEmail}</span>
            </div>
          </div>
          
          <div onClick={() => setOpen(false)}>
            <SidebarNav />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
