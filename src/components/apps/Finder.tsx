import { localize } from "~/i18n";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowSize } from "~/hooks/useWindowSize";

// ─── Types ───────────────────────────────────────────────────────────────────
type ViewMode = "icons" | "list" | "columns";
type SortKey = "name" | "date" | "size" | "kind";

interface FileItem {
  id: string;
  name: string;
  kind: "folder" | "file";
  ext?: string;
  size?: string;
  date: string;
  icon: string;
  color?: string;
  children?: FileItem[];
}

// ─── Mock Filesystem ─────────────────────────────────────────────────────────
const FILESYSTEM: Record<string, FileItem[]> = {
  home: [
    {
      id: "desktop",
      name: "Desktop",
      kind: "folder",
      date: "Today",
      icon: "/img/icons/sf-icons/desktop.svg",
      color: "#9999a1",
      children: [
        { id: "readme", name: "README.md", kind: "file", ext: "md", size: "2 KB", date: "Today", icon: "/img/icons/sf-icons/doc.svg" },
        { id: "notes", name: "notes.txt", kind: "file", ext: "txt", size: "1 KB", date: "Yesterday", icon: "/img/icons/sf-icons/doc.svg" },
      ],
    },
    {
      id: "documents",
      name: "Documents",
      kind: "folder",
      date: "Yesterday",
      icon: "/img/icons/sf-icons/folder.svg",
      color: "#c86a52",
      children: [
        { id: "resume", name: "Antoine_BrnL_Resume.pdf", kind: "file", ext: "pdf", size: "340 KB", date: "Jun 1", icon: "/img/icons/sf-icons/doc.svg" },
        { id: "cover", name: "CoverLetter.docx", kind: "file", ext: "docx", size: "28 KB", date: "Jun 2", icon: "/img/icons/sf-icons/doc.svg" },
        { id: "projects-folder", name: "Projects", kind: "folder", date: "Jun 3", icon: "/img/icons/sf-icons/folder.svg", color: "#c86a52" },
      ],
    },
    {
      id: "downloads",
      name: "Downloads",
      kind: "folder",
      date: "Today",
      icon: "/img/icons/sf-icons/download.svg",
      color: "#9999a1",
      children: [
        { id: "react-zip", name: "react-18.zip", kind: "file", ext: "zip", size: "2.1 MB", date: "Today", icon: "/img/icons/sf-icons/doc.svg" },
        { id: "wallpaper", name: "macOS_Tahoe.jpg", kind: "file", ext: "jpg", size: "4.8 MB", date: "Today", icon: "/img/icons/sf-icons/image.svg" },
      ],
    },
    {
      id: "pictures",
      name: "Pictures",
      kind: "folder",
      date: "Jun 3",
      icon: "/img/icons/sf-icons/image.svg",
      color: "#c86a52",
      children: [
        { id: "avatar", name: "avatar.png", kind: "file", ext: "png", size: "120 KB", date: "May 28", icon: "/img/icons/sf-icons/image.svg" },
      ],
    },
    {
      id: "music",
      name: "Music",
      kind: "folder",
      date: "Jun 2",
      icon: "/img/icons/sf-icons/sound.svg",
      color: "var(--brand-link)",
      children: [
        { id: "faded", name: "faded.mp3", kind: "file", ext: "mp3", size: "3.5 MB", date: "May 20", icon: "/img/icons/sf-icons/sound.svg" },
        { id: "samantha", name: "Samantha Legacy.wav", kind: "file", ext: "wav", size: "280 KB", date: "Jun 1", icon: "/img/icons/sf-icons/sound.svg" },
      ],
    },
    {
      id: "repos",
      name: "Repositories",
      kind: "folder",
      date: "Today",
      icon: "/img/icons/sf-icons/desktop.svg",
      color: "#c86a52",
      children: [
        { id: "macos-portfolio", name: "macOS-Portfolio", kind: "folder", date: "Today", icon: "/img/icons/sf-icons/folder.svg", color: "#c86a52" },
        { id: "lib-project", name: "lib", kind: "folder", date: "Jun 3", icon: "/img/icons/sf-icons/folder.svg", color: "#c86a52" },
      ],
    },
  ],
};

const SIDEBAR_SECTIONS = [
  {
    title: "",
    items: [
      { id: "recents", label: "Recents", icon: "/img/icons/sf-icons/clock.svg" },
      { id: "shared", label: "Shared", icon: "/img/icons/sf-icons/shared.svg" },
    ],
  },
  {
    title: "Favorites",
    items: [
      { id: "home", label: "Applications", icon: "/img/icons/sf-icons/applications.svg" },
      { id: "desktop", label: "Desktop", icon: "/img/icons/sf-icons/desktop.svg", parent: "home" },
      { id: "documents", label: "Documents", icon: "/img/icons/sf-icons/doc.svg", parent: "home" },
      { id: "downloads", label: "Downloads", icon: "/img/icons/sf-icons/download.svg", parent: "home" },
      { id: "pictures", label: "Screenshots", icon: "/img/icons/sf-icons/image.svg", parent: "home" },
    ],
  },
  {
    title: "iCloud",
    items: [
      { id: "icloud-drive", label: "iCloud Drive", icon: "/img/icons/sf-icons/cloud.svg" },
    ],
  },
  {
    title: "Locations",
    items: [
      { id: "macintosh-hd", label: "Macintosh HD", icon: "/img/icons/sf-icons/hard-drive.svg" },
      { id: "airdrop", label: "AirDrop", icon: "/img/icons/sf-icons/airdrop.svg" },
      { id: "network", label: "Network", icon: "/img/icons/sf-icons/network.svg" },
      { id: "trash", label: "Trash", icon: "/img/icons/sf-icons/trash.svg" },
    ],
  },
  {
    title: "Tags",
    items: [
      { id: "tag-red", label: "Terracotta", tagColor: "#c86a52" },
      { id: "tag-orange", label: "Dim gray", tagColor: "#66666e" },
      { id: "tag-blue", label: "Taupe gray", tagColor: "#9999a1" },
      { id: "tag-green", label: "Platinum", tagColor: "#e6e6e9" },
    ],
  },
];

// ─── File Icon Component ──────────────────────────────────────────────────────
const FileIcon = ({ item, size = 56 }: { item: FileItem; size?: number }) => {
  if (item.kind === "folder") {
    let customImg = "/img/icons/folder-generic.png";
    if (item.id === "repos" || item.id === "projects-folder") {
      customImg = "/img/icons/folder-dock.png";
    } else if (item.id === "home") {
      customImg = "/img/icons/folder-home.png";
    }

    return (
      <img
        src={customImg}
        alt={localize(item.name)}
        style={{ width: size, height: size, display: "inline-block", filter: "var(--brand-image-filter) drop-shadow(0 2px 4px rgba(0,0,0,0.1))", objectFit: "contain" }}
      />
    );
  }

  let customImg = "/img/icons/codefile.png";
  if (["mp3", "wav", "m4a", "flac", "audio"].includes(item.ext || "")) {
    customImg = "/img/icons/audio_Tahoe.png";
  } else if (["mp4", "mov", "avi", "mkv", "video"].includes(item.ext || "")) {
    customImg = "/img/icons/icnsFile_f693c769fe5bb58a3d33adfcd9901ecb_m4a_Tahoe.png";
  }

  return (
    <img
      src={customImg}
      alt={localize(item.name)}
      style={{ width: size, height: size, display: "inline-block", filter: "var(--brand-image-filter) drop-shadow(0 2px 4px rgba(0,0,0,0.1))", objectFit: "contain" }}
    />
  );
};

// ─── Main Finder Component ───────────────────────────────────────────────────
export default function Finder() {
  const [location, setLocation] = useState<string>("home");
  const [pathStack, setPathStack] = useState<string[]>(["home"]);
  const [viewMode, setViewMode] = useState<ViewMode>("icons");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const size = useWindowSize();
  const isMobile = size.winWidth < 768;
  const [mobileView, setMobileView] = useState<"sidebar" | "content">("content");

  // Get current items
  const currentItems = (): FileItem[] => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return Object.values(FILESYSTEM)
        .flat()
        .flatMap((f) => [f, ...(f.children ?? [])])
        .filter((f) => localize(f.name).toLowerCase().includes(q));
    }

    const rootItem = FILESYSTEM.home.find((f) => f.id === location);
    if (location === "home") return FILESYSTEM.home;
    if (rootItem?.children) return rootItem.children;
    // nested
    for (const root of FILESYSTEM.home) {
      const nested = root.children?.find((c) => c.id === location);
      if (nested?.children) return nested.children;
    }
    return [];
  };

  const sorted = [...currentItems()].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "folder" ? -1 : 1;
    if (sortKey === "name") return a.name.localeCompare(b.name);
    if (sortKey === "date") return a.date.localeCompare(b.date);
    if (sortKey === "kind") return (a.ext ?? "folder").localeCompare(b.ext ?? "folder");
    return 0;
  });

  const navigate = (item: FileItem) => {
    if (item.kind === "folder") {
      setPathStack((p) => [...p, item.id]);
      setLocation(item.id);
      setSelected(null);
    }
  };

  const goBack = () => {
    if (pathStack.length <= 1) return;
    const newStack = pathStack.slice(0, -1);
    setPathStack(newStack);
    setLocation(newStack[newStack.length - 1]);
    setSelected(null);
  };

  const goForward = () => { };

  const locationLabel = () => {
    if (location === "home") return "Antoine";
    const item = FILESYSTEM.home.find((f) => f.id === location);
    if (item) return item.name;
    for (const root of FILESYSTEM.home) {
      const nested = root.children?.find((c) => c.id === location);
      if (nested) return nested.name;
    }
    return location;
  };

  // ── Sidebar click handler ─────────────────────────────────────────────────
  const sidebarClick = (id: string, parent?: string) => {
    if (id === "google-drive" || id === "icloud-drive" || id === "macintosh-hd") {
      setLocation("home");
      setPathStack(["home"]);
      setMobileView("content");
      return;
    }
    if (parent === "home") {
      setPathStack(["home", id]);
      setLocation(id);
    } else {
      setPathStack(["home"]);
      setLocation("home");
    }
    setSelected(null);
    setMobileView("content");
  };

  // ── Render items ──────────────────────────────────────────────────────────

  // Helpers shared by Columns (miller) view
  const getChildrenOf = (id: string): FileItem[] => {
    if (id === "home") return FILESYSTEM.home;
    const root = FILESYSTEM.home.find((f) => f.id === id);
    if (root?.children) return root.children;
    for (const r of FILESYSTEM.home) {
      const nested = r.children?.find((c) => c.id === id);
      if (nested?.children) return nested.children;
    }
    return [];
  };

  const sortItems = (items: FileItem[]) =>
    [...items].sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

  const renderColumns = () => (
    <div style={{ display: "flex", height: "100%", minHeight: "100%" }}>
      {localize(pathStack.map((segId, colIdx) => {
        const items = sortItems(getChildrenOf(segId));
        const activeChild = pathStack[colIdx + 1]; // highlighted = the path we descended into
        return (
          <div
            key={segId + colIdx}
            style={{
              width: "200px",
              flexShrink: 0,
              borderRight: "0.5px solid rgba(0,0,0,0.1)",
              overflowY: "auto",
              padding: "6px 6px",
            }}
          >
            {localize(items.length === 0 && (
              <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.35)", padding: "8px" }}>
                {localize("Empty")}</div>
            ))}
            {localize(items.map((item) => {
              const isActive = item.id === activeChild;
              const isSelected = colIdx === pathStack.length - 1 && item.id === selected;
              const highlight = isActive || isSelected;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.kind === "folder") {
                      setPathStack([...pathStack.slice(0, colIdx + 1), item.id]);
                      setLocation(item.id);
                      setSelected(null);
                    } else {
                      setPathStack(pathStack.slice(0, colIdx + 1));
                      setLocation(segId);
                      setSelected(item.id);
                    }
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    cursor: "default",
                    userSelect: "none",
                    background: highlight ? "rgba(200,106,82,0.9)" : "transparent",
                    color: highlight ? "#f4f4f6" : "#000000",
                    transition: "background 0.1s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!highlight)
                      (e.currentTarget as HTMLElement).style.background = "rgba(102,102,110,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    if (!highlight)
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  <FileIcon item={item} size={16} />
                  <span
                    style={{
                      fontSize: "12px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                    }}
                  >
                    {localize(item.name)}
                  </span>
                  {localize(item.kind === "folder" && (
                    <div
                      style={{
                        width: "11px",
                        height: "11px",
                        backgroundColor: highlight ? "rgba(244,244,246,0.9)" : "rgba(0,0,0,0.35)",
                        WebkitMask: `url(/img/icons/sf-icons/caret-right.svg) center/contain no-repeat`,
                        mask: `url(/img/icons/sf-icons/caret-right.svg) center/contain no-repeat`,
                      }}
                    />
                  ))}
                </div>
              );
            }))}
          </div>
        );
      }))}
    </div>
  );

  const renderIcons = () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
        gap: "4px",
        padding: "16px",
      }}
    >
      {localize(sorted.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.025, duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
          onClick={() => setSelected(item.id)}
          onDoubleClick={() => navigate(item)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "8px 4px",
            borderRadius: "10px",
            cursor: "default",
            background:
              selected === item.id ? "rgba(200,106,82,0.2)" : "transparent",
            border:
              selected === item.id
                ? "1.5px solid rgba(200,106,82,0.4)"
                : "1.5px solid transparent",
            transition: "background 0.15s ease, border 0.15s ease",
            userSelect: "none",
          }}
          onMouseEnter={(e) => {
            if (selected !== item.id)
              (e.currentTarget as HTMLElement).style.background =
                "rgba(102,102,110,0.12)";
          }}
          onMouseLeave={(e) => {
            if (selected !== item.id)
              (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          <FileIcon item={item} size={52} />
          <span
            style={{
              marginTop: "6px",
              fontSize: "11px",
              color: "var(--c-text, #000000)",
              textAlign: "center",
              lineHeight: "1.3",
              maxWidth: "82px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {localize(item.name)}
          </span>
        </motion.div>
      )))}
    </div>
  );

  const renderList = () => (
    <div style={{ padding: "0" }}>
      {/* List header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 80px 80px 80px",
          padding: "4px 16px",
          borderBottom: "0.5px solid rgba(0,0,0,0.1)",
          background: "rgba(0,0,0,0.03)",
        }}
      >
        {localize(["Name", "Date", "Size", "Kind"].map((h) => (
          <button
            key={h}
            onClick={() => setSortKey(h.toLowerCase() as SortKey)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: sortKey === h.toLowerCase() ? 600 : 400,
              color:
                sortKey === h.toLowerCase() ? "#c86a52" : "rgba(0,0,0,0.5)",
              textAlign: "left",
              padding: 0,
            }}
          >
            {localize(h)} {localize(sortKey === h.toLowerCase() ? "↑" : "")}
          </button>
        )))}
      </div>
      {localize(sorted.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.02, duration: 0.2 }}
          onClick={() => setSelected(item.id)}
          onDoubleClick={() => navigate(item)}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 80px 80px 80px",
            padding: "5px 16px",
            cursor: "default",
            background:
              selected === item.id
                ? "rgba(200,106,82,0.15)"
                : i % 2 === 0
                  ? "transparent"
                  : "rgba(0,0,0,0.015)",
            transition: "background 0.1s ease",
            borderRadius: "4px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FileIcon item={item} size={18} />
            <span
              style={{
                fontSize: "12px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {localize(item.name)}
            </span>
          </div>
          <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.5)", alignSelf: "center" }}>
            {localize(item.date)}
          </span>
          <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.5)", alignSelf: "center" }}>
            {localize(item.size ?? "—")}
          </span>
          <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.5)", alignSelf: "center" }}>
            {localize(item.kind === "folder" ? "Folder" : item.ext?.toUpperCase() ?? "File")}
          </span>
        </motion.div>
      )))}
    </div>
  );

  // ── Toolbar ───────────────────────────────────────────────────────────────
  const toolbarBtn = (label: string, icon: string, active = false, action = () => { }) => (
    <motion.button
      title={localize(label)}
      onClick={action}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.1 }}
      style={{
        background: active ? "rgba(200,106,82,0.15)" : "transparent",
        border: active ? "0.5px solid rgba(200,106,82,0.25)" : "0.5px solid transparent",
        borderRadius: "6px",
        cursor: "pointer",
        padding: "4px 7px",
        fontSize: "14px",
        color: active ? "#c86a52" : "rgba(0,0,0,0.55)",
        transition: "background 0.12s ease, border-color 0.12s ease, color 0.12s ease",
        lineHeight: 1,
      }}
    >
      {localize(icon)}
    </motion.button>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",

        background: "rgba(244,244,246,0.98)",
        borderRadius: "0 0 14px 14px",
        overflow: "hidden",
      }}
    >
      {/* ── Toolbar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 12px",
          borderBottom: "0.5px solid rgba(0,0,0,0.1)",
          background: "rgba(244,244,246,0.98)",
          backdropFilter: "blur(20px)",
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}
      >
        {localize(isMobile && (
          <button
            onClick={() => setMobileView(mobileView === "sidebar" ? "content" : "sidebar")}
            style={{
               background: "none",
               border: "none",
               cursor: "pointer",
               fontSize: "14px",
               fontWeight: 500,
               color: "var(--brand-link)",
               padding: "4px 8px",
            }}
          >
            {localize(mobileView === "sidebar" ? "Done" : "Browse")}
          </button>
        ))}
        
        {/* Back / Forward */}
        <button
          onClick={goBack}
          disabled={pathStack.length <= 1}
          style={{
            background: "none",
            border: "none",
            cursor: pathStack.length > 1 ? "pointer" : "default",
            fontSize: "16px",
            opacity: pathStack.length > 1 ? 1 : 0.3,
            padding: "2px 6px",
          }}
        >
          {localize("‹")}</button>
        <button
          onClick={goForward}
          style={{ background: "none", border: "none", fontSize: "16px", opacity: 0.3, padding: "2px 6px" }}
        >
          {localize("›")}</button>

        {/* Location label */}
        <span
          style={{
            flex: 1,
            fontSize: "13px",
            fontWeight: 600,
            color: "#000000",
            textAlign: "center",
          }}
        >
          {localize(locationLabel())}
        </span>

        {/* View mode */}
        <div style={{ display: "flex", gap: "2px" }}>
          {localize(toolbarBtn("Icons", "⊞", viewMode === "icons", () => setViewMode("icons")))}
          {localize(toolbarBtn("List", "≡", viewMode === "list", () => setViewMode("list")))}
          {localize(toolbarBtn("Columns", "⊟", viewMode === "columns", () => setViewMode("columns")))}
        </div>

        {/* Sort */}
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          style={{
            fontSize: "11px",
            background: "rgba(0,0,0,0.06)",
            border: "none",
            borderRadius: "5px",
            padding: "3px 6px",
            cursor: "pointer",
            outline: "none",
            color: "#000000",
          }}
        >
          <option value="name">{localize("Name")}</option>
          <option value="date">{localize("Date")}</option>
          <option value="size">{localize("Size")}</option>
          <option value="kind">{localize("Kind")}</option>
        </select>

        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "rgba(0,0,0,0.06)",
            borderRadius: "6px",
            padding: "2px 8px",
            gap: "4px",
          }}
        >
          <div style={{ width: "11px", height: "11px", opacity: 0.5, backgroundColor: "currentColor", WebkitMask: "url(/img/icons/sf-icons/magnifying-glass.svg) center/contain no-repeat", mask: "url(/img/icons/sf-icons/magnifying-glass.svg) center/contain no-repeat" }} />
          <input
            placeholder={localize("Search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: "none",
              border: "none",
              outline: "none",
              fontSize: "12px",
              width: "100px",
              color: "#000000",
            }}
          />
        </div>
      </div>

      {/* ── Tab strip (breadcrumb tabs) ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2px",
          padding: "3px 12px",
          borderBottom: "0.5px solid rgba(0,0,0,0.08)",
          background: "rgba(244,244,246,0.95)",
          overflowX: "auto",
        }}
      >
        {localize(pathStack.map((seg, i) => {
          const label =
            seg === "home"
              ? "Antoine"
              : FILESYSTEM.home.find((f) => f.id === seg)?.name ?? seg;
          const isActive = i === pathStack.length - 1;
          return (
            <button
              key={seg}
              onClick={() => {
                const newStack = pathStack.slice(0, i + 1);
                setPathStack(newStack);
                setLocation(newStack[newStack.length - 1]);
              }}
              style={{
                background: isActive ? "rgba(0,0,0,0.09)" : "transparent",
                border: "none",
                borderRadius: "6px",
                padding: "2px 10px",
                fontSize: "12px",
                fontWeight: isActive ? 600 : 400,
                color: "#000000",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {localize(label)}
            </button>
          );
        }))}
      </div>

      {/* ── Body ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        {localize((!isMobile || mobileView === "sidebar") && (
          <div
            style={{
              width: isMobile ? "100%" : "160px",
              flexShrink: 0,
              borderRight: isMobile ? "none" : "var(--lg-border)",
              background: "var(--lg-bg-tinted)",
              backdropFilter: "var(--lg-blur-light)",
              WebkitBackdropFilter: "var(--lg-blur-light)",
              overflowY: "auto",
              padding: "8px 0",
            }}
          >
          {localize(SIDEBAR_SECTIONS.map((section) => (
            <div key={section.title} style={{ marginBottom: "4px" }}>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "rgba(0,0,0,0.35)",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  padding: "8px 12px 2px",
                }}
              >
                {localize(section.title)}
              </div>
              {localize(section.items.map((item: any) => {
                const active = location === item.id || (item.id === "home" && location === "home");
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => sidebarClick(item.id, item.parent)}
                    whileHover={{ x: 1 }}
                    transition={{ duration: 0.1 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "5px 12px",
                      background: active ? "rgba(200,106,82,0.13)" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "6px",
                      margin: "0 4px",
                      width: "calc(100% - 8px)",
                      transition: "background 0.12s ease",
                      position: "relative",
                    }}
                  >
                    {localize(active && (
                      <motion.div
                        layoutId="finder-sidebar-indicator"
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
                    {localize(item.tagColor ? (
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.tagColor, flexShrink: 0 }} />
                    ) : (
                      <div
                        style={{
                          width: "14px",
                          height: "14px",
                          flexShrink: 0,
                          backgroundColor: active ? "#c86a52" : "rgba(0,0,0,0.5)",
                          WebkitMask: `url(${item.icon}) center/contain no-repeat`,
                          mask: `url(${item.icon}) center/contain no-repeat`,
                        }}
                      />
                    ))}
                    <span
                      style={{
                        fontSize: "12px",
                        color: active ? "#c86a52" : "#000000",
                        fontWeight: active ? 600 : 400,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {localize(item.label)}
                    </span>
                  </motion.button>
                );
              }))}
            </div>
          )))}
        </div>
        ))}

        {/* Content */}
        {localize((!isMobile || mobileView === "content") && (
        <div style={{ flex: 1, overflowY: "auto", overflowX: viewMode === "columns" && !search.trim() ? "auto" : "hidden" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location + viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={viewMode === "columns" && !search.trim() ? { height: "100%" } : undefined}
            >
              {localize(search.trim()
                ? renderIcons()
                : viewMode === "columns"
                  ? renderColumns()
                  : viewMode === "list"
                    ? renderList()
                    : renderIcons())}
            </motion.div>
          </AnimatePresence>
        </div>
        ))}
      </div>

      {/* ── Path bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "4px 12px",
          borderTop: "0.5px solid rgba(0,0,0,0.08)",
          background: "rgba(244,244,246,0.98)",
          fontSize: "11px",
          color: "rgba(0,0,0,0.5)",
        }}
      >
        {localize(pathStack.map((seg, i) => {
          const label =
            seg === "home"
              ? "Antoine"
              : FILESYSTEM.home.find((f) => f.id === seg)?.name ??
              seg;
          return (
            <React.Fragment key={seg}>
              {localize(i > 0 && <span>{localize("›")}</span>)}
              <button
                onClick={() => {
                  const newStack = pathStack.slice(0, i + 1);
                  setPathStack(newStack);
                  setLocation(newStack[newStack.length - 1]);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "11px",
                  color: i === pathStack.length - 1 ? "#000000" : "#c86a52",
                  fontWeight: i === pathStack.length - 1 ? 500 : 400,
                  padding: "0 2px",
                }}
              >
                {localize(label)}
              </button>
            </React.Fragment>
          );
        }))}
      </div>
    </div>
  );
}
