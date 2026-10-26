import { getLanguage } from "~/i18n";
import { localize } from "~/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useStore } from "~/stores";
import { useWindowSize } from "~/hooks";

type SettingsPanel =
  | "general"
  | "accessibility"
  | "appearance"
  | "control-center"
  | "siri"
  | "desktop"
  | "displays"
  | "spotlight"
  | "wallpaper"
  | "notifications"
  | "sound"
  | "focus"
  | "screen-time"
  | "privacy"
  | "touch-id"
  | "users"
  | "internet-accounts"
  | "game-center"
  | "wallet"
  | "keyboard"
  | "mouse"
  | "trackpad"
  | "printers"
  | "about"
  | "weather"
  | "battery"
  | "storage"
  | "dock"
  | "cloud"
  | "network"
  | "bluetooth"
  | "wifi";

interface PanelItem {
  id: SettingsPanel;
  label: string;
  icon: string;
  color: string;
}

const PANEL_ITEMS: PanelItem[] = [
  { id: "wifi", label: "Wi-Fi", icon: "/img/icons/sf-icons/wifi.svg", color: "var(--brand-link)" },
  { id: "bluetooth", label: "Bluetooth", icon: "/img/icons/sf-icons/bluetooth.svg", color: "var(--brand-link)" },
  { id: "network", label: "Network", icon: "/img/icons/sf-icons/network.svg", color: "var(--brand-link)" },
  { id: "notifications", label: "Notifications", icon: "/img/icons/sf-icons/notifications.svg", color: "#C86A52" },
  { id: "sound", label: "Sound", icon: "/img/icons/sf-icons/sound.svg", color: "var(--brand-link)" },
  { id: "focus", label: "Focus", icon: "/img/icons/sf-icons/focus.svg", color: "#66666e" },
  { id: "screen-time", label: "Screen Time", icon: "/img/icons/sf-icons/screen-time.svg", color: "#66666e" },
  { id: "general", label: "General", icon: "/img/icons/sf-icons/general.svg", color: "#9999a1" },
  { id: "appearance", label: "Appearance", icon: "/img/icons/sf-icons/appearance.svg", color: "#000000" },
  { id: "accessibility", label: "Accessibility", icon: "/img/icons/sf-icons/accessibility.svg", color: "var(--brand-link)" },
  { id: "control-center", label: "Control Center", icon: "/img/icons/sf-icons/control-center.svg", color: "#9999a1" },
  { id: "siri", label: "Siri & Spotlight", icon: "/img/icons/sf-icons/siri.svg", color: "#66666e" },
  { id: "spotlight", label: "Spotlight", icon: "/img/icons/sf-icons/spotlight.svg", color: "#9999a1" },
  { id: "privacy", label: "Privacy & Security", icon: "/img/icons/sf-icons/privacy.svg", color: "var(--brand-link)" },
  { id: "desktop", label: "Desktop", icon: "/img/icons/sf-icons/desktop.svg", color: "#66666e" },
  { id: "dock", label: "Dock & Menu Bar", icon: "/img/icons/sf-icons/dock.svg", color: "#9999a1" },
  { id: "displays", label: "Displays", icon: "/img/icons/sf-icons/displays.svg", color: "var(--brand-link)" },
  { id: "wallpaper", label: "Wallpaper", icon: "/img/icons/sf-icons/wallpaper.svg", color: "#9999a1" },
  { id: "battery", label: "Battery", icon: "/img/icons/sf-icons/battery.svg", color: "#66666e" },
  { id: "storage", label: "Storage", icon: "/img/icons/sf-icons/storage.svg", color: "#66666e" },
  { id: "cloud", label: "Cloud Storage", icon: "/img/icons/sf-icons/cloud.svg", color: "var(--brand-link)" },
  { id: "touch-id", label: "Touch ID & Password", icon: "/img/icons/sf-icons/touch-id.svg", color: "var(--brand-link)" },
  { id: "users", label: "Users & Groups", icon: "/img/icons/sf-icons/users.svg", color: "#9999a1" },
  { id: "internet-accounts", label: "Internet Accounts", icon: "/img/icons/sf-icons/internet-accounts.svg", color: "var(--brand-link)" },
  { id: "game-center", label: "Game Center", icon: "/img/icons/sf-icons/game-center.svg", color: "#66666e" },
  { id: "wallet", label: "Wallet & Apple Pay", icon: "/img/icons/sf-icons/wallet.svg", color: "#000000" },
  { id: "keyboard", label: "Keyboard", icon: "/img/icons/sf-icons/keyboard.svg", color: "#9999a1" },
  { id: "mouse", label: "Mouse", icon: "/img/icons/sf-icons/mouse.svg", color: "#9999a1" },
  { id: "trackpad", label: "Trackpad", icon: "/img/icons/sf-icons/trackpad.svg", color: "#9999a1" },
  { id: "printers", label: "Printers & Scanners", icon: "/img/icons/sf-icons/printer.svg", color: "#9999a1" },
  { id: "weather", label: "Weather", icon: "/img/icons/sf-icons/sun.max.svg", color: "var(--brand-link)" },
  { id: "about", label: "About", icon: "/img/icons/sf-icons/about.svg", color: "#9999a1" }
];

const PANEL_GROUPS = [
  ["screen-time"],
  ["general", "accessibility", "privacy"],
  ["touch-id"],
  ["network", "wifi", "bluetooth"],
  ["notifications", "sound", "focus"],
  ["desktop", "dock", "displays", "wallpaper", "battery", "storage", "cloud"],
  ["users", "internet-accounts", "game-center", "wallet"],
  ["keyboard", "mouse", "trackpad", "printers"],
  ["weather", "about"]
];

// ─── Shared sub-components ────────────────────────────────────────────────────
// ─── Shared sub-components ────────────────────────────────────────────────────
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => {
  const dark = useStore((s) => s.dark);
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: "36px",
        height: "20px",
        borderRadius: "10px",
        background: checked ? "#c86a52" : dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)",
        position: "relative",
        cursor: "pointer",
        transition: "background-color 0.2s ease",
      }}
    >
      <motion.div
        animate={{ x: checked ? 17 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
          position: "absolute",
          top: "2px",
        }}
      />
    </div>
  );
};

const Select = ({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[] | { label: string; value: string }[];
}) => {
  const dark = useStore((s) => s.dark);
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        fontSize: "12px",
        background: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.05)",
        border: "none",
        borderRadius: "6px",
        padding: "4px 8px",
        cursor: "pointer",
        color: dark ? "#fff" : "#000000",
        outline: "none",
      }}
    >
      {localize(options.map((opt) => {
        const label = typeof opt === "string" ? opt : opt.label;
        const val = typeof opt === "string" ? opt : opt.value;
        return (
          <option
            key={val}
            value={val}
            style={{
              background: dark ? "#1e1e1e" : "#fff",
              color: dark ? "#fff" : "#000000",
            }}
          >
            {localize(label)}
          </option>
        );
      }))}
    </select>
  );
};

const Row = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  const dark = useStore((s) => s.dark);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        borderBottom: dark ? "0.5px solid rgba(255,255,255,0.08)" : "0.5px solid rgba(0,0,0,0.06)",
      }}
    >
      <span style={{ fontSize: "13px", color: dark ? "#f4f4f6" : "#000000" }}>{localize(label)}</span>
      {localize(children)}
    </div>
  );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => {
  const dark = useStore((s) => s.dark);
  return (
    <div
      style={{
        fontSize: "11px",
        fontWeight: 700,
        color: dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        padding: "12px 16px 4px",
      }}
    >
      {localize(children)}
    </div>
  );
};

const Card = ({ children }: { children: React.ReactNode }) => {
  const dark = useStore((s) => s.dark);
  return (
    <div
      style={{
        background: dark ? "rgba(45,45,45,0.5)" : "rgba(255,255,255,0.75)",
        border: dark ? "0.5px solid rgba(255,255,255,0.12)" : "0.5px solid rgba(0,0,0,0.08)",
        borderRadius: "12px",
        margin: "0 16px 12px",
        overflow: "hidden",
      }}
    >
      {localize(children)}
    </div>
  );
};

// ─── Panel Components ─────────────────────────────────────────────────────────
const GeneralPanel = () => {

  const dark = useStore((s) => s.dark);
  return (
    <div>
      <SectionTitle>{localize("Language & Region")}</SectionTitle>
      <Card>
        <Row label={localize("Language")}>
          <span>{getLanguage() === "fr" ? "Français" : "English"}</span>
        </Row>
        <Row label={localize("Region")}>
          <span style={{ fontSize: "12px", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{getLanguage() === "fr" ? "France" : "United Kingdom"}</span>
        </Row>
      </Card>
      <SectionTitle>{localize("Sharing")}</SectionTitle>
      <Card>
        <Row label={localize("Computer Name")}>
          <span style={{ fontSize: "12px", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{localize("Antoine's MacBook Pro")}</span>
        </Row>
      </Card>
    </div>
  );
};

const AppearancePanel = () => {
  const dark = useStore((s) => s.dark);
  const {
    accentColor, setAccentColor,
    appearanceMode, setAppearanceMode,
    iconStyle, setIconStyle,
    tintWindows, setTintWindows,
    getWallpaper,
  } = useStore((s) => ({
    accentColor: s.accentColor,
    setAccentColor: s.setAccentColor,
    appearanceMode: s.appearanceMode,
    setAppearanceMode: s.setAppearanceMode,
    iconStyle: s.iconStyle,
    setIconStyle: s.setIconStyle,
    tintWindows: s.tintWindows,
    setTintWindows: s.setTintWindows,
    getWallpaper: s.getWallpaper,
  }));

  const wallpaper = getWallpaper();
  const colors = [{ label: "Terracotta", value: "#C86A52" }];

  const appearanceOptions: { label: string; value: "auto" | "light" | "dark"; preview: string }[] = [
    { label: "Auto", value: "auto", preview: "linear-gradient(135deg,#f4f4f6 0% 50%,#000000 50% 100%)" },
    { label: "Light", value: "light", preview: "linear-gradient(135deg,#f4f4f6,#e6e6e9)" },
    { label: "Dark", value: "dark", preview: "linear-gradient(135deg,#2c2c2e,#000000)" },
  ];

  const iconStyles: { label: string; value: "default" | "dark" | "clear" | "tinted"; preview: string }[] = [
    { label: "Default", value: "default", preview: "linear-gradient(135deg,#C86A52,#66666e)" },
    { label: "Dark", value: "dark", preview: "linear-gradient(135deg,#3a3a3c,#000000)" },
    { label: "Clear", value: "clear", preview: "linear-gradient(135deg,rgba(255,255,255,0.5),rgba(200,200,210,0.35))" },
    { label: "Tinted", value: "tinted", preview: `linear-gradient(135deg,${accentColor},${accentColor}99)` },
  ];

  return (
    <div>
      <SectionTitle>{localize("Appearance")}</SectionTitle>
      <Card>
        <div style={{ padding: "12px 16px", display: "flex", gap: "12px" }}>
          {localize(appearanceOptions.map((opt) => {
            const active = appearanceMode === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setAppearanceMode(opt.value)}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "46px",
                    borderRadius: "8px",
                    backgroundImage: `url(${wallpaper.day})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                    overflow: "hidden",
                    border: active ? "2px solid #c86a52" : dark ? "2px solid rgba(255,255,255,0.12)" : "2px solid rgba(0,0,0,0.1)",
                    boxShadow: "inset 0 0 0 100px transparent",
                  }}
                >
                  <div style={{ position: "absolute", inset: 0, background: opt.preview, opacity: 0.55 }} />
                </div>
                <span style={{ fontSize: "12px", fontWeight: active ? 600 : 400, color: dark ? "#f4f4f6" : "#000000" }}>
                  {localize(opt.label)}
                </span>
              </button>
            );
          }))}
        </div>
      </Card>

      <SectionTitle>{localize("Theme")}</SectionTitle>
      <Card>
        <Row label={localize("Color")}>
          <div style={{ display: "flex", gap: "7px", alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
            {localize(colors.map((c) => (
              <button
                key={c.value}
                title={localize(c.label)}
                onClick={() => setAccentColor(c.value)}
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: c.value,
                  border:
                    accentColor === c.value
                      ? dark
                        ? "2px solid rgba(255,255,255,0.75)"
                        : "2px solid rgba(0,0,0,0.5)"
                      : "2px solid transparent",
                  cursor: "pointer",
                  outline: accentColor === c.value ? `1.5px solid ${c.value}` : "none",
                  outlineOffset: "1.5px",
                  padding: 0,
                  transition: "outline 0.15s ease",
                }}
              />
            )))}
          </div>
        </Row>
        <Row label={localize("Text highlight color")}>
          <Select value="Automatic" onChange={() => {}} options={["Automatic", "Blue", "Purple", "Pink", "Red", "Orange", "Green"]} />
        </Row>
      </Card>

      <SectionTitle>{localize("Icon & Widget Style")}</SectionTitle>
      <Card>
        <div style={{ padding: "12px 16px", display: "flex", gap: "10px" }}>
          {localize(iconStyles.map((opt) => {
            const active = iconStyle === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setIconStyle(opt.value)}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "10px",
                    background: opt.preview,
                    border: active ? "2px solid #c86a52" : dark ? "2px solid rgba(255,255,255,0.12)" : "2px solid rgba(0,0,0,0.1)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                  }}
                />
                <span style={{ fontSize: "11px", fontWeight: active ? 600 : 400, color: dark ? "#f4f4f6" : "#000000" }}>
                  {localize(opt.label)}
                </span>
              </button>
            );
          }))}
        </div>
        <Row label={localize("Folder color")}>
          <Select value="Automatic" onChange={() => {}} options={["Automatic", "Blue", "Graphite", "Green", "Orange"]} />
        </Row>
      </Card>

      <SectionTitle>{localize("Windows")}</SectionTitle>
      <Card>
        <Row label={localize("Sidebar icon size")}>
          <Select value="Medium" onChange={() => {}} options={["Small", "Medium", "Large"]} />
        </Row>
        <Row label={localize("Tint window background with wallpaper color")}>
          <Toggle checked={tintWindows} onChange={setTintWindows} />
        </Row>
      </Card>
    </div>
  );
};

const WallpaperPanel = () => {
  const { wallpaperSets, activeWallpaperSet, setActiveWallpaperSet } = useStore((s) => ({
    wallpaperSets: s.wallpaperSets,
    activeWallpaperSet: s.activeWallpaperSet,
    setActiveWallpaperSet: s.setActiveWallpaperSet,
  }));
  const dark = useStore((s) => s.dark);

  return (
    <div>
      <SectionTitle>{localize("Wallpaper")}</SectionTitle>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
          padding: "0 16px",
        }}
      >
        {localize(wallpaperSets.map((set) => {
          const active = set.id === activeWallpaperSet;
          const preview = dark ? set.night : set.day;
          return (
            <motion.button
              key={set.id}
              onClick={() => setActiveWallpaperSet(set.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "none",
                border: active ? "2.5px solid #c86a52" : "2.5px solid transparent",
                borderRadius: "12px",
                padding: "0",
                cursor: "pointer",
                overflow: "hidden",
                position: "relative",
                transition: "border-color 0.2s ease",
              }}
            >
              <img
                src={preview}
                alt={localize(set.name)}
                style={{ width: "100%", height: "90px", objectFit: "cover", display: "block", borderRadius: "10px" }}
              />
              {localize(active && (
                <div
                  style={{
                    position: "absolute",
                    top: "6px",
                    right: "6px",
                    background: "var(--brand-cta)",
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    color: "var(--brand-cta-ink)",
                  }}
                >
                  {localize("✓")}</div>
              ))}
              <div
                style={{
                  padding: "4px 8px",
                  fontSize: "11px",
                  color: active ? "#c86a52" : dark ? "#f4f4f6" : "#000000",
                  fontWeight: active ? 600 : 400,
                  textAlign: "left",
                }}
              >
                {localize(set.name)}
              </div>
            </motion.button>
          );
        }))}
      </div>
    </div>
  );
};

const DockPanel = () => {
  const {
    dockSize,
    dockMag,
    setDockSize,
    setDockMag,
    dockPosition,
    setDockPosition,
    dockAutoHide,
    setDockAutoHide,
  } = useStore((s) => ({
    dockSize: s.dockSize,
    dockMag: s.dockMag,
    setDockSize: s.setDockSize,
    setDockMag: s.setDockMag,
    dockPosition: s.dockPosition,
    setDockPosition: s.setDockPosition,
    dockAutoHide: s.dockAutoHide,
    setDockAutoHide: s.setDockAutoHide,
  }));

  const SliderRow = ({
    label,
    value,
    min,
    max,
    onChange,
    displayVal,
  }: {
    label: string;
    value: number;
    min: number;
    max: number;
    onChange: (v: number) => void;
    displayVal?: string;
  }) => {
    const dark = useStore((s) => s.dark);
    return (
      <Row label={localize(label)}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{ width: "120px", accentColor: "var(--brand-cta)" }}
          />
          <span style={{ fontSize: "11px", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", minWidth: "30px", textAlign: "right" }}>
            {localize(displayVal ?? value)}
          </span>
        </div>
      </Row>
    );
  };

  return (
    <div>
      <SectionTitle>{localize("Size & Magnification")}</SectionTitle>
      <Card>
        <SliderRow label={localize("Size")} value={dockSize} min={32} max={80} onChange={setDockSize} displayVal={`${dockSize}px`} />
        <SliderRow label={localize("Magnification")} value={dockMag} min={1} max={2.5} onChange={(v) => setDockMag(parseFloat(v.toFixed(1)))} displayVal={`${dockMag}×`} />
      </Card>

      <SectionTitle>{localize("Position & Behavior")}</SectionTitle>
      <Card>
        <Row label={localize("Position on Screen")}>
          <Select
            value={dockPosition}
            onChange={(pos) => setDockPosition(pos as any)}
            options={[
              { label: "Bottom", value: "bottom" },
              { label: "Left", value: "left" },
              { label: "Right", value: "right" },
            ]}
          />
        </Row>
        <Row label={localize("Automatically hide and show the Dock")}>
          <Toggle checked={dockAutoHide} onChange={setDockAutoHide} />
        </Row>
      </Card>
    </div>
  );
};

const NotificationsPanel = () => {
  const [showPreviews, setShowPreviews] = useState("When Unlocked");
  const [allowNotifications, setAllowNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState({
    Safari: true,
    FaceTime: true,
    Mail: false,
    Messages: true,
    Calendar: true,
    Music: false,
  });

  return (
    <div>
      <SectionTitle>{localize("Focus & Previews")}</SectionTitle>
      <Card>
        <Row label={localize("Show Previews")}>
          <Select
            value={showPreviews}
            onChange={setShowPreviews}
            options={["Always", "When Unlocked", "Never"]}
          />
        </Row>
        <Row label={localize("Allow Notifications")}>
          <Toggle checked={allowNotifications} onChange={setAllowNotifications} />
        </Row>
      </Card>

      <SectionTitle>{localize("App Notifications")}</SectionTitle>
      <Card>
        {localize(Object.entries(appNotifications).map(([app, enabled]) => (
          <Row key={app} label={localize(app)}>
            <Toggle
              checked={enabled}
              onChange={(val) =>
                setAppNotifications((prev) => ({ ...prev, [app]: val }))
              }
            />
          </Row>
        )))}
      </Card>
    </div>
  );
};

const SoundPanel = () => {
  const { volume, setVolume } = useStore((s) => ({
    volume: s.volume,
    setVolume: s.setVolume,
  }));
  const { notificationSound, setNotificationSound } = useStore((s) => ({
    notificationSound: s.notificationSound,
    setNotificationSound: s.setNotificationSound,
  }));
  const [outputDevice, setOutputDevice] = useState("MacBook Pro Speakers");
  const [inputDevice, setInputDevice] = useState("MacBook Pro Microphone");
  const startupSound = useStore((s) => s.startupSound);
  const setStartupSound = useStore((s) => s.setStartupSound);

  const alertSounds = [
    { label: "Samantha (Legacy)", value: "music/Samantha (Legacy)-2024_08_12-6.wav" },
    { label: "Default Intro", value: "music/into.wav" },
    { label: "iPhone Notification", value: "music/i_phone_notification.mp3" },
    { label: "Error Alert", value: "music/error.wav" },
    { label: "Siri Sound", value: "music/siri.mp3" },
    { label: "Antoine Intro", value: "music/akashintro.wav" },
  ];

  const handleSoundChange = (val: string) => {
    setNotificationSound(val);
    const audio = new Audio(val);
    audio.volume = volume / 100;
    audio.play().catch(() => {});
  };

  const dark = useStore((s) => s.dark);

  return (
    <div>
      <SectionTitle>{localize("Sound Effects")}</SectionTitle>
      <Card>
        <Row label={localize("Alert Sound")}>
          <Select
            value={notificationSound}
            onChange={handleSoundChange}
            options={alertSounds}
          />
        </Row>
        <Row label={localize("Play sound on startup")}>
          <Toggle checked={startupSound} onChange={setStartupSound} />
        </Row>
      </Card>

      <SectionTitle>{localize("Volume")}</SectionTitle>
      <Card>
        <Row label={localize("Output Volume")}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, justifyContent: "flex-end" }}>
            <img src="/img/icons/sf-icons/audio.svg" alt={localize("audio")} style={{ width: "16px", height: "16px", filter: dark ? "invert(1)" : "none", opacity: 0.5 }} />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              style={{ width: "120px", accentColor: "var(--brand-cta)" }}
            />
            <img src="/img/icons/sf-icons/sound.svg" alt={localize("sound")} style={{ width: "16px", height: "16px", filter: dark ? "invert(1)" : "none", opacity: 0.5 }} />
            <span style={{ fontSize: "11px", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", minWidth: "30px", textAlign: "right" }}>
              {localize(volume)}{localize("%")}</span>
          </div>
        </Row>
      </Card>

      <SectionTitle>{localize("Input & Output")}</SectionTitle>
      <Card>
        <Row label={localize("Output Device")}>
          <Select
            value={outputDevice}
            onChange={setOutputDevice}
            options={[
              "MacBook Pro Speakers",
              "External Display Audio",
              "AirPods Pro"
            ]}
          />
        </Row>
        <Row label={localize("Input Device")}>
          <Select
            value={inputDevice}
            onChange={setInputDevice}
            options={[
              "MacBook Pro Microphone",
              "External USB Microphone"
            ]}
          />
        </Row>
      </Card>
    </div>
  );
};

const DisplaysPanel = () => {
  const { brightness, setBrightness } = useStore((s) => ({
    brightness: s.brightness,
    setBrightness: s.setBrightness,
  }));
  const [resolution, setResolution] = useState("Default (2880 x 1800)");
  const [refreshRate, setRefreshRate] = useState("120Hz");
  const [trueTone, setTrueTone] = useState(true);

  const getWallpaper = useStore((s) => s.getWallpaper);
  const dark = useStore((s) => s.dark);
  const wallpaper = getWallpaper();
  const bgUrl = dark ? wallpaper.night : wallpaper.day;

  return (
    <div>
      {/* Mini Display Simulator */}
      <div style={{ display: "flex", justifyContent: "center", padding: "24px 16px 16px" }}>
        <div
          style={{
            width: "180px",
            height: "112px",
            border: "6px solid #2c2c2e",
            borderRadius: "10px",
            position: "relative",
            background: `url(${bgUrl}) center/cover no-repeat`,
            filter: `brightness(${30 + (brightness * 0.7)}%)`,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingBottom: "8px",
            transition: "filter 0.1s ease",
          }}
        >
          {/* Dock preview */}
          <div
            style={{
              width: "80px",
              height: "8px",
              background: "rgba(255,255,255,0.4)",
              backdropFilter: "blur(4px)",
              borderRadius: "3px",
            }}
          />
          {/* Monitor stand */}
          <div
            style={{
              position: "absolute",
              bottom: "-16px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "24px",
              height: "10px",
              background: "#48484a",
              borderRadius: "2px",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-20px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "48px",
              height: "4px",
              background: "#3a3a3c",
              borderRadius: "2px 2px 0 0",
            }}
          />
        </div>
      </div>

      <SectionTitle>{localize("Brightness")}</SectionTitle>
      <Card>
        <Row label={localize("Brightness")}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, justifyContent: "flex-end" }}>
            <img src="/img/icons/sf-icons/display-brightness.svg" alt={localize("dim")} style={{ width: "16px", height: "16px", filter: dark ? "invert(1)" : "none", opacity: 0.5 }} />
            <input
              type="range"
              min="10"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              style={{ width: "120px", accentColor: "var(--brand-cta)" }}
            />
            <img src="/img/icons/sf-icons/sun.svg" alt={localize("sun")} style={{ width: "16px", height: "16px", filter: dark ? "invert(1)" : "none", opacity: 0.5 }} />
            <span style={{ fontSize: "11px", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", minWidth: "30px", textAlign: "right" }}>
              {localize(brightness)}{localize("%")}</span>
          </div>
        </Row>
        <Row label={localize("True Tone")}>
          <Toggle checked={trueTone} onChange={setTrueTone} />
        </Row>
      </Card>

      <SectionTitle>{localize("Resolution & Refresh Rate")}</SectionTitle>
      <Card>
        <Row label={localize("Resolution")}>
          <Select
            value={resolution}
            onChange={setResolution}
            options={[
              "Default (2880 x 1800)",
              "Scaled (1920 x 1200)",
              "Scaled (2560 x 1600)",
              "More Space (3024 x 1964)",
            ]}
          />
        </Row>
        <Row label={localize("Refresh Rate")}>
          <Select
            value={refreshRate}
            onChange={setRefreshRate}
            options={["60Hz", "120Hz (ProMotion)"]}
          />
        </Row>
      </Card>
    </div>
  );
};

const BatteryPanel = () => {
  const [lowPowerMode, setLowPowerMode] = useState(false);
  const [optimizedCharging, setOptimizedCharging] = useState(true);
  const batteryLevels = [98, 96, 94, 92, 90, 85, 80, 78, 75, 70, 68, 64, 60, 55, 92, 94];
  const dark = useStore((s) => s.dark);

  return (
    <div>
      {/* Battery Status Display */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px 12px" }}>
        <div style={{ position: "relative", width: "80px", height: "40px", border: `3.5px solid ${dark ? "#fff" : "#000000"}`, borderRadius: "8px", display: "flex", alignItems: "center", padding: "2px" }}>
          <div
            style={{
              height: "100%",
              width: "94%",
              background: lowPowerMode ? "#FFCC00" : "#34C759",
              borderRadius: "4px",
              transition: "background-color 0.2s ease, width 0.3s ease",
            }}
          />
          {/* Battery nub */}
          <div
            style={{
              position: "absolute",
              right: "-8px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "5px",
              height: "12px",
              background: dark ? "#fff" : "#000000",
              borderRadius: "0 2px 2px 0",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "0",
              right: "0",
              textAlign: "center",
              fontSize: "12px",
              fontWeight: 700,
              color: dark ? "#000" : "#fff",
              textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            {localize("94%")}</div>
        </div>
        <div style={{ fontSize: "14px", fontWeight: 600, color: dark ? "#fff" : "#000000", marginTop: "12px" }}>
          {localize("Power Source: Battery")}</div>
        <div style={{ fontSize: "12px", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", marginTop: "2px" }}>
          {localize("Battery Health: 100% (Maximum Capacity)")}</div>
      </div>

      <SectionTitle>{localize("Battery Settings")}</SectionTitle>
      <Card>
        <Row label={localize("Low Power Mode")}>
          <Toggle checked={lowPowerMode} onChange={setLowPowerMode} />
        </Row>
        <Row label={localize("Optimized Battery Charging")}>
          <Toggle checked={optimizedCharging} onChange={setOptimizedCharging} />
        </Row>
      </Card>

      <SectionTitle>{localize("Battery level (Last 24 Hours)")}</SectionTitle>
      <Card>
        <div style={{ padding: "16px 16px 8px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              height: "80px",
              borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              paddingBottom: "4px",
            }}
          >
            {localize(batteryLevels.map((level, i) => (
              <div
                key={i}
                style={{
                  width: "8px",
                  height: `${level * 0.7}px`,
                  background: lowPowerMode ? "#FFCC00" : level < 20 ? "#FF3B30" : "#34C759",
                  borderRadius: "2px",
                  transition: "background-color 0.2s ease, height 0.3s ease",
                }}
                title={localize(`${level}%`)}
              />
            )))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
            <span style={{ fontSize: "9px", color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>{localize("24h ago")}</span>
            <span style={{ fontSize: "9px", color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>{localize("12h ago")}</span>
            <span style={{ fontSize: "9px", color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>{localize("Now")}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

const StoragePanel = () => {
  const dark = useStore((s) => s.dark);
  const totalSize = 512;
  const storageCategories = [
    { name: "System Data", size: 64, color: "#9999a1" },
    { name: "Apps", size: 42, color: "#FF3B30" },
    { name: "Documents", size: 120, color: "#34C759" },
    { name: "Developer", size: 85, color: "var(--brand-link)" },
    { name: "Free Space", size: 201, color: "rgba(0,0,0,0.08)" },
  ];

  return (
    <div>
      <div style={{ padding: "16px 16px 4px" }}>
        <div style={{ fontSize: "14px", fontWeight: 600, color: dark ? "#fff" : "#000000" }}>
          {localize("Macintosh HD")}</div>
        <div style={{ fontSize: "12px", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", marginTop: "2px" }}>
          {localize("311 GB used of 512 GB")}</div>
      </div>

      {/* Storage stacked bar */}
      <div
        style={{
          display: "flex",
          height: "20px",
          borderRadius: "10px",
          overflow: "hidden",
          margin: "12px 16px 20px",
          border: dark ? "0.5px solid rgba(255,255,255,0.15)" : "0.5px solid rgba(0,0,0,0.08)",
          background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
        }}
      >
        {localize(storageCategories.map((cat) => {
          const pct = (cat.size / totalSize) * 100;
          return (
            <div
              key={cat.name}
              style={{
                width: `${pct}%`,
                background: cat.name === "Free Space" && dark ? "rgba(255,255,255,0.12)" : cat.color,
                height: "100%",
                transition: "width 0.3s ease",
              }}
              title={localize(`${cat.name}: ${cat.size} GB`)}
            />
          );
        }))}
      </div>

      <SectionTitle>{localize("Storage Categories")}</SectionTitle>
      <Card>
        {localize(storageCategories.map((cat) => (
          <Row key={cat.name} label={localize(cat.name)}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: cat.name === "Free Space" && dark ? "#444" : cat.color,
                }}
              />
              <span style={{ fontSize: "12px", fontWeight: 500, color: dark ? "#fff" : "#000000" }}>
                {localize(cat.size)} {localize("GB")}</span>
            </div>
          </Row>
        )))}
      </Card>
    </div>
  );
};

const CloudPanel = () => {
  const dark = useStore((s) => s.dark);
  return (
    <div>
      <SectionTitle>{localize("Cloud Integrations")}</SectionTitle>
      <Card>
        <div style={{ padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "24px" }}>
                <img src="/img/icons/sf-icons/cloud.svg" alt={localize("Google Drive")} style={{ width: "24px", height: "24px", filter: dark ? "invert(1)" : "none" }} />
              </span>
              <div>
                <div style={{ fontWeight: 600, fontSize: "13px", color: dark ? "#fff" : "#000000" }}>{localize("Google Drive")}</div>
                <div style={{ fontSize: "11px", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{localize("Not connected")}</div>
              </div>
            </div>
            <button style={{ background: "var(--brand-cta)", color: "var(--brand-cta-ink)", border: "none", borderRadius: "8px", padding: "6px 14px", fontSize: "12px", cursor: "pointer" }}>
              {localize("Connect")}</button>
          </div>
          <div style={{ background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", borderRadius: "8px", padding: "10px", fontSize: "11px", color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.5)", textAlign: "center" }}>
            {localize("⚡ Will be fully integrated in a future update")}</div>
        </div>
      </Card>
      <Card>
        <div style={{ padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "24px" }}>
                <img src="/img/icons/sf-icons/cloud.svg" alt={localize("Dropbox")} style={{ width: "24px", height: "24px", filter: dark ? "invert(1)" : "none" }} />
              </span>
              <div>
                <div style={{ fontWeight: 600, fontSize: "13px", color: dark ? "#fff" : "#000000" }}>{localize("Dropbox")}</div>
                <div style={{ fontSize: "11px", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{localize("Not connected")}</div>
              </div>
            </div>
            <button style={{ background: dark ? "rgba(255,255,255,0.08)" : "#f0f0f0", color: dark ? "rgba(255,255,255,0.3)" : "#888", border: "none", borderRadius: "8px", padding: "6px 14px", fontSize: "12px", cursor: "not-allowed" }}>
              {localize("Coming Soon")}</button>
          </div>
        </div>
      </Card>
      <Card>
        <div style={{ padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "24px" }}>
                <img src="/img/icons/sf-icons/cloud.svg" alt={localize("OneDrive")} style={{ width: "24px", height: "24px", filter: dark ? "invert(1)" : "none" }} />
              </span>
              <div>
                <div style={{ fontWeight: 600, fontSize: "13px", color: dark ? "#fff" : "#000000" }}>{localize("OneDrive")}</div>
                <div style={{ fontSize: "11px", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{localize("Not connected")}</div>
              </div>
            </div>
            <button style={{ background: dark ? "rgba(255,255,255,0.08)" : "#f0f0f0", color: dark ? "rgba(255,255,255,0.3)" : "#888", border: "none", borderRadius: "8px", padding: "6px 14px", fontSize: "12px", cursor: "not-allowed" }}>
              {localize("Coming Soon")}</button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const PrivacyPanel = () => {
  const [locationServices, setLocationServices] = useState(true);
  const [developerMode, setDeveloperMode] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<string | null>(null);

  const permissions = [
    { name: "Camera", icon: "i-ph:camera", apps: ["FaceTime", "Safari"] },
    { name: "Microphone", icon: "i-ph:microphone", apps: ["FaceTime", "Safari", "Music"] },
    { name: "Location Services", icon: "i-ph:map-pin", apps: ["Safari", "Maps"] },
    { name: "Screen Recording", icon: "i-ph:record", apps: ["Terminal"] },
    { name: "Full Disk Access", icon: "/img/icons/sf-icons/folder.svg", apps: ["Terminal"] },
  ];

  const dark = useStore((s) => s.dark);

  return (
    <div>
      <SectionTitle>{localize("Security Settings")}</SectionTitle>
      <Card>
        <Row label={localize("Location Services")}>
          <Toggle checked={locationServices} onChange={setLocationServices} />
        </Row>
        <Row label={localize("Developer Mode")}>
          <Toggle checked={developerMode} onChange={setDeveloperMode} />
        </Row>
      </Card>

      <SectionTitle>{localize("App Permissions")}</SectionTitle>
      <Card>
        {localize(permissions.map((p) => (
          <div key={p.name}>
            <div
              onClick={() => setSelectedPermission(selectedPermission === p.name ? null : p.name)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 16px",
                cursor: "pointer",
                borderBottom: dark ? "0.5px solid rgba(255,255,255,0.1)" : "0.5px solid rgba(0,0,0,0.06)",
                background: selectedPermission === p.name ? (dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)") : "transparent",
                transition: "background 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {localize(p.icon.startsWith("i-ph:") ? <span className={p.icon} style={{ width: "18px", height: "18px" }} /> : <img src={p.icon} alt={localize(p.name)} style={{ width: "18px", height: "18px", filter: dark ? "invert(1)" : "none" }} />)}
                <span style={{ fontSize: "13px", color: dark ? "#f4f4f6" : "#000000" }}>{localize(p.name)}</span>
              </div>
              <span style={{ fontSize: "12px", color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                {localize(p.apps.length)} {localize(p.apps.length === 1 ? "app" : "apps")} {localize(selectedPermission === p.name ? "▲" : "▼")}
              </span>
            </div>
            {localize(selectedPermission === p.name && (
              <div style={{ background: dark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.03)", padding: "4px 16px" }}>
                {localize(p.apps.map((app) => (
                  <div key={app} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: dark ? "0.5px solid rgba(255,255,255,0.05)" : "0.5px solid rgba(0,0,0,0.04)" }}>
                    <span style={{ fontSize: "12px", color: dark ? "#f4f4f6" : "#000000", paddingLeft: "24px" }}>{localize(app)}</span>
                    <Toggle checked={true} onChange={() => {}} />
                  </div>
                )))}
              </div>
            ))}
          </div>
        )))}
      </Card>
    </div>
  );
};

const AboutPanel = () => {
  const dark = useStore((s) => s.dark);
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px 16px", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, marginTop: "8px" }}>
          <span className="i-fa6-brands:apple" style={{ width: "72px", height: "72px" }} />
        </div>
        <div style={{ fontSize: "22px", fontWeight: 700, color: dark ? "#fff" : "#000000", marginTop: "8px" , fontFamily: "var(--font-display)", overflowWrap: "anywhere" }}>{localize("macOS Tahoe")}</div>
        <div style={{ fontSize: "13px", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{localize("Version 26.0 (Portfolio Edition)")}</div>
      </div>
      <Card>
        {localize([
          ["Chip", "Apple M4 Pro (simulated)"],
          ["Memory", "16 GB"],
          ["Storage", "Powered by Cloud"],
          ["macOS", "Tahoe 26.0"],
          ["Developer", "Antoine BrnL"],
          ["GitHub", "@antoinebrnl"],
        ].map(([key, val]) => (
          <Row key={key} label={localize(key)}>
            <span style={{ fontSize: "12px", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{localize(val)}</span>
          </Row>
        )))}
      </Card>
    </div>
  );
};

const GenericPanel = ({ id }: { id: SettingsPanel }) => {
  const dark = useStore((s) => s.dark);
  return (
    <div style={{ padding: "24px", textAlign: "center", color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "14px",
            background: PANEL_ITEMS.find((p) => p.id === id)?.color || "#9999a1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "#fff",
              WebkitMask: `url(${PANEL_ITEMS.find((p) => p.id === id)?.icon}) center/contain no-repeat`,
              mask: `url(${PANEL_ITEMS.find((p) => p.id === id)?.icon}) center/contain no-repeat`,
            }}
          />
        </div>
      </div>
      <div style={{ fontSize: "14px", fontWeight: 600, color: dark ? "#fff" : "#000000", marginBottom: "4px" }}>
        {localize(PANEL_ITEMS.find((p) => p.id === id)?.label)}
      </div>
      <div style={{ fontSize: "12px" }}>{localize("Settings coming soon")}</div>
    </div>
  );
};

// ─── Main System Settings ─────────────────────────────────────────────────────
export default function SystemSettings() {
  const [activePanel, setActivePanel] = useState<SettingsPanel>("appearance");
  const [search, setSearch] = useState("");
  const dark = useStore((s) => s.dark);
  const size = useWindowSize();
  const isMobile = size.winWidth < 768;
  const [mobileView, setMobileView] = useState<"list" | "panel">("list");

  const filtered = search.trim()
    ? PANEL_ITEMS.filter((p) =>
        localize(p.label).toLowerCase().includes(search.toLowerCase())
      )
    : PANEL_ITEMS;

  const renderPanel = () => {
    switch (activePanel) {
      case "general": return <GeneralPanel />;
      case "appearance": return <AppearancePanel />;
      case "wallpaper": return <WallpaperPanel />;
      case "dock": return <DockPanel />;
      case "notifications": return <NotificationsPanel />;
      case "sound": return <SoundPanel />;
      case "displays": return <DisplaysPanel />;
      case "battery": return <BatteryPanel />;
      case "storage": return <StoragePanel />;
      case "cloud": return <CloudPanel />;
      case "privacy": return <PrivacyPanel />;
      case "about": return <AboutPanel />;
      default: return <GenericPanel id={activePanel} />;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        flexDirection: isMobile ? "column" : "row",
        background: dark ? "rgba(30,30,30,0.95)" : "rgba(242,242,247,0.98)",
        color: dark ? "#f4f4f6" : "#000000",
        borderRadius: isMobile ? "0" : "0 0 14px 14px",
        overflow: "hidden",
      }}
    >
      {/* ── Sidebar / List View ── */}
      {localize((!isMobile || mobileView === "list") && (
        <div
          style={{
            width: isMobile ? "100%" : "220px",
            flexShrink: 0,
            borderRight: isMobile ? "none" : (dark ? "0.5px solid rgba(255,255,255,0.1)" : "var(--lg-border)"),
            background: isMobile ? (dark ? "#000" : "#f4f4f6") : (dark ? "rgba(42,42,42,0.95)" : "var(--lg-bg-tinted)"),
            backdropFilter: isMobile ? "none" : "var(--lg-blur-light)",
            WebkitBackdropFilter: isMobile ? "none" : "var(--lg-blur-light)",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {localize(isMobile && (
            <div style={{ fontSize: "32px", fontWeight: 700, padding: "20px 16px 10px", color: dark ? "#fff" : "#000" , fontFamily: "var(--font-display)", overflowWrap: "anywhere" }}>
              {localize("Settings")}</div>
          ))}
          {/* Search */}
          <div style={{ padding: isMobile ? "0 16px 16px" : "10px 12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: isMobile ? (dark ? "#000000" : "#e3e3e8") : (dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"),
              borderRadius: isMobile ? "10px" : "8px",
              padding: isMobile ? "8px 12px" : "5px 10px",
            }}
          >
            <img src="/img/icons/sf-icons/search.svg" alt={localize("search")} style={{ width: "12px", height: "12px", filter: dark ? "invert(1)" : "none", opacity: 0.5 }} />
            <input
              placeholder={localize("Search settings")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: "none",
                border: "none",
                outline: "none",
                fontSize: "12px",
                width: "100%",
                color: dark ? "#fff" : "#000000",
              }}
            />
          </div>
        </div>

        {/* Items */}
        <div style={{ flex: 1, paddingBottom: isMobile ? "20px" : "0" }}>
          {localize(isMobile && !search.trim() && (
            <div
              style={{
                background: dark ? "#000000" : "#fff",
                borderRadius: "10px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                margin: "0 16px 20px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "#e6e6e9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  overflow: "hidden"
                }}
              >
                <img src="/img/ui/avatar.jpg" alt={localize("profile")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <div style={{ fontSize: "20px", fontWeight: 400, color: dark ? "#fff" : "#000", letterSpacing: "-0.5px" }}>{localize("Antoine BrnL")}</div>
                <div style={{ fontSize: "13px", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", marginTop: "2px" }}>{localize("Apple ID, iCloud, Media & App Store")}</div>
              </div>
            </div>
          ))}

          {localize(isMobile ? (
            search.trim() ? (
              <div style={{ margin: "0 16px", background: dark ? "#000000" : "#fff", borderRadius: "10px", overflow: "hidden" }}>
                {localize(filtered.map((item, idx) => {
                  return (
                    <motion.button
                      key={item.id}
                      whileTap={{ backgroundColor: dark ? "#2c2c2e" : "#e6e6e9" }}
                      onClick={() => {
                        setActivePanel(item.id);
                        setMobileView("panel");
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        padding: "0 0 0 16px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        position: "relative",
                        textAlign: "left",
                      }}
                    >
                      <div style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: item.color, borderRadius: "6px", marginRight: "14px" }}>
                        <div style={{ width: "18px", height: "18px", backgroundColor: "#fff", WebkitMask: `url(${item.icon}) center/contain no-repeat`, mask: `url(${item.icon}) center/contain no-repeat` }} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1, padding: "12px 16px 12px 0", borderBottom: idx !== filtered.length - 1 ? (dark ? "0.5px solid rgba(255,255,255,0.15)" : "0.5px solid rgba(0,0,0,0.1)") : "none" }}>
                        <span style={{ fontSize: "16px", color: dark ? "#fff" : "#000" }}>{localize(item.label)}</span>
                        <img src="/img/icons/sf-icons/caret-right.svg" alt={localize("chevron")} style={{ width: "12px", height: "12px", opacity: 0.3, filter: dark ? "invert(1)" : "none", transform: "rotate(180deg)" }} />
                      </div>
                    </motion.button>
                  );
                }))}
              </div>
            ) : (
              PANEL_GROUPS.map((group, gIdx) => {
                const groupItems = group.map(id => PANEL_ITEMS.find(p => p.id === id)).filter(Boolean) as PanelItem[];
                if (groupItems.length === 0) return null;
                return (
                  <div key={gIdx} style={{ margin: "0 16px 20px", background: dark ? "#000000" : "#fff", borderRadius: "10px", overflow: "hidden" }}>
                    {localize(groupItems.map((item, idx) => {
                      return (
                        <motion.button
                          key={item.id}
                          whileTap={{ backgroundColor: dark ? "#2c2c2e" : "#e6e6e9" }}
                          onClick={() => {
                            setActivePanel(item.id);
                            setMobileView("panel");
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            padding: "0 0 0 16px",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            position: "relative",
                            textAlign: "left",
                          }}
                        >
                          <div style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: item.color, borderRadius: "6px", marginRight: "14px" }}>
                            <div style={{ width: "18px", height: "18px", backgroundColor: "#fff", WebkitMask: `url(${item.icon}) center/contain no-repeat`, mask: `url(${item.icon}) center/contain no-repeat` }} />
                          </div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1, padding: "12px 16px 12px 0", borderBottom: idx !== groupItems.length - 1 ? (dark ? "0.5px solid rgba(255,255,255,0.15)" : "0.5px solid rgba(0,0,0,0.1)") : "none" }}>
                            <span style={{ fontSize: "16px", color: dark ? "#fff" : "#000" }}>{localize(item.label)}</span>
                            <img src="/img/icons/sf-icons/caret-right.svg" alt={localize("chevron")} style={{ width: "12px", height: "12px", opacity: 0.3, filter: dark ? "invert(1)" : "none", transform: "rotate(180deg)" }} />
                          </div>
                        </motion.button>
                      );
                    }))}
                  </div>
                );
              })
            )
          ) : (
            filtered.map((item) => {
              const active = activePanel === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActivePanel(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "7px 12px",
                    background: active
                      ? dark ? "rgba(200,106,82,0.2)" : "rgba(200,106,82,0.12)"
                      : "transparent",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "8px",
                    margin: "1px 6px",
                    width: "calc(100% - 12px)",
                    transition: "background 0.15s ease",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.background =
                        dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {localize(active && (
                    <motion.div
                      layoutId="settings-sidebar-indicator"
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "18%",
                        bottom: "18%",
                        width: "2.5px",
                        borderRadius: "2px",
                        background: "var(--brand-cta)",
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  ))}
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      background: item.color,
                      borderRadius: "6px",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      border: dark ? "0.5px solid rgba(255,255,255,0.2)" : "0.5px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundColor: "#fff",
                        WebkitMask: `url(${item.icon}) center/contain no-repeat`,
                        mask: `url(${item.icon}) center/contain no-repeat`,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "13px",
                      color: active ? "#c86a52" : dark ? "#f4f4f6" : "#000000",
                      fontWeight: active ? 600 : 400,
                      textAlign: "left",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {localize(item.label)}
                  </span>
                </motion.button>
              );
            })
          ))}
        </div>
      </div>
      ))}

      {/* ── Content ── */}
      {localize((!isMobile || mobileView === "panel") && (
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", background: isMobile ? (dark ? "#000" : "#f4f4f6") : "transparent" }}>
          {localize(isMobile && (
            <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: dark ? "0.5px solid rgba(255,255,255,0.1)" : "0.5px solid rgba(0,0,0,0.1)" }}>
              <button
                onClick={() => setMobileView("list")}
                style={{
                  background: "none", border: "none", color: "var(--brand-link)", fontSize: "16px", display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", padding: 0
                }}
              >
                <img src="/img/icons/sf-icons/caret-right.svg" alt={localize("back")} style={{ width: "12px", height: "12px", transform: "rotate(180deg)", filter: "invert(40%) sepia(100%) saturate(3000%) hue-rotate(200deg) brightness(100%) contrast(100%)" }} />
                {localize("Settings")}</button>
            </div>
          ))}
          <div style={{ flex: 1, overflowY: "auto" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activePanel}
                initial={{ opacity: 0, x: 16, filter: "blur(2px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -10, filter: "blur(2px)" }}
                transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ paddingBottom: "24px" }}
              >
                {/* Panel title */}
                {localize(!isMobile && (
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      color: dark ? "#fff" : "#000000",
                      padding: "16px 16px 8px",
                      borderBottom: dark ? "0.5px solid rgba(255,255,255,0.1)" : "0.5px solid rgba(0,0,0,0.06)",
                      marginBottom: "4px",
                    }}
                  >
                    {localize(PANEL_ITEMS.find((p) => p.id === activePanel)?.label)}
                  </div>
                ))}
                {localize(isMobile && (
                   <div style={{ fontSize: "28px", fontWeight: 700, padding: "16px 16px 8px", color: dark ? "#fff" : "#000" , fontFamily: "var(--font-display)", overflowWrap: "anywhere" }}>
                     {localize(PANEL_ITEMS.find((p) => p.id === activePanel)?.label)}
                   </div>
                ))}
                {localize(renderPanel())}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
}
