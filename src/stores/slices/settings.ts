import type { StateCreator } from "zustand";

// Accent color can be a named key or a hex string
export type AccentColorKey =
  | "blue" | "purple" | "pink" | "red"
  | "orange" | "yellow" | "green" | "graphite";

export type AccentColor = AccentColorKey | string; // allow hex

export const ACCENT_HEX: Record<AccentColorKey, string> = {
  blue: "#c86a52",
  purple: "#66666e",
  pink: "#c86a52",
  red: "#c86a52",
  orange: "#c86a52",
  yellow: "#c86a52",
  green: "#c86a52",
  graphite: "#9999a1",
};

const palette = new Set(["#000000", "#f4f4f6", "#66666e", "#9999a1", "#e6e6e9", "#c86a52"]);
const resolveBrandAccent = (color: string) => {
  if (typeof color !== "string") return "#c86a52";
  const hex = (ACCENT_HEX[color as AccentColorKey] ?? color).toLowerCase();
  return palette.has(hex) ? hex : "#c86a52";
};

export type DockPosition = "bottom" | "left" | "right";

export interface WallpaperSet {
  id: string;
  name: string;
  day: string;
  night: string;
  thumbnail?: string;
}

export const wallpaperSets: WallpaperSet[] = [
  {
    id: "pro-black",
    name: "MacBook Pro — Pro Black",
    day: "/wallpapers/pro-black-terracotta.png",
    night: "/wallpapers/pro-black-terracotta.png",
    thumbnail: "/wallpapers/pro-black-terracotta.png",
  },
  {
    id: "tahoe",
    name: "macOS Tahoe",
    day: "wallpapers/DefaultAerial_Tahoe_Beach.jpg",
    night: "wallpapers/DefaultAerial_Tahoe_Beach.jpg",
    thumbnail: "wallpapers/DefaultAerial_Tahoe_Beach.jpg",
  },
  {
    id: "tahoe-light",
    name: "Tahoe Light",
    day: "wallpapers/macOS_Tahoe_LightDefault.jpg",
    night: "wallpapers/DefaultAerial_Tahoe_Beach.jpg",
    thumbnail: "wallpapers/macOS_Tahoe_LightDefault.jpg",
  },
  {
    id: "tahoe-beach",
    name: "Tahoe Beach",
    day: "wallpapers/DefaultAerial_Tahoe_Beach.jpg",
    night: "wallpapers/DefaultAerial_Tahoe_Beach.jpg",
    thumbnail: "wallpapers/DefaultAerial_Tahoe_Beach.jpg",
  },
  {
    id: "ventura",
    name: "macOS Ventura",
    day: "img/ui/macOS-ventura-light.jpg",
    night: "img/ui/macOS-ventura-dark.jpg",
    thumbnail: "img/ui/macOS-ventura-light.jpg",
  },
];

export interface SettingsSlice {
  // Wallpaper
  wallpaperSets: WallpaperSet[];
  activeWallpaperSet: string;
  setActiveWallpaperSet: (id: string) => void;
  /** @deprecated use activeWallpaperSet */
  wallpaperId: string;
  setWallpaperId: (id: string) => void;
  getWallpaper: () => WallpaperSet;

  // Accent color (hex string or named key)
  accentColor: string;
  setAccentColor: (color: string) => void;
  getAccentHex: () => string;

  // Dock preferences
  dockPosition: DockPosition;
  setDockPosition: (pos: DockPosition) => void;
  dockAutoHide: boolean;
  setDockAutoHide: (v: boolean) => void;

  // Notification
  notificationSound: string;
  setNotificationSound: (sound: string) => void;
  startupSound: boolean;
  setStartupSound: (enabled: boolean) => void;
}

const loadSetting = <T>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(`macos-settings-${key}`);
    return v !== null ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

const saveSetting = (key: string, value: unknown) => {
  try {
    localStorage.setItem(`macos-settings-${key}`, JSON.stringify(value));
  } catch {
    // localStorage may be unavailable
  }
};

// Upgrade the old default once; subsequent wallpaper choices remain persistent.
const initialWallpaperSet = (() => {
  const id = loadSetting<string>("activeWallpaperSet", loadSetting<string>("wallpaperId", "pro-black"));
  if (loadSetting("wallpaperVersion", 0) < 1) {
    saveSetting("wallpaperVersion", 1);
    if (id === "tahoe" || id === "tahoe-beach") {
      saveSetting("activeWallpaperSet", "pro-black");
      saveSetting("wallpaperId", "pro-black");
      return "pro-black";
    }
  }
  return id;
})();

// Refresh legacy system-color preferences once when adopting the brand palette.
if (loadSetting("brandPaletteVersion", 0) < 1) {
  saveSetting("accentColor", "#c86a52");
  saveSetting("brandPaletteVersion", 1);
}

export const createSettingsSlice: StateCreator<SettingsSlice> = (set, get) => ({
  // Wallpaper
  wallpaperSets,
  activeWallpaperSet: initialWallpaperSet,
  setActiveWallpaperSet: (id) => {
    saveSetting("activeWallpaperSet", id);
    saveSetting("wallpaperId", id);
    set({ activeWallpaperSet: id, wallpaperId: id });
  },
  /** @deprecated */
  wallpaperId: initialWallpaperSet,
  setWallpaperId: (id) => {
    saveSetting("wallpaperId", id);
    saveSetting("activeWallpaperSet", id);
    set({ wallpaperId: id, activeWallpaperSet: id });
  },
  getWallpaper: () => {
    const id = get().activeWallpaperSet;
    return wallpaperSets.find((w) => w.id === id) ?? wallpaperSets[0];
  },

  // Accent color — stored as hex string
  accentColor: resolveBrandAccent(loadSetting("accentColor", "#c86a52")),
  setAccentColor: (color) => {
    // If named key, resolve to hex
    const hex = resolveBrandAccent(color);
    saveSetting("accentColor", hex);
    set({ accentColor: hex });
    // Apply to CSS variable
    document.documentElement.style.setProperty("--accent-primary", hex);
  },
  getAccentHex: () => {
    const color = get().accentColor;
    return resolveBrandAccent(color);
  },

  // Dock position
  dockPosition: loadSetting("dockPosition", "bottom" as DockPosition),
  setDockPosition: (pos) => {
    saveSetting("dockPosition", pos);
    set({ dockPosition: pos });
  },

  // Dock auto-hide
  dockAutoHide: loadSetting("dockAutoHide", false),
  setDockAutoHide: (v) => {
    saveSetting("dockAutoHide", v);
    set({ dockAutoHide: v });
  },

  // Notification sound
  startupSound: loadSetting("startupSound", true),
  setStartupSound: (enabled) => {
    saveSetting("startupSound", enabled);
    set({ startupSound: enabled });
  },
  notificationSound: loadSetting(
    "notificationSound",
    "music/Samantha (Legacy)-2024_08_12-6.wav"
  ),
  setNotificationSound: (sound) => {
    saveSetting("notificationSound", sound);
    set({ notificationSound: sound });
  },
});
