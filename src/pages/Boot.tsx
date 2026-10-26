import { localize } from "~/i18n";
import { useEffect, useState } from "react";

interface BootProps {
  restart: boolean;
  sleep: boolean;
  onComplete: (withSound: boolean) => void;
}

// Pauses and a slower final stretch, like the macOS startup screen.
const stages = [
  [0, 0], [700, 0], [1800, 24], [2600, 30],
  [3900, 67], [4400, 67], [5800, 94], [6400, 100],
];

export default function Boot({ restart, sleep, onComplete }: BootProps) {
  const [loading, setLoading] = useState(restart && !sleep);
  const [percent, setPercent] = useState(0);
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
      if (elapsed >= 6800) onComplete(true);
      else frame = requestAnimationFrame(advance);
    };
    frame = requestAnimationFrame(advance);
    return () => cancelAnimationFrame(frame);
  }, [loading, onComplete]);

  return (
    <div className="size-full bg-black text-white" style={{ position: "relative" }}>
      {localize(loading ? (
        <>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "min(200px, 55vw)", display: "flex", alignItems: "center", flexDirection: "column", transform: "translateY(-16px)" }}>
              <div aria-label={localize("Apple")} role="img" className="i-fa6-brands:apple" style={{ width: 76, height: 90, flexShrink: 0 }} />
              <div
                role="progressbar"
                aria-label={localize("Démarrage du portfolio")}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(percent)}
                style={{ marginTop: 52, width: "100%", height: 5, borderRadius: 3, background: "#000000", overflow: "hidden" }}
              >
                <div style={{ width: `${percent}%`, height: "100%", background: "#f4f4f6", borderRadius: 3 }} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <button
          type="button"
          className="size-full flex-center"
          style={{ color: "#9999a1", background: "transparent", border: 0, cursor: "pointer" }}
          onClick={() => sleep ? onComplete(false) : setLoading(true)}
        >
          {localize(sleep ? "Cliquer pour réactiver" : "Démarrer")}
        </button>
      ))}
    </div>
  );
}
