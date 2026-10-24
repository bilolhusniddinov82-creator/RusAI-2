"use client";

import { useUserStore } from "@/store/user-store";
import { dictionary, type DictKey } from "./dictionary";

export function useT() {
  const lang = useUserStore((s) => s.interfaceLang);
  const dict = dictionary[lang] ?? dictionary.ru;
  return (key: DictKey) => dict[key] ?? dictionary.ru[key] ?? key;
}
