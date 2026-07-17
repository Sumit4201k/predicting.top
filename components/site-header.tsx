import Link from "next/link";

export function SiteHeader({ active }: { active?: string }) {
  if (active === "none") return null;

  const links = [
    { label: "Leaderboard", value: "leaderboard", href: "/" },
    { label: "Positions", value: "positions", href: "/positions" },
    { label: "Trending Markets", value: "trending", href: "/markets/trending" },
    { label: "Recent Trades", value: "trades", href: "/trades/recent" }
  ];

  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 20px",
      marginBottom: "28px",
      borderRadius: "12px",
      border: "1px solid var(--border)",
      background: "rgba(255, 255, 255, 0.02)",
      backdropFilter: "blur(12px)",
      width: "100%",
      fontFamily: "Inter, sans-serif"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Link href="/" style={{
          fontSize: "1.2rem",
          fontWeight: 800,
          color: "var(--text)",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          letterSpacing: "-0.02em"
        }}>
          <span style={{
            background: "linear-gradient(135deg, #2ee68b 0%, #5ea5ff 100%)",
            width: "20px",
            height: "20px",
            borderRadius: "5px",
            display: "inline-block"
          }} />
          Predicting<span style={{ color: "var(--green)" }}>.top</span>
        </Link>
      </div>

      <nav style={{
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}>
        {links.map((link) => {
          const isActive = active === link.value;
          return (
            <Link
              key={link.value}
              href={link.href}
              style={{
                fontSize: "0.85rem",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "var(--text)" : "var(--muted)",
                textDecoration: "none",
                transition: "color 120ms ease, background-color 120ms ease",
                padding: "6px 12px",
                borderRadius: "6px",
                background: isActive ? "rgba(255, 255, 255, 0.06)" : "transparent",
                border: isActive ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid transparent"
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
