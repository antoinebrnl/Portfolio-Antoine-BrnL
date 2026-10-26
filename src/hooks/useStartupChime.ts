import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "~/stores";

/** Owned by App so the chime can finish after the boot screen unmounts. */
export function useStartupChime() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pending = useRef(false);
  const generation = useRef(0);
  const [status, setStatus] = useState<"idle" | "blocked" | "error">("idle");
  const startupSound = useStore((s) => s.startupSound);
  const volume = useStore((s) => s.volume);

  const cancel = useCallback(() => {
    generation.current++;
    audioRef.current?.pause();
    pending.current = false;
    setStatus("idle");
  }, []);

  useEffect(() => {
    if (!startupSound || volume <= 0) cancel();
  }, [startupSound, volume, cancel]);

  const play = useCallback(() => {
    const { startupSound, volume } = useStore.getState();
    if (!startupSound || volume <= 0 || pending.current) return;
    const audio = audioRef.current ?? new Audio("/music/mac-startup.mp3");
    audioRef.current = audio;
    audio.volume = Math.min(1, Math.max(0, volume / 100));
    audio.currentTime = 0;
    pending.current = true;
    const request = ++generation.current;
    audio.play().then(() => {
      if (request === generation.current) setStatus("idle");
    }).catch((error: unknown) => {
      if (request === generation.current) {
        setStatus(error instanceof DOMException && error.name === "NotAllowedError" ? "blocked" : "error");
      }
    }).finally(() => {
      if (request === generation.current) pending.current = false;
    });
  }, []);

  useEffect(() => () => {
    generation.current++;
    audioRef.current?.pause();
  }, []);

  return { play, cancel, status };
}
