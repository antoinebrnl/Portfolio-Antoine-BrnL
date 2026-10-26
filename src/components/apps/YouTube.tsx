import { localize } from "~/i18n";
import React from "react";
import { useStore } from "~/stores";

const YOUTUBE_URL = import.meta.env.VITE_YOUTUBE_URL ?? "https://streamifyhub.vercel.app";

export default function YouTube() {
  const dark = useStore((state) => state.dark);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        fontFamily: "var(--font-system)",
        backgroundColor: dark ? "#000000" : "#f4f4f6",
      }}
    >
      <iframe
        src={YOUTUBE_URL}
        title={localize("YouTube")}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          backgroundColor: "transparent",
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
