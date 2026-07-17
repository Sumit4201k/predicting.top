import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlatformBadges } from "@/components/platform-badges";
import { ProfileChart } from "@/components/profile-chart";
import { MonthCalendar } from "@/components/month-calendar";
import { getTraderProfile } from "@/lib/mock-data";

export default async function TraderProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let profileData: any = null;
  let historyData: any = null;

  try {
    const res = await fetch(`https://predicting.top/api/trader/${slug}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.trader) {
        profileData = data.trader;
      }
    }
  } catch (e) {
    console.error("Failed to fetch trader profile from upstream:", e);
  }

  let profile: any = null;

  if (profileData) {
    // Determine platform badges
    let platforms: string[] = ["polymarket"];
    if (profileData.platform === "both") {
      platforms = ["polymarket", "kalshi"];
    } else if (profileData.platform === "kalshi") {
      platforms = ["kalshi"];
    } else if (profileData.platform === "opinion") {
      platforms = ["opinion"];
    }

    // Fetch history if applicable
    if (profileData.platform === "kalshi" || profileData.platform === "both") {
      try {
        const resHist = await fetch(`https://predicting.top/api/kalshi/${slug}/history`);
        if (resHist.ok) {
          historyData = await resHist.json();
        }
      } catch (e) {
        console.error("Failed to fetch trader history from upstream:", e);
      }
    }

    // Process history data if available
    let pnlHistory: Array<{ label: string; value: number }> = [];
    let wins = 0;
    let losses = 0;
    let monthlyPnlUsd = 0;
    let dayResults: Array<"win" | "loss" | "flat"> = [];
    let monthLabel = "Jul 2026";

    if (historyData?.history && historyData.history.length > 0) {
      const sortedHist = [...historyData.history].sort((a: any, b: any) => a.timestamp - b.timestamp);
      
      // Build P&L History for chart
      pnlHistory = sortedHist.map((pt: any) => ({
        label: new Date(pt.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        value: pt.pnl
      }));

      // Calculate daily P&L differences to populate monthly calendar
      // 1. Group by calendar date (YYYY-MM-DD) taking the last PnL of each day
      const dailyPnlMap = new Map<string, number>();
      sortedHist.forEach((pt: any) => {
        const dateStr = new Date(pt.timestamp).toISOString().split('T')[0];
        dailyPnlMap.set(dateStr, pt.pnl);
      });

      const uniqueDates = Array.from(dailyPnlMap.keys()).sort();
      const dailyChanges: Array<{ date: string; change: number }> = [];
      
      for (let i = 0; i < uniqueDates.length; i++) {
        const currentDate = uniqueDates[i];
        const currentPnl = dailyPnlMap.get(currentDate)!;
        const prevPnl = i > 0 ? dailyPnlMap.get(uniqueDates[i - 1])! : currentPnl;
        dailyChanges.push({
          date: currentDate,
          change: currentPnl - prevPnl
        });
      }

      // Filter daily changes for the last month present in the data
      if (uniqueDates.length > 0) {
        const lastDateStr = uniqueDates[uniqueDates.length - 1];
        const lastMonthStr = lastDateStr.substring(0, 7); // "YYYY-MM"
        
        const lastMonthDate = new Date(lastDateStr);
        monthLabel = lastMonthDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }); // e.g. "Jan 2026"
        
        const monthChanges = dailyChanges.filter(c => c.date.startsWith(lastMonthStr));
        
        monthlyPnlUsd = monthChanges.reduce((acc, c) => acc + c.change, 0);
        wins = monthChanges.filter(c => c.change > 0).length;
        losses = monthChanges.filter(c => c.change < 0).length;
        
        dayResults = monthChanges.map(c => {
          if (c.change > 1) return "win";
          if (c.change < -1) return "loss";
          return "flat";
        });
      }
    }

    profile = {
      slug: profileData.name,
      displayName: profileData.name,
      avatarUrl: profileData.pfp?.trim() || "",
      platforms,
      xLinked: !!profileData.twitter,
      smartScore: profileData.smart_score?.score ?? 50.0,
      monthlyPnlUsd,
      wins,
      losses,
      winRate: (profileData.smart_score?.winRate ?? 0.5) * 100,
      sharpe: profileData.smart_score?.sharpeRatio ?? 1.0,
      maxDrawdown: (profileData.smart_score?.maxDrawdownPercent ?? 0.1) * 100,
      profitFactor: profileData.smart_score?.profitFactor ?? 1.0,
      consistency: (profileData.smart_score?.rSquared ?? 0.8) * 100,
      pnlHistory,
      monthLabel,
      dayResults
    };
  } else {
    // Fall back to mock data
    profile = getTraderProfile(slug);
  }

  if (!profile) {
    notFound();
  }

  const joinedDate = profileData?.join_date
    ? `Joined ${new Date(profileData.join_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
    : profile.joinedDaysAgo
    ? `Joined ${new Date(Date.now() - profile.joinedDaysAgo * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
    : "Live trader";

  const smartLabel =
    profile.smartScore >= 75
      ? "Great"
      : profile.smartScore >= 60
      ? "Good"
      : profile.smartScore >= 40
      ? "Average"
      : "Weak";

  return (
    <main className="page-shell" style={{ maxWidth: "1000px" }}>
      {/* Back link */}
      <div style={{ marginBottom: "20px" }}>
        <Link
          href="/"
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: "0.85rem",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: "Inter, sans-serif",
          }}
        >
          ← Back to Leaderboard
        </Link>
      </div>

      {/* Profile Header */}
      <section
        className="panel profile-header"
        style={{
          marginBottom: "20px",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={profile.displayName}
              width={80}
              height={80}
              unoptimized
              style={{
                borderRadius: "50%",
                width: 80,
                height: 80,
                border: "2px solid rgba(46,230,139,0.4)",
                flexShrink: 0,
              }}
            />
          ) : (
            <div
              style={{
                borderRadius: "50%",
                width: 80,
                height: 80,
                border: "2px solid rgba(46,230,139,0.4)",
                flexShrink: 0,
                background: "#1e293b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                fontWeight: 800,
                color: "var(--muted)",
                fontFamily: "Inter, sans-serif"
              }}
            >
              {profile.displayName.trim()[0]?.toUpperCase() || "?"}
            </div>
          )}
          <div>
            {/* Name + badges row */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
              <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "#ffffff", fontFamily: "Inter,sans-serif" }}>
                {profile.displayName}
              </h1>
              <PlatformBadges platforms={profile.platforms} />
              {profile.xLinked && (
                <span
                  title="Linked X profile"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    display: "inline-flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, fill: "#ffffff" }}>
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </span>
              )}
            </div>
            {/* Platform text + joined */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ color: "#2ee68b", fontSize: "0.85rem", fontWeight: 600, fontFamily: "Inter,sans-serif" }}>
                {profile.platforms.join(" · ")}
              </span>
              <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", fontFamily: "Inter,sans-serif" }}>
                {joinedDate}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Month Calendar (interactive dropdown) */}
      {profile.dayResults && profile.dayResults.length > 0 && (
        <MonthCalendar
          monthLabel={profile.monthLabel || "Jul 2026"}
          monthlyPnlUsd={profile.monthlyPnlUsd}
          wins={profile.wins}
          losses={profile.losses}
          dayResults={profile.dayResults}
        />
      )}

      {/* P&L Chart */}
      {profile.pnlHistory?.length > 0 && (
        <ProfileChart data={profile.pnlHistory} />
      )}

      {/* Smart Score Panel */}
      <div
        style={{
          padding: "20px 24px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid var(--border)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>Smart Score</span>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "#ffffff" }}>
              {profile.smartScore.toFixed(1)}
            </span>
            <span
              style={{
                background: "rgba(46,230,139,0.15)",
                border: "1px solid rgba(46,230,139,0.3)",
                color: "#2ee68b",
                fontWeight: 700,
                fontSize: "0.82rem",
                padding: "4px 10px",
                borderRadius: "6px",
              }}
            >
              {smartLabel}
            </span>
          </div>
        </div>

        {/* Metrics grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "20px",
          }}
        >
          {[
            { label: "Win Rate", value: `${profile.winRate.toFixed(0)}%` },
            { label: "Sharpe", value: profile.sharpe.toFixed(2) },
            { label: "Max Drawdown", value: `${profile.maxDrawdown.toFixed(1)}%` },
            { label: "Profit Factor", value: profile.profitFactor.toFixed(2) },
            { label: "R²", value: `${profile.consistency.toFixed(0)}%` },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>{label}</div>
              <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#ffffff" }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Back button */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "36px" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "10px 24px",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "0.9rem",
            textDecoration: "none",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <span>←</span>
          <span>View Full Leaderboard</span>
        </Link>
      </div>
    </main>
  );
}
