// ─────────────────────────────────────────────────────────
// components/BodyMap.jsx
// Interactive Rule-of-Nines SVG body diagram
// ─────────────────────────────────────────────────────────
import React, { useState } from "react";
import { BODY_REGIONS } from "../lib/medical";

// ── Single SVG region (ellipse or rect) ───────────────────
function Region({ id, children, selected, onToggle }) {
  return (
    <g
      className="body-region"
      onClick={() => onToggle(id)}
      style={{ cursor: "pointer" }}
    >
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          fill:        selected ? "#d92b2b" : "#f1f5f9",
          stroke:      selected ? "#b91c1c" : "#cbd5e1",
          strokeWidth: 1.5,
        })
      )}
    </g>
  );
}

function RegionLabel({ x, y, selected, children }) {
  return (
    <text
      x={x} y={y}
      textAnchor="middle"
      fontSize={7.5}
      fontFamily="'Plus Jakarta Sans', sans-serif"
      fontWeight={600}
      fill={selected ? "white" : "#64748b"}
      style={{ pointerEvents: "none", userSelect: "none" }}
    >
      {children}
    </text>
  );
}

// ── Front view SVG ─────────────────────────────────────────
function FrontBody({ selected, onToggle }) {
  const s = (id) => selected.includes(id);
  return (
    <svg width="150" height="360" viewBox="0 0 150 360">
      {/* Head */}
      <Region id="head" selected={s("head")} onToggle={onToggle}>
        <ellipse cx="75" cy="26" rx="22" ry="26" />
      </Region>
      <RegionLabel x={75} y={30} selected={s("head")}>Head 9%</RegionLabel>

      {/* Neck */}
      <rect x="68" y="52" width="14" height="10" rx={4} fill="#e2e8f0" stroke="none" />

      {/* Chest */}
      <Region id="chest" selected={s("chest")} onToggle={onToggle}>
        <rect x="45" y="64" width="60" height="48" rx={8} />
      </Region>
      <RegionLabel x={75} y={91} selected={s("chest")}>Chest 9%</RegionLabel>

      {/* Abdomen */}
      <Region id="abdomen" selected={s("abdomen")} onToggle={onToggle}>
        <rect x="45" y="114" width="60" height="48" rx={8} />
      </Region>
      <RegionLabel x={75} y={141} selected={s("abdomen")}>Abdomen 9%</RegionLabel>

      {/* Left arm */}
      <g transform="rotate(10,30,110)" className="body-region" onClick={() => onToggle("left_arm")} style={{ cursor: "pointer" }}>
        <rect x="18" y="68" width="26" height="80" rx={13}
          fill={s("left_arm") ? "#d92b2b" : "#f1f5f9"}
          stroke={s("left_arm") ? "#b91c1c" : "#cbd5e1"} strokeWidth={1.5} />
        <text x={31} y={112} textAnchor="middle" fontSize={7} fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight={600} fill={s("left_arm") ? "white" : "#64748b"} style={{ pointerEvents: "none" }}>Arm 9%</text>
      </g>

      {/* Right arm */}
      <g transform="rotate(-10,120,110)" className="body-region" onClick={() => onToggle("right_arm")} style={{ cursor: "pointer" }}>
        <rect x="106" y="68" width="26" height="80" rx={13}
          fill={s("right_arm") ? "#d92b2b" : "#f1f5f9"}
          stroke={s("right_arm") ? "#b91c1c" : "#cbd5e1"} strokeWidth={1.5} />
        <text x={119} y={112} textAnchor="middle" fontSize={7} fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight={600} fill={s("right_arm") ? "white" : "#64748b"} style={{ pointerEvents: "none" }}>Arm 9%</text>
      </g>

      {/* Perineum */}
      <Region id="perineum" selected={s("perineum")} onToggle={onToggle}>
        <rect x="62" y="164" width="26" height="14" rx={5} />
      </Region>
      <RegionLabel x={75} y={174} selected={s("perineum")}>1%</RegionLabel>

      {/* Left leg */}
      <Region id="left_leg_front" selected={s("left_leg_front")} onToggle={onToggle}>
        <rect x="44" y="181" width="32" height="148" rx={14} />
      </Region>
      <RegionLabel x={60} y={260} selected={s("left_leg_front")}>Leg 9%</RegionLabel>

      {/* Right leg */}
      <Region id="right_leg_front" selected={s("right_leg_front")} onToggle={onToggle}>
        <rect x="80" y="181" width="32" height="148" rx={14} />
      </Region>
      <RegionLabel x={96} y={260} selected={s("right_leg_front")}>Leg 9%</RegionLabel>
    </svg>
  );
}

// ── Back view SVG ──────────────────────────────────────────
function BackBody({ selected, onToggle }) {
  const s = (id) => selected.includes(id);
  return (
    <svg width="150" height="360" viewBox="0 0 150 360">
      {/* Head */}
      <Region id="head" selected={s("head")} onToggle={onToggle}>
        <ellipse cx="75" cy="26" rx="22" ry="26" />
      </Region>
      <RegionLabel x={75} y={30} selected={s("head")}>Head 9%</RegionLabel>

      <rect x="68" y="52" width="14" height="10" rx={4} fill="#e2e8f0" stroke="none" />

      {/* Upper back */}
      <Region id="upper_back" selected={s("upper_back")} onToggle={onToggle}>
        <rect x="45" y="64" width="60" height="48" rx={8} />
      </Region>
      <RegionLabel x={75} y={88} selected={s("upper_back")}>Upper Back 9%</RegionLabel>

      {/* Lower back */}
      <Region id="lower_back" selected={s("lower_back")} onToggle={onToggle}>
        <rect x="45" y="114" width="60" height="48" rx={8} />
      </Region>
      <RegionLabel x={75} y={141} selected={s("lower_back")}>Lower Back 9%</RegionLabel>

      {/* Arms (same IDs shared front/back) */}
      <g transform="rotate(10,30,110)" className="body-region" onClick={() => onToggle("left_arm")} style={{ cursor: "pointer" }}>
        <rect x="18" y="68" width="26" height="80" rx={13}
          fill={s("left_arm") ? "#d92b2b" : "#f1f5f9"}
          stroke={s("left_arm") ? "#b91c1c" : "#cbd5e1"} strokeWidth={1.5} />
        <text x={31} y={112} textAnchor="middle" fontSize={7} fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight={600} fill={s("left_arm") ? "white" : "#64748b"} style={{ pointerEvents: "none" }}>Arm 9%</text>
      </g>
      <g transform="rotate(-10,120,110)" className="body-region" onClick={() => onToggle("right_arm")} style={{ cursor: "pointer" }}>
        <rect x="106" y="68" width="26" height="80" rx={13}
          fill={s("right_arm") ? "#d92b2b" : "#f1f5f9"}
          stroke={s("right_arm") ? "#b91c1c" : "#cbd5e1"} strokeWidth={1.5} />
        <text x={119} y={112} textAnchor="middle" fontSize={7} fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight={600} fill={s("right_arm") ? "white" : "#64748b"} style={{ pointerEvents: "none" }}>Arm 9%</text>
      </g>

      {/* Legs back */}
      <Region id="left_leg_back" selected={s("left_leg_back")} onToggle={onToggle}>
        <rect x="44" y="181" width="32" height="148" rx={14} />
      </Region>
      <RegionLabel x={60} y={260} selected={s("left_leg_back")}>Leg 9%</RegionLabel>

      <Region id="right_leg_back" selected={s("right_leg_back")} onToggle={onToggle}>
        <rect x="80" y="181" width="32" height="148" rx={14} />
      </Region>
      <RegionLabel x={96} y={260} selected={s("right_leg_back")}>Leg 9%</RegionLabel>
    </svg>
  );
}

// ── Main BodyMap export ────────────────────────────────────
export default function BodyMap({ selectedRegions, onToggle }) {
  const [view, setView] = useState("front");

  const totalTBSA = selectedRegions.reduce((sum, id) => {
    const r = BODY_REGIONS.find((b) => b.id === id);
    return sum + (r ? r.pct : 0);
  }, 0);

  return (
    <div>
      {/* TBSA counter */}
      <div className="card" style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p className="section-label">Total TBSA</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span className="stat-num" style={{
              fontSize: 52, lineHeight: 1,
              color: totalTBSA >= 40 ? "var(--danger)" : totalTBSA >= 20 ? "var(--warning)" : "var(--text)",
            }}>
              {totalTBSA}
            </span>
            <span style={{ fontSize: 26, fontWeight: 800, color: "var(--primary)" }}>%</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          {totalTBSA >= 40 && <span className="pill pill-red pulse-dot">⚠ High Risk</span>}
          {totalTBSA > 0 && totalTBSA < 40 && <span className="pill pill-amber">{selectedRegions.length} region{selectedRegions.length !== 1 ? "s" : ""}</span>}
          {totalTBSA === 0 && <p style={{ fontSize: 12, color: "var(--text4)" }}>Tap to select</p>}
        </div>
      </div>

      {/* Front / Back toggle */}
      <div className="seg" style={{ marginBottom: 12 }}>
        <button className={`seg-btn ${view === "front" ? "on" : ""}`} onClick={() => setView("front")}>Front View</button>
        <button className={`seg-btn ${view === "back"  ? "on" : ""}`} onClick={() => setView("back")}>Back View</button>
      </div>

      {/* SVG diagram */}
      <div className="card" style={{ display: "flex", justifyContent: "center", padding: "20px 8px", marginBottom: 12 }}>
        {view === "front"
          ? <FrontBody selected={selectedRegions} onToggle={onToggle} />
          : <BackBody  selected={selectedRegions} onToggle={onToggle} />}
      </div>

      {/* Selected chips */}
      {selectedRegions.length > 0 && (
        <div className="card" style={{ marginBottom: 12 }}>
          <p className="section-label" style={{ marginBottom: 10 }}>Selected Regions</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {selectedRegions.map((id) => {
              const r = BODY_REGIONS.find((b) => b.id === id);
              return (
                <span
                  key={id}
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    background: "var(--danger-light)", border: "1px solid var(--danger-mid)",
                    borderRadius: 99, padding: "4px 10px",
                    fontSize: 12, fontWeight: 600, color: "var(--danger)",
                  }}
                >
                  {r?.label} {r?.pct}%
                  <button
                    onClick={() => onToggle(id)}
                    style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", fontSize: 15, lineHeight: 1, padding: 0 }}
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
