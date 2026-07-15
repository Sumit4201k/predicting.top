"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { RecentTradesTable } from "@/components/recent-trades";
import { SiteHeader } from "@/components/site-header";
import { getRecentTrades } from "@/lib/mock-data";
import { RecentTrade } from "@/lib/types";

export default function RecentTradesPage() {
  const [trades, setTrades] = useState<{ items: RecentTrade[] }>(() => getRecentTrades());
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/v1/trades/recent")
      .then((r) => r.json())
      .then((data: RecentTrade[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setTrades({ items: data });
          setIsLive(true);
        }
      })
      .catch((err) => console.error("[Trades] fetch error:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="page-shell">
      <SiteHeader active="trades" />
      <section className="panel page-panel" style={{ marginBottom: "20px" }}>
        <PageHeader
          eyebrow="Execution Flow"
          title="Recent Trades"
          description="Watch where top traders are deploying size right now and compare that flow against score and market context."
        />

        {/* Live data badge */}
        {isLive && (
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
            <span style={{ color: "var(--muted)" }}>· Polymarket</span>
          </div>
        )}
      </section>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>
          <div style={{ fontSize: "2rem", marginBottom: 16 }}>Loading</div>
          <p style={{ margin: 0, fontSize: "0.95rem" }}>Fetching live trades from Polymarket…</p>
        </div>
      ) : (
        <RecentTradesTable items={trades.items} limit={20} />
      )}
    </main>
  );
}
