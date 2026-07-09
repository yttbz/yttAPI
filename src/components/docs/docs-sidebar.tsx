"use client";

import * as React from "react";
import { NAV } from "@/lib/docs-data";
import { cn } from "@/lib/utils";

export function DocsSidebar({
  active,
  onSelect,
  className,
}: {
  active: string;
  onSelect: (id: string) => void;
  className?: string;
}) {
  return (
    <nav className={cn("flex flex-col gap-6 px-4 py-6", className)}>
      {NAV.map((group) => (
        <div key={group.label}>
          <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            {group.label}
          </div>
          <ul className="space-y-0.5">
            {group.items.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onSelect(item.id)}
                  className={cn(
                    "w-full text-left rounded-md px-3 py-1.5 text-sm transition-colors",
                    active === item.id
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
