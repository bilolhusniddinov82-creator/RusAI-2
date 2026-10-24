"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/speaking/exam", label: "Экзамен", icon: GraduationCap },
  { href: "/speaking", label: "Свободный разговор", icon: MessageSquare },
];

// Switches between the structured exam simulator and free conversation.
export function ModeTabs() {
  const pathname = usePathname();
  return (
    <div className="flex p-1 mb-6 rounded-xl border border-slate-800 bg-slate-900/60 w-full max-w-sm mx-auto">
      {TABS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all",
            pathname === href
              ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-accent-fg shadow"
              : "text-slate-400 hover:text-slate-200"
          )}
        >
          <Icon className="w-4 h-4" /> {label}
        </Link>
      ))}
    </div>
  );
}
