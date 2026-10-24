"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/user-store";

// Applies the persisted theme preference to <html> on the client. Kept as
// its own tiny component so the root layout can stay a server component.
export function ThemeSync() {
  const theme = useUserStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return null;
}
