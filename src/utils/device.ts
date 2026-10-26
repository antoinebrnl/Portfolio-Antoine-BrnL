export type StartupDevice = "desktop" | "tablet" | "phone";

/** Decide once at launch: rotating a phone must not start the Mac sequence. */
export function getStartupDevice(): StartupDevice {
  const agent = navigator.userAgent;
  if (/iPhone|iPod|Android.*Mobile/i.test(agent)) return "phone";
  // iPadOS can advertise itself as a Mac when requesting desktop websites.
  if (/iPad|Android/i.test(agent) || (/Macintosh/i.test(agent) && navigator.maxTouchPoints > 1)) {
    return "tablet";
  }
  if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
    return Math.min(window.screen.width, window.screen.height) < 600 ? "phone" : "tablet";
  }
  return "desktop";
}
