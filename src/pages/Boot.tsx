import { useEffect, useState } from "react";
import { useStore } from "~/stores";

interface BootProps {
  restart: boolean;
  sleep: boolean;
  setBooting: (value: boolean | ((prevVar: boolean) => boolean)) => void;
}

// Pauses and a slower final stretch, like the macOS startup screen.
const stages = [
  [0, 0], [700, 0], [1800, 24], [2600, 30],
  [3900, 67], [4400, 67], [5800, 94], [6400, 100],
];

export default function Boot({ restart, sleep, setBooting }: BootProps) {
  const [loading, setLoading] = useState(restart && !sleep);
  const [percent, setPercent] = useState(0);
  const [soundBlocked, setSoundBlocked] = useState(false);
  const startupSound = useStore((s) => s.startupSound);
  const volume = useStore((s) => s.volume);

  useEffect(() => {
    if (!loading) return;
    const started = performance.now();
    let frame: number;
    const advance = (now: number) => {
      const elapsed = now - started;
      let progress = 100;
      for (let i = 1; i < stages.length; i++) {
        const [end, value] = stages[i];
        const [start, previous] = stages[i - 1];
        if (elapsed < end) {
          progress = previous + (value - previous) * Math.max(0, (elapsed - start) / (end - start));
          break;
        }
      }
      setPercent(progress);
      if (elapsed >= 6800) setBooting(false);
      else frame = requestAnimationFrame(advance);
    };
    frame = requestAnimationFrame(advance);
    return () => cancelAnimationFrame(frame);
  }, [loading, setBooting]);

  useEffect(() => {
    if (!loading || !startupSound || volume <= 0) return;
    const audio = new Audio("/music/into.wav");
    audio.volume = Math.min(1, Math.max(0, volume / 100));
    let active = true;
    let playing = false;
    let pending = false;
    const play = () => {
      if (playing || pending) return;
      pending = true;
      audio.play().then(() => {
        playing = true;
        if (active) setSoundBlocked(false);
      }).catch(() => {
        if (active) setSoundBlocked(true);
      }).finally(() => { pending = false; });
    };
    const onKey = (event: KeyboardEvent) => {
      if (!event.repeat) play();
    };
    // Retry inside a user gesture when the browser denies autoplay.
    window.addEventListener("pointerdown", play);
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", play);
    play();
    return () => {
      active = false;
      audio.pause();
      window.removeEventListener("pointerdown", play);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", play);
    };
  }, [loading, startupSound, volume]);

  return (
    <div className="size-full bg-black text-white" style={{ position: "relative" }}>
      {loading ? (
        <>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "min(200px, 55vw)", display: "flex", alignItems: "center", flexDirection: "column", transform: "translateY(-16px)" }}>
              <div aria-label="Apple" role="img" className="i-fa6-brands:apple" style={{ width: 76, height: 90, flexShrink: 0 }} />
              <div
                role="progressbar"
                aria-label="Démarrage du portfolio"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(percent)}
                style={{ marginTop: 52, width: "100%", height: 5, borderRadius: 3, background: "#333", overflow: "hidden" }}
              >
                <div style={{ width: `${percent}%`, height: "100%", background: "#eee", borderRadius: 3 }} />
              </div>
            </div>
          </div>
          {soundBlocked && (
            <button
              type="button"
              style={{ position: "absolute", bottom: "8%", left: "50%", transform: "translateX(-50%)", padding: "10px 18px", borderRadius: 20, border: "1px solid #666", background: "#171717", color: "#eee", fontSize: 13, cursor: "pointer" }}
            >
              Activer le son de démarrage
            </button>
          )}
        </>
      ) : (
        <button
          type="button"
          className="size-full flex-center"
          style={{ color: "#aaa", background: "transparent", border: 0, cursor: "pointer" }}
          onClick={() => sleep ? setBooting(false) : setLoading(true)}
        >
          {sleep ? "Cliquer pour réactiver" : "Démarrer"}
        </button>
      )}
    </div>
  );
}
