import React from "react";

interface WallpaperProps {
  src: string;
  brightness?: number;
}

/** A background layer, kept separate from controls so their colors stay intact. */
export default function Wallpaper({ src, brightness = 100 }: WallpaperProps) {
  const isBrandWallpaper = src === "/wallpapers/pro-black-terracotta.png";
  return (
    <div className="brand-wallpaper" aria-hidden="true" style={{ filter: `brightness(${brightness}%)` }}>
      <div
        className={isBrandWallpaper ? "brand-wallpaper-image brand-wallpaper-original" : "brand-wallpaper-image"}
        style={{ backgroundImage: `url(${src})` }}
      />
    </div>
  );
}
