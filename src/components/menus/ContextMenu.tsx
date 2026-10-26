import { localize } from "~/i18n";
import React, { useRef, useState } from "react";
import { useClickOutside } from "~/hooks";

interface ContextMenuProps {
  x: number;
  y: number;
  show: boolean;
  onClose: () => void;
  openApp: (id: string) => void;
}

export default function ContextMenu({ x, y, show, onClose, openApp }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, onClose);

  if (!show) return null;

  const itemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "3px 10px",
    fontSize: "13.5px",
    lineHeight: "18px",
    cursor: "default",
    borderRadius: "4px",
    transition: "background 0.05s ease, color 0.05s ease",
    userSelect: "none",
    margin: "1px 5px",
  };

  const MenuItem = ({ children, onClick, disabled = false, hint }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; hint?: string }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <div
        className="text-black dark:text-white"
        style={{
          ...itemStyle,
          background: hovered && !disabled ? "var(--accent-blue)" : "transparent",
          color: hovered && !disabled ? "var(--brand-cta-ink)" : "inherit",
          opacity: disabled ? 0.5 : 1,
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled && onClick) {
            onClick();
            onClose();
          }
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span>{localize(children)}</span>
        {localize(hint && (
          <span style={{ fontSize: "12px", opacity: hovered && !disabled ? 0.9 : 0.5, marginLeft: "auto", fontFamily: "var(--font-system)", letterSpacing: "1px" }}>
            {localize(hint)}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div
      ref={ref}
      className="menu-box"
      style={{
        position: "fixed",
        top: y,
        left: x,
        width: "240px",
        padding: "5px 0",
        zIndex: 100000,
        fontFamily: "var(--font-system)",
        fontWeight: 400,
      }}
    >
      <MenuItem disabled>{localize("New Folder")}</MenuItem>
      <div className="h-px bg-gray-300 dark:bg-white/10 my-1 mx-2" />
      <MenuItem disabled>{localize("Get Info")}</MenuItem>
      <MenuItem onClick={() => openApp("system-settings")}>{localize("Change Desktop Background...")}</MenuItem>
      <div className="h-px bg-gray-300 dark:bg-white/10 my-1 mx-2" />
      <MenuItem disabled>{localize("Use Stacks")}</MenuItem>
      <MenuItem disabled>{localize("Sort By")}</MenuItem>
      <MenuItem disabled>{localize("Clean Up")}</MenuItem>
      <MenuItem disabled>{localize("Clean Up By")}</MenuItem>
      <MenuItem disabled>{localize("Show View Options")}</MenuItem>
    </div>
  );
}
