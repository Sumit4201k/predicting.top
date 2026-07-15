import {
  PlatformCode,
  RecentTrade,
  PositionMarket,
  PositionTrader,
  TrendingMarket,
  TraderSummary,
  TraderProfile
} from "./types";

const UPSTREAM_BASE_URL = "https://predicting.top";

// Helper to fetch from upstream predicting.top API
async function fetchUpstream(path: string, query: Record<string, string> = {}) {
  const url = new URL(`${UPSTREAM_BASE_URL}${path}`);
  Object.keys(query).forEach(key => {
    if (query[key] !== undefined && query[key] !== null) {
      url.searchParams.append(key, query[key]);
    }
  });

  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": `${UPSTREAM_BASE_URL}/`,
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9"
  };

  const response = await fetch(url.toString(), {
    method: "GET",
    headers,
    next: { revalidate: 30 } // Cache results for 30 seconds
  });

  if (!response.ok) {
    throw new Error(`Upstream returned ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// 1. Leaderboard / Rankings
export async function getLiveLeaderboard(filters: {
  search?: string;
  platform?: "ALL" | "PM" | "KS" | "OL";
  sort?: "smart_score" | "sharpe" | "win_rate" | "roi" | "pnl";
  period?: "1D" | "1M" | "YTD" | "ALL";
  minPnl?: number;
  xLinkedOnly?: boolean;
}): Promise<TraderSummary[]> {
  const period = filters.period || "1M";
  
  // Map period to upstream period parameter
  let upstreamPeriod = "30d";
  if (period === "1D" || period === "1M") upstreamPeriod = "30d";
  else if (period === "YTD") upstreamPeriod = "ytd";
  else if (period === "ALL") upstreamPeriod = "all";

  const data = await fetchUpstream("/api/leaderboard", { period: upstreamPeriod });
  const rawTraders = data.traders || [];

  let mapped: TraderSummary[] = rawTraders.map((t: any) => {
    const stats = t.stats || {};
    const ss = t.smart_score || {};

    const platforms: PlatformCode[] = [];
    if (t.platform === "polymarket" || t.platform === "both") platforms.push("PM");
    if (t.platform === "kalshi" || t.platform === "both") platforms.push("KS");
    if (t.opinion_profile) platforms.push("OL");
    if (platforms.length === 0) platforms.push("PM");

    const winRate = ss.winRate != null ? ss.winRate * 100 : 50;
    const roi = stats.roi != null ? stats.roi : winRate; 

    return {
      rank: t.rank || 99,
      slug: t.name,
      displayName: t.name,
      avatarUrl: t.pfp || `https://api.dicebear.com/9.x/glass/svg?seed=${t.name}`,
      platforms,
      joinedDaysAgo: t.join_date ? Math.round((Date.now() - new Date(t.join_date).getTime()) / 86400000) : 365,
      pnlUsd: stats.pnl || 0,
      monthlyPnlUsd: stats.pnl || 0,
      wins: stats.buys || 0,
      losses: stats.sells || 0,
      wallet: t.wallet || t.opinion_wallet || "",
      profileViews: t.views || 0,
      xLinked: !!t.twitter,
      smartScore: ss.score || 0,
      sharpe: ss.sharpeRatio || 0,
      winRate,
      roi,
      maxDrawdown: ss.maxDrawdownPercent != null ? ss.maxDrawdownPercent * 100 : 0,
      profitFactor: ss.profitFactor || 1.0,
      consistency: ss.rSquared != null ? ss.rSquared * 100 : 50
    };
  });

  // Apply filters
  if (filters.search) {
    const query = filters.search.toLowerCase();
    mapped = mapped.filter(
      t => t.displayName.toLowerCase().includes(query) || t.wallet.toLowerCase().includes(query)
    );
  }

  if (filters.platform && filters.platform !== "ALL") {
    mapped = mapped.filter(t => t.platforms.includes(filters.platform as PlatformCode));
  }

  if (filters.minPnl !== undefined && filters.minPnl !== 0) {
    mapped = mapped.filter(t => t.pnlUsd >= (filters.minPnl || 0));
  }

  if (filters.xLinkedOnly) {
    mapped = mapped.filter(t => t.xLinked);
  }

  // Apply Sorting
  const sortKey = filters.sort || "smart_score";
  mapped.sort((a, b) => {
    if (sortKey === "smart_score") return b.pnlUsd - a.pnlUsd;
    if (sortKey === "sharpe") return b.sharpe - a.sharpe;
    if (sortKey === "win_rate") return b.winRate - a.winRate;
    if (sortKey === "roi") return b.roi - a.roi;
    if (sortKey === "pnl") return b.pnlUsd - a.pnlUsd;
    return 0;
  });

  // Deduplicate by slug
  const seen = new Set<string>();
  mapped = mapped.filter(t => {
    if (seen.has(t.slug)) return false;
    seen.add(t.slug);
    return true;
  });

  // Re-calculate ranks for output
  return mapped.map((t, idx) => ({ ...t, rank: idx + 1 }));
}

// Helper to estimate daily chips
function generateDayResults(history: any[], winRate: number): ("win" | "loss" | "flat")[] {
  if (!history || history.length === 0) {
    const results: ("win" | "loss" | "flat")[] = [];
    const winChance = winRate / 100;
    for (let i = 0; i < 30; i++) {
      const r = Math.random();
      if (r < winChance) results.push("win");
      else if (r < winChance + (1 - winChance) * 0.8) results.push("loss");
      else results.push("flat");
    }
    return results;
  }

  const dayPnls: Record<string, number> = {};
  history.forEach(h => {
    const dateStr = new Date(h.date || h.timestamp).toISOString().split("T")[0];
    dayPnls[dateStr] = h.pnl;
  });

  const dates = Object.keys(dayPnls).sort();
  const results: ("win" | "loss" | "flat")[] = [];

  for (let i = 1; i < dates.length; i++) {
    const prev = dayPnls[dates[i - 1]];
    const curr = dayPnls[dates[i]];
    const diff = curr - prev;
    if (diff > 5) results.push("win");
    else if (diff < -5) results.push("loss");
    else results.push("flat");
  }

  if (results.length === 0) {
    return Array(30).fill("flat");
  }

  while (results.length < 30) {
    results.push(results[Math.floor(Math.random() * results.length)]);
  }

  return results.slice(-30);
}

// 2. Trader Profile
export async function getLiveTraderProfile(slug: string): Promise<TraderProfile | null> {
  try {
    const data = await fetchUpstream(`/api/trader/${slug}`);
    if (!data || !data.trader) return null;

    const t = data.trader;
    const stats = t.stats || {};
    const ss = t.smart_score || {};

    const platforms: PlatformCode[] = [];
    if (t.platform === "polymarket" || t.platform === "both") platforms.push("PM");
    if (t.platform === "kalshi" || t.platform === "both") platforms.push("KS");
    if (t.opinion_profile) platforms.push("OL");
    if (platforms.length === 0) platforms.push("PM");

    // Fetch history
    let pnlHistory: Array<{ label: string; value: number }> = [];
    let dayResults: Array<"win" | "loss" | "flat"> = [];
    
    try {
      const historyData = await fetchUpstream(`/api/kalshi/${slug}/history`);
      const rawHistory = historyData.history || [];
      
      // Map P&L history (sample down to 80 points maximum to prevent slow chart rendering)
      const step = Math.max(1, Math.ceil(rawHistory.length / 80));
      const sampled = rawHistory.filter((_: any, idx: number) => idx % step === 0);
      
      pnlHistory = sampled.map((h: any) => {
        const d = new Date(h.date || h.timestamp);
        const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        return { label, value: h.pnl };
      });

      const winRate = ss.winRate != null ? ss.winRate * 100 : 50;
      dayResults = generateDayResults(rawHistory, winRate);
    } catch (err) {
      console.error(`Failed to load history for ${slug}:`, err);
      dayResults = Array(30).fill("flat");
    }

    const winRate = ss.winRate != null ? ss.winRate * 100 : 50;

    return {
      rank: t.rank || 99,
      slug: t.name,
      displayName: t.name,
      avatarUrl: t.pfp || `https://api.dicebear.com/9.x/glass/svg?seed=${t.name}`,
      platforms,
      joinedDaysAgo: t.join_date ? Math.round((Date.now() - new Date(t.join_date).getTime()) / 86400000) : 365,
      pnlUsd: (stats["all"] && stats["all"].pnl) || 0,
      monthlyPnlUsd: (stats["30d"] && stats["30d"].pnl) || 0,
      wins: (stats["all"] && stats["all"].buys) || 0,
      losses: (stats["all"] && stats["all"].sells) || 0,
      wallet: t.wallet || t.opinion_wallet || "",
      profileViews: t.views || 0,
      xLinked: !!t.twitter,
      smartScore: ss.score || 0,
      sharpe: ss.sharpeRatio || 0,
      winRate,
      roi: (stats["all"] && stats["all"].roi) || winRate,
      maxDrawdown: ss.maxDrawdownPercent != null ? ss.maxDrawdownPercent * 100 : 0,
      profitFactor: ss.profitFactor || 1.0,
      consistency: ss.rSquared != null ? ss.rSquared * 100 : 50,
      bio: t.polynoob_story || `Prediction trader specializing in ${platforms.map(p => p === "PM" ? "Polymarket" : "Kalshi").join(" & ")}.`,
      monthLabel: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      dayResults,
      pnlHistory
    };
  } catch (error) {
    console.error(`Error loading trader ${slug}:`, error);
    return null;
  }
}

// 3. Positions
export async function getLivePositions(side: "ALL" | "YES" | "NO", platform: "ALL" | "PM" | "KS" | "OL"): Promise<PositionMarket[]> {
  const data = await fetchUpstream("/api/p/overview");
  const rawPositions = data.positions || [];

  // Build a lookup map of trader names to their Sharpe ratios and avatar URLs
  const traderMetrics = new Map<string, { score: number; sharpe: number; avatarUrl: string }>();
  try {
    const lbData = await fetchUpstream("/api/leaderboard", { period: "all" });
    const lbTraders = lbData.traders || [];
    lbTraders.forEach((t: any) => {
      traderMetrics.set(t.name.toLowerCase(), {
        score: (t.smart_score && t.smart_score.score) || 50,
        sharpe: (t.smart_score && t.smart_score.sharpeRatio) || 1.0,
        avatarUrl: t.pfp || ""
      });
    });
  } catch (err) {
    console.error("Failed to fetch leaderboard cache for positions:", err);
  }

  // Group flat position list by market name ONLY
  const marketGroups: Record<string, {
    title: string;
    platform: PlatformCode;
    endsIn: string;
    priceLabel: string;
    icon: string;
    traders: PositionTrader[];
  }> = {};

  rawPositions.forEach((pos: any) => {
    const title = pos.market;
    const isPolymarket = pos.polymarket_url && pos.polymarket_url.includes("polymarket");
    const itemPlatform: PlatformCode = isPolymarket ? "PM" : "KS";
    const itemSide: "YES" | "NO" = pos.outcome.toUpperCase() === "YES" ? "YES" : "NO";
    
    // Apply platform and side filter at source level
    if (side !== "ALL" && itemSide !== side) return;
    if (platform !== "ALL" && itemPlatform !== platform) return;

    // Group key is the market title
    const key = title;

    if (!marketGroups[key]) {
      // Estimate relative endsIn text
      const endsIn = pos.ends_in || "5mo left";
      const currentPrice = pos.current_price != null ? `${Math.round(pos.current_price * 100)}¢` : "50¢";

      marketGroups[key] = {
        title,
        platform: itemPlatform,
        endsIn,
        priceLabel: currentPrice,
        icon: pos.icon || "",
        traders: []
      };
    }

    const tName = pos.trader_name || "";
    const metrics = traderMetrics.get(tName.toLowerCase()) || {
      score: pos.trader_score || 50,
      sharpe: pos.trader_sharpe || 1.0,
      avatarUrl: pos.pfp || ""
    };

    marketGroups[key].traders.push({
      traderSlug: pos.trader_name,
      traderName: pos.trader_name,
      avatarUrl: metrics.avatarUrl || pos.pfp || "",
      score: metrics.score,
      entry: pos.avg_price || 0.5,
      pnlUsd: pos.cash_pnl || 0,
      shares: Math.round(pos.size).toLocaleString(),
      valueUsd: pos.current_value || 0,
      sharpe: metrics.sharpe,
      side: itemSide
    });
  });

  // Convert map to PositionMarket array
  const markets: PositionMarket[] = Object.keys(marketGroups).map(key => {
    const group = marketGroups[key];
    
    // Sort traders by valueUsd descending
    group.traders.sort((a, b) => b.valueUsd - a.valueUsd);

    const totalValue = group.traders.reduce((acc, t) => acc + t.valueUsd, 0);

    // Calculate Yes/No volume split percentages
    const yesValue = group.traders.filter(t => t.side === "YES").reduce((acc, t) => acc + t.valueUsd, 0);
    const smartMoneyYes = totalValue > 0 ? Math.round((yesValue / totalValue) * 100) : 50;
    const smartMoneyNo = 100 - smartMoneyYes;

    // Count unique traders
    const uniqueTraders = new Set(group.traders.map(t => t.traderName.toLowerCase())).size;

    return {
      slug: key.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: group.title,
      platform: group.platform,
      side: "YES", // default fallback side
      marketValueUsd: totalValue,
      smartMoneyShare: totalValue > 50000 ? 85 : 65, // legacy share ratio
      traders: group.traders,
      endsIn: group.endsIn,
      priceLabel: group.priceLabel,
      marketIcon: group.icon,
      smartMoneyYes,
      smartMoneyNo,
      tradersCount: uniqueTraders
    };
  });

  return markets;
}

// Helper to format volume labels
function fmtVolume(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M volume`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}k volume`;
  return `$${n.toFixed(0)} volume`;
}

function formatRelativeTime(isoString: string | null | undefined): string {
  if (!isoString) return "live";
  try {
    const tradeTime = new Date(isoString).getTime();
    if (isNaN(tradeTime)) return "live";
    const now = Date.now();
    const diffMs = now - tradeTime;
    if (diffMs <= 0) return "just now";
    
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) {
      return `${diffMins}m`;
    }
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours}hr`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
  } catch (e) {
    return "live";
  }
}

// 4. Trending Markets
export async function getLiveTrendingMarkets(window: string, query?: string): Promise<TrendingMarket[]> {
  const periodParam = (window || "1w").toLowerCase();
  const data = await fetchUpstream("/api/m/insights", { limit: "24", period: periodParam });
  const rawMarkets = data.markets || [];

  // Build a lookup map of trader names to their Sharpe ratios and scores
  const traderMetrics = new Map<string, { score: number; sharpe: number; avatarUrl: string }>();
  try {
    const lbData = await fetchUpstream("/api/leaderboard", { period: "all" });
    const lbTraders = lbData.traders || [];
    lbTraders.forEach((t: any) => {
      traderMetrics.set(t.name.toLowerCase(), {
        score: (t.smart_score && t.smart_score.score) || 50,
        sharpe: (t.smart_score && t.smart_score.sharpeRatio) || 1.0,
        avatarUrl: t.pfp || `https://api.dicebear.com/9.x/glass/svg?seed=${t.name}`
      });
    });
  } catch (err) {
    console.error("Failed to fetch leaderboard cache for trending markets:", err);
  }

  let mapped: TrendingMarket[] = rawMarkets.map((m: any) => {
    const isPolymarket = m.polymarket_url && m.polymarket_url.includes("polymarket");
    const platform: PlatformCode = isPolymarket ? "PM" : "KS";

    // Estimate probability from yesVolume/totalVolume or default
    const probability = m.yesVolume && m.totalVolume 
      ? Math.round((m.yesVolume / m.totalVolume) * 100) 
      : 50;

    const traders = (m.topTraders || []).slice(0, 3).map((t: any) => {
      const tName = t.name || "";
      const metrics = traderMetrics.get(tName.toLowerCase()) || {
        score: 65,
        sharpe: 1.0,
        avatarUrl: t.pfp || `https://api.dicebear.com/9.x/glass/svg?seed=${tName}`
      };

      return {
        name: tName,
        txs: `${t.buys || 0}b / ${t.sells || 0}s`,
        inflow: Math.round(t.netInflow || (t.buyVolume - t.sellVolume || 0)),
        last: formatRelativeTime(t.lastTradeTime),
        score: metrics.score,
        sharpe: metrics.sharpe,
        avatarUrl: t.pfp || metrics.avatarUrl || `https://api.dicebear.com/9.x/glass/svg?seed=${tName}`
      };
    });

    return {
      slug: m.eventSlug || m.market.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: m.market,
      platform,
      volumeLabel: fmtVolume(m.totalVolume || 0),
      momentum: `+$${Math.round(m.netInflow || 0).toLocaleString()}`,
      probability: probability >= 0 && probability <= 100 ? probability : 50,
      traders,
      url: m.polymarket_url || "https://polymarket.com",
      endsIn: "Active",
      icon: m.icon || ""
    };
  });

  if (query) {
    const q = query.toLowerCase();
    mapped = mapped.filter(m => m.title.toLowerCase().includes(q));
  }

  return mapped;
}

function getCategory(title: string): string {
  const t = title.toLowerCase();
  const sportsKeywords = ["nfl", "nba", "mlb", "nhl", "fifa", "soccer", "football", "tennis", "f1", "formula 1", "super bowl", "cup", "game", "match", "playoff", "tournament", "olympics", "cricket", "baseball", "basketball", "champion", "copa", "euros"];
  if (sportsKeywords.some(kw => t.includes(kw))) {
    return "Sports";
  }
  const politicsKeywords = ["election", "trump", "biden", "harris", "president", "senate", "house", "republican", "democrat", "candidate", "vote", "iran", "invade", "war", "conflict", "ceasefire", "ukraine", "putin", "nato", "israel", "gaza"];
  if (politicsKeywords.some(kw => t.includes(kw))) {
    return "Politics";
  }
  return "Macro";
}

// 5. Recent Trades
export async function getLiveRecentTrades(limit: number = 100, minAmount: number = 100): Promise<RecentTrade[]> {
  const data = await fetchUpstream("/api/trades/recent", { limit: limit.toString(), minAmount: minAmount.toString() });
  const rawTrades = data.trades || [];

  // Build a lookup map of trader names to their Sharpe ratios and scores
  const traderMetrics = new Map<string, { score: number; sharpe: number; avatarUrl: string }>();
  try {
    const lbData = await fetchUpstream("/api/leaderboard", { period: "all" });
    const lbTraders = lbData.traders || [];
    lbTraders.forEach((t: any) => {
      traderMetrics.set(t.name.toLowerCase(), {
        score: (t.smart_score && t.smart_score.score) || 50,
        sharpe: (t.smart_score && t.smart_score.sharpeRatio) || 1.0,
        avatarUrl: t.pfp || `https://api.dicebear.com/9.x/glass/svg?seed=${t.name}`
      });
    });
  } catch (err) {
    console.error("Failed to fetch leaderboard cache for recent trades:", err);
  }

  const mapped: RecentTrade[] = rawTrades.map((t: any) => {
    const isPolymarket = t.polymarket_url && t.polymarket_url.includes("polymarket");
    const platform: PlatformCode = isPolymarket ? "PM" : "KS";

    const tName = t.trader_name || "";
    const metrics = traderMetrics.get(tName.toLowerCase()) || {
      score: 65,
      sharpe: 1.0,
      avatarUrl: `https://api.dicebear.com/9.x/glass/svg?seed=${tName}`
    };

    return {
      id: t.id,
      traderSlug: t.trader_name,
      traderName: t.trader_name,
      marketTitle: t.market,
      side: t.outcome.toUpperCase() === "YES" ? "YES" : "NO",
      sizeUsd: t.amount || 0,
      timestamp: t.timestamp || "just now",
      platform,
      price: t.price != null ? Math.round(t.price * 100) : 50,
      traderScore: metrics.score,
      traderSharpe: metrics.sharpe,
      category: getCategory(t.market),
      type: t.type === "sell" ? "sell" : "buy",
      avatarUrl: metrics.avatarUrl
    };
  });

  return mapped.filter(t => t.sizeUsd >= minAmount).slice(0, limit);
}

export async function getLiveDailyProfit() {
  try {
    const data = await fetchUpstream("/api/daily-profit");
    return {
      dailyProfit: data.raw != null ? data.raw : 0,
      tradersCount: data.traders_count || 280
    };
  } catch (error) {
    console.error("Error fetching daily profit:", error);
    return {
      dailyProfit: 0,
      tradersCount: 280
    };
  }
}
