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
  const profile = getTraderProfile(slug);

  if (!profile) {
    notFound();
  }

  const joinedDate = profile.joinedDaysAgo
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
      <MonthCalendar
        monthLabel={profile.monthLabel || "Jul 2026"}
        monthlyPnlUsd={profile.monthlyPnlUsd}
        wins={profile.wins}
        losses={profile.losses}
        dayResults={profile.dayResults || ["win", "win", "flat", "loss", "win"]}
      />

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
