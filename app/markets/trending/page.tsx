"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { SiteHeader } from "@/components/site-header";
import { TrendWindow, TrendingMarket } from "@/lib/types";
import { getTraderProfile } from "@/lib/mock-data";
import { TrendingMarketCard, TrendingMarketsSkeleton } from "@/components/trending-markets";

const windows: TrendWindow[] = ["1H", "6H", "24H", "3D", "1W"];
const scoreOptions = [
  { label: "Any", value: "Any" },
  { label: "60+", value: "60+" },
  { label: "70+", value: "70+" },
];
const sharpeOptions = [
  { label: "Any", value: "Any" },
  { label: "1.0+", value: "1.0+" },
  { label: "1.5+", value: "1.5+" },
  { label: "2.0+", value: "2.0+" },
];



export default function TrendingMarketsPage() {
  const [trendWindow, setTrendWindow] = useState<TrendWindow>("1W");
  const [greaterThan95, setGreaterThan95] = useState(false);
  const [sportsOnly, setSportsOnly] = useState(false);
  const [endedOnly, setEndedOnly] = useState(false);
  const [lessThan30d, setLessThan30d] = useState(false);
  const [fivePlusTraders, setFivePlusTraders] = useState(false);
  const [scoreFloor, setScoreFloor] = useState("Any");
  const [sharpeFloor, setSharpeFloor] = useState("Any");

  const [markets, setMarkets] = useState<TrendingMarket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState<"live" | "mock">("mock");
  const [exchanges, setExchanges] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetch(`/api/v1/markets/trending?window=${trendWindow}`)
      .then(async (r) => {
        if (!r.ok) {
          const text = await r.text().catch(() => "<failed to read body>");
          throw new Error(`Trending fetch failed: ${r.status} ${r.statusText} - ${text}`);
        }
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        const items: TrendingMarket[] = Array.isArray(data) ? data : (data?.items ?? []);
        setMarkets(items);
        setSource(data?.source === "live" ? "live" : "mock");
        setExchanges(data?.exchanges ?? []);
      })
      .catch((err) => console.error("Error loading trending markets:", err))
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [trendWindow]);

  const items = useMemo(() => {
    let result = [...markets];

    if (greaterThan95) result = result.filter((m) => (m.probability ?? 0) > 95);

    if (sportsOnly) {
      result = result.filter((m) =>
        /sport|soccer|football|basketball|nfl|nba|cricket|tennis|golf|f1|world cup/i.test(m.title)
      );
    }

    if (endedOnly) {
      result = result.filter((m) => !m.endsIn.toLowerCase().includes("left") && m.endsIn !== "Active");
    } else {
      result = result.filter((m) => m.endsIn.toLowerCase().includes("left") || m.endsIn === "Active");
    }

    if (lessThan30d) {
      result = result.filter((m) => {
        const s = m.endsIn.toLowerCase();
        if (s.includes("h left")) return true;
        const match = s.match(/(\d+)d/);
        return match ? parseInt(match[1]) < 30 : false;
      });
    }

    if (fivePlusTraders) result = result.filter((m) => m.traders.length >= 5);

    if (scoreFloor !== "Any") {
      const threshold = Number(scoreFloor.replace("+", ""));
      if (!Number.isNaN(threshold)) {
        result = result.filter((m) =>
          m.traders.some((t) => {
            const profile = getTraderProfile(t.name);
            return profile?.smartScore != null && profile.smartScore >= threshold;
          })
        );
      }
    }

    if (sharpeFloor !== "Any") {
      const threshold = Number(sharpeFloor.replace("+", ""));
      if (!Number.isNaN(threshold)) {
        result = result.filter((m) =>
          m.traders.some((t) => {
            const profile = getTraderProfile(t.name);
            return profile?.sharpe != null && profile.sharpe >= threshold;
          })
        );
      }
    }

    return result;
  }, [markets, greaterThan95, sportsOnly, endedOnly, lessThan30d, fivePlusTraders, scoreFloor, sharpeFloor]);

  return (
    <main className="page-shell">
      <SiteHeader active="trending" />
      <section className="panel page-panel">
        <PageHeader
          eyebrow="Momentum"
          title="Trending Markets"
          description="Live markets across Polymarket, Kalshi, and Opinion Labs — ranked by 24-hour volume."
        />

        {/* Live data badge */}
        {source === "live" && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            background: "rgba(56,178,103,0.08)", border: "1px solid rgba(56,178,103,0.25)",
            borderRadius: "24px", padding: "6px 14px", fontSize: "0.78rem",
            color: "var(--text)", fontWeight: 500, marginBottom: "16px",
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%", background: "#38b267",
              display: "inline-block", boxShadow: "0 0 7px #38b267bb",
            }} />
            <span style={{ color: "#38b267", fontWeight: 700 }}>Live</span>
            <span style={{ color: "var(--muted)" }}>·</span>
            {exchanges.map((ex, i) => (
              <span key={ex} style={{ color: "var(--muted)" }}>
                {ex.charAt(0).toUpperCase() + ex.slice(1)}
                {i < exchanges.length - 1 && <span style={{ margin: "0 4px", opacity: 0.4 }}>·</span>}
              </span>
            ))}
          </div>
        )}

        {/* Filter Row matching screenshot */}
        <div className="trending-filter-row" style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "var(--panel-2)",
          border: "1px solid var(--border)",
          borderRadius: "4px",
          padding: "8px 12px",
          flexWrap: "wrap",
          width: "100%",
          marginTop: "12px",
          marginBottom: "20px"
        }}>
          {/* Timeframe selector group */}
          <div className="trending-pill-group" style={{
            display: "inline-flex",
            alignItems: "center",
            background: "rgba(0, 0, 0, 0.15)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            padding: "2px",
            gap: "2px"
          }}>
            {windows.map((w) => (
              <button
                key={w}
                onClick={() => setTrendWindow(w)}
                type="button"
                style={{
                  background: w === trendWindow ? "var(--text)" : "transparent",
                  color: w === trendWindow ? "var(--bg)" : "var(--muted)",
                  border: "none",
                  borderRadius: "3px",
                  padding: "5px 10px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 120ms ease"
                }}
              >
                {w}
              </button>
            ))}
          </div>

          {/* Tag Buttons: >95%, Sports, Ended, <30d, 5+ */}
          {[
            { label: ">95%", active: greaterThan95, onClick: () => setGreaterThan95(!greaterThan95) },
            { label: "Sports", active: sportsOnly, onClick: () => setSportsOnly(!sportsOnly) },
            { label: "Ended", active: endedOnly, onClick: () => setEndedOnly(!endedOnly) },
            { label: "<30d", active: lessThan30d, onClick: () => setLessThan30d(!lessThan30d) },
            { label: "5+", active: fivePlusTraders, onClick: () => setFivePlusTraders(!fivePlusTraders) }
          ].map((tag) => (
            <button
              key={tag.label}
              type="button"
              onClick={tag.onClick}
              style={{
                background: tag.active ? "var(--text)" : "transparent",
                color: tag.active ? "var(--bg)" : "var(--text)",
                border: tag.active ? "none" : "1px solid var(--border)",
                borderRadius: "4px",
                padding: "5px 10px",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 120ms ease"
              }}
            >
              {tag.label}
            </button>
          ))}

          <span className="trending-divider" style={{
            width: "1px",
            height: "18px",
            background: "var(--border)",
            margin: "0 4px"
          }} />

          {/* Score Dropdown */}
          <div className="trending-select-wrapper" style={{ position: "relative" }}>
            <select
              className="trending-select"
              value={scoreFloor}
              onChange={(e) => setScoreFloor(e.target.value)}
              style={{
                appearance: "none",
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                color: "var(--text)",
                padding: "6px 24px 6px 12px",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.6)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 8px center",
                backgroundSize: "10px"
              }}
            >
              <option value="Any" style={{ background: "var(--panel)", color: "var(--text)" }}>Score</option>
              {scoreOptions.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ background: "var(--panel)", color: "var(--text)" }}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Sharpe Dropdown */}
          <div className="trending-select-wrapper" style={{ position: "relative" }}>
            <select
              className="trending-select"
              value={sharpeFloor}
              onChange={(e) => setSharpeFloor(e.target.value)}
              style={{
                appearance: "none",
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                color: "var(--text)",
                padding: "6px 24px 6px 12px",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.6)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 8px center",
                backgroundSize: "10px"
              }}
            >
              <option value="Any" style={{ background: "var(--panel)", color: "var(--text)" }}>Sharpe</option>
              {sharpeOptions.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ background: "var(--panel)", color: "var(--text)" }}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {isLoading ? (
        <TrendingMarketsSkeleton />
      ) : items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>
          No markets match your filters.
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "20px",
          marginTop: "24px",
        }}>
          {items.map((market, index) => (
            <TrendingMarketCard key={`${market.platform}-${market.slug || market.title}-${index}`} market={market} />
          ))}
        </div>
      )}
    </main>
  );
}
