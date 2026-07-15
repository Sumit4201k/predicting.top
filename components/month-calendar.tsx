"use client";

import { useState } from "react";

type DayResult = "win" | "loss" | "flat";

interface DayData {
  day: number;
  pnl: number | null; // null = no trade / future
  result: DayResult | null;
}

interface MonthCalendarProps {
  monthLabel: string;
  monthlyPnlUsd: number;
  wins: number;
  losses: number;
  dayResults: DayResult[];
}

// Generate a calendar grid for July 2026
// July 1 2026 = Wednesday (index 3, 0=Sun)
function buildCalendarDays(dayResults: DayResult[]): DayData[][] {
  const DAYS_IN_MONTH = 31;
  const FIRST_DOW = 3; // Wednesday

  // Assign mock P&L values to each result
  const pnlMap: Record<DayResult, number[]> = {
    win: [765, 475, 588, 1200, 1700, 1100, 1200, 1100, 200, 2000, 12000],
    loss: [-881, -2200, -346],
    flat: [0],
  };

  const todayDay = 14; // simulate today = July 14

  const cells: DayData[] = [];
  // Empty cells before day 1
  for (let i = 0; i < FIRST_DOW; i++) {
    cells.push({ day: 0, pnl: null, result: null });
  }

  let winIdx = 0;
  let lossIdx = 0;
  let flatIdx = 0;

  for (let d = 1; d <= DAYS_IN_MONTH; d++) {
    const resultIdx = d - 1;
    const res: DayResult | null =
      d <= todayDay ? (dayResults[resultIdx] ?? null) : null;

    let pnl: number | null = null;
    if (res === "win") {
      pnl = pnlMap.win[winIdx % pnlMap.win.length];
      winIdx++;
    } else if (res === "loss") {
      pnl = pnlMap.loss[lossIdx % pnlMap.loss.length];
      lossIdx++;
    } else if (res === "flat") {
      pnl = pnlMap.flat[flatIdx % pnlMap.flat.length];
      flatIdx++;
    }

    cells.push({ day: d, pnl, result: res });
  }

  // chunk into weeks
  const weeks: DayData[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  // pad last row
  const last = weeks[weeks.length - 1];
  while (last.length < 7) last.push({ day: 0, pnl: null, result: null });

  return weeks;
}

function formatPnl(val: number): string {
  if (Math.abs(val) >= 1000) return `${val > 0 ? "+" : ""}$${(val / 1000).toFixed(1)}K`;
  return `${val > 0 ? "+" : ""}$${val}`;
}

function dayBg(result: DayResult | null, pnl: number | null): string {
  if (!result || pnl === null) return "rgba(255,255,255,0.03)";
  if (result === "win") {
    if (pnl >= 5000) return "#7a5a00"; // big win = gold
    return "#1a4d2a"; // normal win = dark green
  }
  if (result === "loss") {
    if (Math.abs(pnl) >= 2000) return "#5a1a1a"; // big loss = dark red
    return "#3d1a1a"; // normal loss = muted red
  }
  return "rgba(255,255,255,0.04)"; // flat
}

function dayTextColor(result: DayResult | null): string {
  if (!result) return "rgba(255,255,255,0.2)";
  if (result === "win") return "#2ee68b";
  if (result === "loss") return "#ff6767";
  return "rgba(255,255,255,0.4)";
}

const DOW_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function MonthCalendar({
  monthLabel,
  monthlyPnlUsd,
  wins,
  losses,
  dayResults,
}: MonthCalendarProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"daily" | "monthly">("daily");

  const weeks = buildCalendarDays(dayResults);

  return (
    <div
      style={{
        borderRadius: "12px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid var(--border)",
        marginBottom: "20px",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Strip header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          cursor: "pointer",
        }}
        onClick={() => setOpen((o) => !o)}
      >
        {/* Left: month nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", fontWeight: 600, fontSize: "0.9rem" }}>
          <span
            style={{ cursor: "pointer", color: "rgba(255,255,255,0.4)", userSelect: "none", fontSize: "1.1rem" }}
            onClick={(e) => { e.stopPropagation(); }}
          >‹</span>
          <span style={{ color: "#ffffff" }}>{monthLabel || "Jul 2026"}</span>
          <span
            style={{ cursor: "pointer", color: "rgba(255,255,255,0.4)", userSelect: "none", fontSize: "1.1rem" }}
            onClick={(e) => { e.stopPropagation(); }}
          >›</span>
        </div>

        {/* Center: P&L + W/L */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.95rem" }}>
          <span style={{ color: "#2ee68b", fontWeight: 800 }}>
            +${monthlyPnlUsd.toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </span>
          <span style={{ color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>
            {wins}W / {losses}L
          </span>
        </div>

        {/* Right: capsules + toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "flex", gap: "3px" }}>
            {dayResults.map((res, i) => (
              <span
                key={i}
                style={{
                  width: "6px",
                  height: "18px",
                  borderRadius: "3px",
                  background:
                    res === "win" ? "#2ee68b" : res === "loss" ? "#ff6767" : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", transition: "transform 200ms", display: "inline-block", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
            ▲
          </span>
        </div>
      </div>

      {/* Expandable calendar */}
      {open && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "16px 20px 20px" }}>
          {/* Daily / Monthly tabs */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
            {(["daily", "monthly"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background: tab === t ? "#ffffff" : "transparent",
                  color: tab === t ? "#000000" : "rgba(255,255,255,0.45)",
                  border: "none",
                  borderRadius: "6px",
                  padding: "5px 14px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  textTransform: "capitalize",
                }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {tab === "daily" && (
            <div>
              {/* Day-of-week headers */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: "6px",
                  marginBottom: "6px",
                }}
              >
                {DOW_LABELS.map((d, i) => (
                  <div
                    key={i}
                    style={{
                      textAlign: "center",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.3)",
                      padding: "4px 0",
                    }}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar weeks */}
              {weeks.map((week, wi) => (
                <div
                  key={wi}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "6px",
                    marginBottom: "6px",
                  }}
                >
                  {week.map((cell, di) => (
                    <div
                      key={di}
                      style={{
                        background: cell.day ? dayBg(cell.result, cell.pnl) : "transparent",
                        borderRadius: "8px",
                        minHeight: "72px",
                        padding: "8px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        gap: "4px",
                        cursor: cell.day && cell.result ? "pointer" : "default",
                        border: cell.day ? "1px solid rgba(255,255,255,0.04)" : "none",
                        transition: "opacity 120ms",
                      }}
                    >
                      {cell.day > 0 && (
                        <>
                          <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>
                            {cell.day}
                          </span>
                          {cell.pnl !== null && (
                            <span style={{ fontSize: "0.82rem", color: dayTextColor(cell.result), fontWeight: 700 }}>
                              {formatPnl(cell.pnl)}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {tab === "monthly" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "10px",
              }}
            >
              {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => {
                const isActive = m === "Jul";
                return (
                  <div
                    key={m}
                    style={{
                      background: isActive ? "rgba(46,230,139,0.08)" : "rgba(255,255,255,0.03)",
                      border: isActive ? "1px solid rgba(46,230,139,0.2)" : "1px solid rgba(255,255,255,0.05)",
                      borderRadius: "8px",
                      padding: "12px",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}>{m}</div>
                    {isActive && (
                      <div style={{ fontSize: "0.88rem", color: "#2ee68b", fontWeight: 700 }}>
                        +${monthlyPnlUsd.toLocaleString()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
