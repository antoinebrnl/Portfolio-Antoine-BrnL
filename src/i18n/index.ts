import { format, type FormatOptions } from "date-fns";
import { cloneElement, isValidElement, useSyncExternalStore, type ReactNode } from "react";
import { fr, enUS } from "date-fns/locale";
import { translations } from "./translations";
export type Language = "fr" | "en";
const key = "portfolio-visit-language";
let language: Language | null = null;
try { const saved = sessionStorage.getItem(key); if (saved === "fr" || saved === "en") language = saved; } catch { /* Private browsing can disable storage. */ }
const listeners = new Set<() => void>();
export const getLanguage = () => language ?? "fr";
export const getLocale = () => getLanguage() === "fr" ? "fr-FR" : "en-GB";
export const dateLocale = () => getLanguage() === "fr" ? fr : enUS;
export function setLanguage(value: Language) {
  language = value;
  document.documentElement.lang = value;
  try { sessionStorage.setItem(key, value); } catch { /* Keep the in-memory choice. */ }
  listeners.forEach((notify) => notify());
}
export function useLanguage() {
  return useSyncExternalStore((notify) => { listeners.add(notify); return () => { listeners.delete(notify); }; }, () => language);
}
const english = new Map(Object.entries(translations).map(([en, fr]) => [fr, en]));
/** Translate display values only: identifiers, URLs and stored user data stay intact. */
export function localize<T>(value: T): T {
  if (typeof value === "string") {
    const text = value.trim();
    const translated = getLanguage() === "fr" ? translations[text] : english.get(text);
    return (translated === undefined ? value : value.replace(text, () => translated)) as T;
  }
  if (Array.isArray(value)) return value.map(localize) as T;
  if (isValidElement<{ children?: ReactNode }>(value) && Object.prototype.hasOwnProperty.call(value.props, "children")) {
    const children = localize(value.props.children);
    return (Array.isArray(children) ? cloneElement(value, {}, ...children) : cloneElement(value, {}, children)) as T;
  }
  return value;
}
export const markdownURL = (url: string) => getLanguage() === "en" && /^\/?markdown\/(about-me|about-site|github-stats)\.md$/.test(url) ? url.replace("markdown/", "markdown/en/") : url;

export const formatDate = (date: Parameters<typeof format>[0], pattern: string, options?: FormatOptions) => {
  const frenchPatterns: Record<string, string> = { "h:mm aa": "HH:mm", "h:mm": "HH:mm", "eee MMM d": "eee d MMM", "EEEE, MMMM d": "EEEE d MMMM" };
  return format(date, getLanguage() === "fr" ? frenchPatterns[pattern] ?? pattern : pattern, { ...options, locale: dateLocale() });
};
