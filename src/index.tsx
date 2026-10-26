import { localize, useLanguage } from "~/i18n";
import Welcome from "~/pages/Welcome";
import React from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "~/stores";

import Desktop from "~/pages/Desktop";
import Login from "~/pages/Login";
import Boot from "~/pages/Boot";

import "@unocss/reset/tailwind.css";
import "uno.css";
import "katex/dist/katex.min.css";
import "~/styles/index.css";
import { AudioProvider } from "~/context/AudioContext";
import { useStartupChime } from "~/hooks/useStartupChime";

// macOS Tahoe transition variants
// Login → Desktop: bright white bloom flash (exactly like macOS unlocking)
const loginExitVariants = {
  initial: { opacity: 1, scale: 1, filter: "brightness(1)" },
  exit: {
    opacity: 0,
    scale: 1.05,
    filter: "brightness(4) saturate(0)",
    transition: {
      duration: 0.35,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

import Mobile from "~/pages/Mobile";
import { useWindowSize } from "~/hooks/useWindowSize";

const desktopEnterVariants = {
  initial: { opacity: 0, scale: 0.97, filter: "brightness(2)" },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "brightness(1)",
    transition: {
      duration: 0.55,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const bootVariants = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  exit: {
    opacity: 0,
    transition: { duration: 0.35 },
  },
};

export default function App() {
  const language = useLanguage();
  useEffect(() => { document.documentElement.lang = language ?? "fr"; }, [language]);
  const [login, setLogin] = useState<boolean>(false);
  const [booting, setBooting] = useState<boolean>(true);
  const [restart, setRestart] = useState<boolean>(true);
  const [sleep, setSleep] = useState<boolean>(false);
  const startupChime = useStartupChime();
  const completeBoot = useCallback((withSound: boolean) => {
    if (withSound) startupChime.play();
    setBooting(false);
  }, [startupChime.play]);

  const { winWidth } = useWindowSize();
  const isMobile = winWidth < 768;

  const { dark, getWallpaper, iconStyle, tintWindows, accentColor } = useStore((s) => ({
    dark: s.dark,
    getWallpaper: s.getWallpaper,
    iconStyle: s.iconStyle,
    tintWindows: s.tintWindows,
    accentColor: s.accentColor,
  }));
  const activeWallpaper = getWallpaper();

  // Sync the persisted appearance to the <html> dark class on mount.
  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  // Sync accent color
  useEffect(() => {
    document.documentElement.style.setProperty("--accent-primary", accentColor);
  }, [accentColor]);

  // Drive icon-style + window-tint appearance from the root element so CSS
  // can react globally (matches the dark-class pattern above).
  useEffect(() => {
    document.documentElement.dataset.iconStyle = iconStyle;
  }, [iconStyle]);

  useEffect(() => {
    document.documentElement.dataset.tintWindows = tintWindows ? "on" : "off";
  }, [tintWindows]);

  const shutMac = (e: React.MouseEvent): void => {
    e.stopPropagation();
    startupChime.cancel();
    setRestart(false);
    setSleep(false);
    setLogin(false);
    setBooting(true);
  };

  const restartMac = (e: React.MouseEvent): void => {
    e.stopPropagation();
    startupChime.cancel();
    setRestart(true);
    setSleep(false);
    setLogin(false);
    setBooting(true);
  };

  const sleepMac = (e: React.MouseEvent): void => {
    e.stopPropagation();
    startupChime.cancel();
    setRestart(false);
    setSleep(true);
    setLogin(false);
    setBooting(true);
  };

  const getPage = () => {
    if (booting) return "boot";
    if (!language) return "welcome";
    if (login) return "desktop";
    return "login";
  };

  const page = getPage();

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "transparent" }}>
      {/* Persistent wallpaper — always visible, never absent during transitions */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${dark ? activeWallpaper.night : activeWallpaper.day})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />

      <AnimatePresence mode="popLayout">
        {page === "boot" && (
          <motion.div
            key="boot"
            className="size-full"
            variants={bootVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ position: "absolute", inset: 0, zIndex: 1 }}
          >
            <Boot restart={restart} sleep={sleep} onComplete={completeBoot} />
          </motion.div>
        )}

        {page === "welcome" && (
          <motion.div key="welcome" className="size-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "absolute", inset: 0, zIndex: 2 }}>
            <Welcome />
          </motion.div>
        )}

        {page === "desktop" && (
          <motion.div
            key="desktop"
            className="size-full"
            variants={desktopEnterVariants}
            initial="initial"
            animate="animate"
            style={{ position: "absolute", inset: 0, zIndex: 1 }}
          >
            {isMobile ? (
              <Mobile
                setLogin={setLogin}
                shutMac={shutMac}
                sleepMac={sleepMac}
                restartMac={restartMac}
              />
            ) : (
              <Desktop
                setLogin={setLogin}
                shutMac={shutMac}
                sleepMac={sleepMac}
                restartMac={restartMac}
              />
            )}
          </motion.div>
        )}

        {page === "login" && (
          <motion.div
            key="login"
            className="size-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.4 } }}
            exit={loginExitVariants.exit}
            style={{ position: "absolute", inset: 0, zIndex: 1 }}
          >
            <Login
              setLogin={setLogin}
              shutMac={shutMac}
              sleepMac={sleepMac}
              restartMac={restartMac}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {startupChime.status === "blocked" && (
        <button
          type="button"
          onClick={startupChime.play}
          style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 10000, padding: "10px 18px", borderRadius: 20, border: "1px solid #666", background: "#171717", color: "#eee", fontSize: 13, cursor: "pointer", maxWidth: "90vw" }}
        >
          {localize("Écouter le son de démarrage")}
        </button>
      )}
      {startupChime.status === "error" && (
        <p role="status" style={{ position: "fixed", bottom: 24, insetInline: 20, zIndex: 10000, textAlign: "center", color: "white" }}>
          {localize("Le son de démarrage n’a pas pu être chargé.")}
        </p>
      )}

      {/* White bloom flash — gentler fade-out on login→desktop */}
      <AnimatePresence>
        {login && (
          <motion.div
            key="flash"
            style={{
              position: "absolute",
              inset: 0,
              background: "white",
              pointerEvents: "none",
              zIndex: 9999,
            }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0, transition: { duration: 0.8, delay: 0 } }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const rootElement = document.getElementById("root") as HTMLElement;
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AudioProvider>
      <App />
    </AudioProvider>
  </React.StrictMode>
);
