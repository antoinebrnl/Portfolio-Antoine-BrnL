import { localize } from "~/i18n";
import React from "react";

export const FolderIcon = ({ className }: { className?: string }) => (
  <img
    src="/img/icons/folder-generic.png"
    alt={localize("Folder")}
    className={className}
    style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" }}
  />
);

export const FolderHomeIcon = ({ className }: { className?: string }) => (
  <img
    src="/img/icons/folder-home.png"
    alt={localize("Home Folder")}
    className={className}
    style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" }}
  />
);

export const FolderDockIcon = ({ className }: { className?: string }) => (
  <img
    src="/img/icons/folder-dock.png"
    alt={localize("Dock Folder")}
    className={className}
    style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" }}
  />
);

export const PdfIcon = ({ className }: { className?: string }) => (
  <img
    src="/img/icons/pdf.png"
    alt={localize("PDF File")}
    className={className}
    style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" }}
  />
);

export const TxtIcon = ({ className }: { className?: string }) => (
  <img
    src="/img/icons/txt.png"
    alt={localize("Text File")}
    className={className}
    style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" }}
  />
);

export const AudioIcon = ({ className }: { className?: string }) => (
  <img
    src="/img/icons/audio.png"
    alt={localize("Audio File")}
    className={className}
    style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" }}
  />
);

export const VideoIcon = ({ className }: { className?: string }) => (
  <img
    src="/img/icons/mp4file.png"
    alt={localize("Video File")}
    className={className}
    style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" }}
  />
);
