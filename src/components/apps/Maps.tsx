import { localize } from "~/i18n";
import { motion } from "framer-motion";

const PLACES = [
  { id: "1", name: "MBM University", type: "University", lat: 26.285, lng: 73.006, color: "var(--brand-link)" },
  { id: "2", name: "Jodhpur", type: "City", lat: 26.292, lng: 73.014, color: "var(--brand-link)" },
  { id: "3", name: "Mehrangarh Fort", type: "Landmark", lat: 26.298, lng: 72.978, color: "#c86a52" },
  { id: "4", name: "Umaid Bhawan", type: "Palace", lat: 26.280, lng: 73.022, color: "#66666e" },
];

export default function Maps() {
  const [search, setSearch] = useState("");
  const [activePlace, setActivePlace] = useState(PLACES[0]);
  const [mapStyle, setMapStyle] = useState<"standard" | "satellite" | "transit">("standard");

  const filtered = search.trim()
    ? PLACES.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : PLACES;

  // Simple SVG map representation
  const MapView = () => (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {/* Map background */}
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            mapStyle === "satellite"
              ? "linear-gradient(145deg, #000000, #000000, #66666e)"
              : mapStyle === "transit"
              ? "linear-gradient(145deg, #f4f4f6, #e6e6e9, #e6e6e9)"
              : "linear-gradient(145deg, #f4f4f6, #e6e6e9, #9999a1)",
          position: "relative",
        }}
      >
        {/* Roads */}
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          viewBox="0 0 400 300"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Main roads */}
          <line x1="0" y1="150" x2="400" y2="150" stroke={mapStyle === "satellite" ? "rgba(244,244,246,0.3)" : "#f4f4f6"} strokeWidth="6" />
          <line x1="200" y1="0" x2="200" y2="300" stroke={mapStyle === "satellite" ? "rgba(244,244,246,0.3)" : "#f4f4f6"} strokeWidth="6" />
          <line x1="0" y1="80" x2="400" y2="220" stroke={mapStyle === "satellite" ? "rgba(244,244,246,0.2)" : "rgba(244,244,246,0.8)"} strokeWidth="3" />
          <line x1="0" y1="220" x2="400" y2="80" stroke={mapStyle === "satellite" ? "rgba(244,244,246,0.2)" : "rgba(244,244,246,0.8)"} strokeWidth="3" />
          {/* Blocks */}
          {localize([60, 130, 270, 340].map((x) =>
            [50, 110, 190, 250].map((y) => (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width={50}
                height={40}
                rx={4}
                fill={
                  mapStyle === "satellite"
                    ? "rgba(102,102,110,0.6)"
                    : mapStyle === "transit"
                    ? "rgba(153,153,161,0.8)"
                    : "rgba(153,153,161,0.9)"
                }
              />
            ))
          ))}
          {/* Water */}
          <ellipse cx="320" cy="230" rx="60" ry="40" fill={mapStyle === "satellite" ? "rgba(102,102,110,0.7)" : "rgba(153,153,161,0.7)"} />

          {/* Place pins */}
          {localize(PLACES.map((place, i) => {
            const x = 80 + i * 80;
            const y = 60 + (i % 2) * 80;
            const isActive = activePlace.id === place.id;
            return (
              <g key={place.id} onClick={() => setActivePlace(place)} style={{ cursor: "pointer" }}>
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 14 : 10}
                  fill={place.color}
                  opacity={isActive ? 1 : 0.8}
                />
                <circle cx={x} cy={y} r={isActive ? 7 : 5} fill="#f4f4f6" />
                {localize(isActive && (
                  <circle cx={x} cy={y} r={22} fill="none" stroke={place.color} strokeWidth="2" opacity="0.4" />
                ))}
              </g>
            );
          }))}
        </svg>

        {/* Map style switcher */}
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            gap: "4px",
            background: "rgba(244,244,246,0.9)",
            borderRadius: "10px",
            padding: "3px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          }}
        >
          {localize((["standard", "satellite", "transit"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setMapStyle(s)}
              style={{
                background: mapStyle === s ? "#c86a52" : "transparent",
                border: "none",
                borderRadius: "7px",
                padding: "4px 8px",
                fontSize: "10px",
                cursor: "pointer",
                color: mapStyle === s ? "#f4f4f6" : "#000000",
                fontWeight: mapStyle === s ? 600 : 400,
                textTransform: "capitalize",
                transition: "all 0.15s ease",
              }}
            >
              {localize(s)}
            </button>
          )))}
        </div>

        {/* Zoom controls */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 12,
            display: "flex",
            flexDirection: "column",
            background: "rgba(244,244,246,0.9)",
            borderRadius: "10px",
            overflow: "hidden",
            backdropFilter: "blur(10px)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          }}
        >
          {localize(["+", "−"].map((btn) => (
            <button
              key={btn}
              style={{
                background: "transparent",
                border: "none",
                width: 32,
                height: 32,
                cursor: "pointer",
                fontSize: "18px",
                color: "#000000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderBottom: btn === "+" ? "0.5px solid rgba(0,0,0,0.1)" : "none",
              }}
            >
              {localize(btn)}
            </button>
          )))}
        </div>

        {/* Active place card */}
        <motion.div
          key={activePlace.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: "absolute",
            bottom: 12,
            left: 12,
            right: 52,
            background: "rgba(244,244,246,0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "14px",
            padding: "12px 14px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: activePlace.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span className="i-ph:map-pin" style={{ width: "18px", height: "18px", color: "#f4f4f6" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#000000" }}>
              {localize(activePlace.name)}
            </div>
            <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.5)" }}>
              {localize(activePlace.type)} {localize("· Jodhpur, Rajasthan")}</div>
          </div>
          <button
            style={{
              background: "var(--brand-cta)",
              border: "none",
              borderRadius: "8px",
              padding: "6px 12px",
              fontSize: "12px",
              color: "var(--brand-cta-ink)",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            {localize("Directions")}</button>
        </motion.div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        
        background: "#f4f4f6",
        borderRadius: "0 0 14px 14px",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          flexShrink: 0,
          background: "rgba(244,244,246,0.98)",
          borderRight: "0.5px solid rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Search */}
        <div style={{ padding: "10px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(0,0,0,0.07)",
              borderRadius: "10px",
              padding: "7px 10px",
            }}
          >
            <span className="i-ph:magnifying-glass" style={{ width: "12px", height: "12px", opacity: 0.5 }} />
            <input
              placeholder={localize("Search Maps")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: "none",
                border: "none",
                outline: "none",
                fontSize: "13px",
                width: "100%",
                color: "#000000",
              }}
            />
          </div>
        </div>

        {/* Favourites */}
        <div
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: "rgba(0,0,0,0.35)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            padding: "4px 14px 4px",
          }}
        >
          {localize("Favourites")}</div>
        {localize(filtered.map((place) => (
          <button
            key={place.id}
            onClick={() => setActivePlace(place)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 12px",
              background: activePlace.id === place.id ? "rgba(200,106,82,0.1)" : "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: "8px",
              margin: "1px 6px",
              width: "calc(100% - 12px)",
              transition: "background 0.15s ease",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: place.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span className="i-ph:map-pin" style={{ width: "14px", height: "14px", color: "#f4f4f6" }} />
            </div>
            <div style={{ textAlign: "left", minWidth: 0 }}>
              <div
                style={{
                  fontSize: "13px",
                  color: activePlace.id === place.id ? "#c86a52" : "#000000",
                  fontWeight: activePlace.id === place.id ? 600 : 400,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {localize(place.name)}
              </div>
              <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.4)" }}>{localize(place.type)}</div>
            </div>
          </button>
        )))}
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: "relative" }}>
        <MapView />
      </div>
    </div>
  );
}
