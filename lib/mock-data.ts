import {
  LeaderboardSortKey,
  PeriodKey,
  PlatformCode,
  PositionMarket,
  RecentTrade,
  TraderProfile,
  TraderSummary,
  TrendWindow,
  TrendingMarket
} from "@/lib/types";

const traders: TraderProfile[] = [
  {
    rank: 1,
    slug: "haon",
    displayName: "haon",
    avatarUrl: "https://api.dicebear.com/9.x/glass/svg?seed=haon",
    platforms: ["KS"],
    joinedDaysAgo: 772,
    pnlUsd: 54646.35,
    monthlyPnlUsd: 54646.35,
    wins: 12,
    losses: 4,
    wallet: "0xhaon",
    profileViews: 12345,
    xLinked: true,
    smartScore: 66.9,
    sharpe: 2.15,
    winRate: 66.9,
    roi: 24.5,
    maxDrawdown: 12.5,
    profitFactor: 1.65,
    consistency: 85,
    bio: "Consistent prediction market trader.",
    monthLabel: "Jul 2026",
    dayResults: ["win", "win", "flat", "loss", "win"],
    pnlHistory: [
      { label: "Dec 27", value: 35000 },
      { label: "Jan 1", value: 36000 },
      { label: "Today", value: 54646 }
    ]
  },
  {
    rank: 2,
    slug: "iqdegen",
    displayName: "IqDegen",
    avatarUrl: "https://api.dicebear.com/9.x/glass/svg?seed=iqdegen",
    platforms: ["PM"],
    joinedDaysAgo: 700,
    pnlUsd: 41790.80,
    monthlyPnlUsd: 41790.80,
    wins: 10,
    losses: 5,
    wallet: "0xiqdegen",
    profileViews: 8321,
    xLinked: true,
    smartScore: 32.9,
    sharpe: 1.15,
    winRate: 32.9,
    roi: 18.2,
    maxDrawdown: 25.4,
    profitFactor: 1.25,
    consistency: 55,
    bio: "Aggressive predictor.",
    monthLabel: "Jul 2026",
    dayResults: ["loss", "win", "flat", "loss", "win"],
    pnlHistory: [
      { label: "Dec 27", value: 20000 },
      { label: "Jan 1", value: 25000 },
      { label: "Today", value: 41790 }
    ]
  },
  {
    rank: 3,
    slug: "robdfs",
    displayName: "RobDFS",
    avatarUrl: "https://api.dicebear.com/9.x/glass/svg?seed=robdfs",
    platforms: ["KS"],
    joinedDaysAgo: 438,
    pnlUsd: 21899.19,
    monthlyPnlUsd: 21899.19,
    wins: 8,
    losses: 6,
    wallet: "0xrobdfs",
    profileViews: 4321,
    xLinked: true,
    smartScore: 49.5,
    sharpe: 1.45,
    winRate: 49.5,
    roi: 15.4,
    maxDrawdown: 18.2,
    profitFactor: 1.35,
    consistency: 70,
    bio: "Focus on sports and macro event markets.",
    monthLabel: "Jul 2026",
    dayResults: ["win", "loss", "flat", "win", "loss"],
    pnlHistory: [
      { label: "Dec 27", value: 10000 },
      { label: "Jan 1", value: 12000 },
      { label: "Today", value: 21899 }
    ]
  },
  {
    rank: 4,
    slug: "cigarettes",
    displayName: "cigarettes",
    avatarUrl: "https://api.dicebear.com/9.x/glass/svg?seed=cigarettes",
    platforms: ["OL", "PM"],
    joinedDaysAgo: 658,
    pnlUsd: 19051.00,
    monthlyPnlUsd: 19051.00,
    wins: 15,
    losses: 10,
    wallet: "0xcigarettes",
    profileViews: 9542,
    xLinked: true,
    smartScore: 60.0,
    sharpe: 1.85,
    winRate: 60.0,
    roi: 22.4,
    maxDrawdown: 14.5,
    profitFactor: 1.55,
    consistency: 80,
    bio: "Trading macro and politics with high conviction.",
    monthLabel: "Jul 2026",
    dayResults: ["win", "win", "loss", "flat", "win"],
    pnlHistory: [
      { label: "Dec 27", value: 8000 },
      { label: "Jan 1", value: 11000 },
      { label: "Today", value: 19051 }
    ]
  },
  {
    rank: 5,
    slug: "sorcerer",
    displayName: "sorcerer.money",
    avatarUrl: "https://api.dicebear.com/9.x/glass/svg?seed=sorcerer",
    platforms: ["PM", "KS"],
    joinedDaysAgo: 767,
    pnlUsd: 10444.64,
    monthlyPnlUsd: 10444.64,
    wins: 11,
    losses: 9,
    wallet: "0xsorcerer",
    profileViews: 7642,
    xLinked: true,
    smartScore: 47.1,
    sharpe: 1.25,
    winRate: 47.1,
    roi: 14.8,
    maxDrawdown: 22.1,
    profitFactor: 1.15,
    consistency: 65,
    bio: "Sorcerer of predictions.",
    monthLabel: "Jul 2026",
    dayResults: ["loss", "win", "flat", "loss", "win"],
    pnlHistory: [
      { label: "Dec 27", value: 5000 },
      { label: "Jan 1", value: 7000 },
      { label: "Today", value: 10444 }
    ]
  },
  {
    rank: 6,
    slug: "coby",
    displayName: "Coby",
    avatarUrl: "https://api.dicebear.com/9.x/glass/svg?seed=coby",
    platforms: ["KS"],
    joinedDaysAgo: 619,
    pnlUsd: 10171.23,
    monthlyPnlUsd: 10171.23,
    wins: 20,
    losses: 8,
    wallet: "0xcoby",
    profileViews: 14201,
    xLinked: true,
    smartScore: 84.1,
    sharpe: 2.45,
    winRate: 84.1,
    roi: 38.2,
    maxDrawdown: 10.5,
    profitFactor: 2.15,
    consistency: 92,
    bio: "Elite predictor and event trader.",
    monthLabel: "Jul 2026",
    dayResults: ["win", "win", "flat", "win", "win"],
    pnlHistory: [
      { label: "Dec 27", value: 4000 },
      { label: "Jan 1", value: 6000 },
      { label: "Today", value: 10171 }
    ]
  },
  {
    rank: 7,
    slug: "user-x",
    displayName: "user.x",
    avatarUrl: "https://api.dicebear.com/9.x/glass/svg?seed=userx",
    platforms: ["KS"],
    joinedDaysAgo: 377,
    pnlUsd: 8805.50,
    monthlyPnlUsd: 8805.50,
    wins: 14,
    losses: 6,
    wallet: "0xuserx",
    profileViews: 5431,
    xLinked: true,
    smartScore: 79.2,
    sharpe: 2.05,
    winRate: 79.2,
    roi: 32.4,
    maxDrawdown: 11.8,
    profitFactor: 1.95,
    consistency: 88,
    bio: "Short-horizon macro trader.",
    monthLabel: "Jul 2026",
    dayResults: ["win", "flat", "win", "loss", "win"],
    pnlHistory: [
      { label: "Dec 27", value: 3000 },
      { label: "Jan 1", value: 5000 },
      { label: "Today", value: 8805 }
    ]
  },
  {
    rank: 8,
    slug: "eltonma",
    displayName: "EltonMa",
    avatarUrl: "https://api.dicebear.com/9.x/glass/svg?seed=eltonma",
    platforms: ["PM"],
    joinedDaysAgo: 534,
    pnlUsd: 8206.07,
    monthlyPnlUsd: 8206.07,
    wins: 9,
    losses: 8,
    wallet: "0xeltonma",
    profileViews: 3211,
    xLinked: true,
    smartScore: 25.1,
    sharpe: 0.95,
    winRate: 25.1,
    roi: 11.2,
    maxDrawdown: 28.5,
    profitFactor: 1.05,
    consistency: 52,
    bio: "Trading active tech and sports markets.",
    monthLabel: "Jul 2026",
    dayResults: ["loss", "flat", "win", "loss", "flat"],
    pnlHistory: [
      { label: "Dec 27", value: 2000 },
      { label: "Jan 1", value: 4000 },
      { label: "Today", value: 8206 }
    ]
  },
  {
    rank: 9,
    slug: "domer",
    displayName: "Domer",
    avatarUrl: "https://api.dicebear.com/9.x/glass/svg?seed=domer",
    platforms: ["PM", "KS"],
    joinedDaysAgo: 1654,
    pnlUsd: 7080.75,
    monthlyPnlUsd: 7080.75,
    wins: 45,
    losses: 30,
    wallet: "0xdomer",
    profileViews: 24501,
    xLinked: true,
    smartScore: 72.9,
    sharpe: 2.18,
    winRate: 72.9,
    roi: 28.5,
    maxDrawdown: 13.4,
    profitFactor: 1.78,
    consistency: 89,
    bio: "Legendary prediction market veteran.",
    monthLabel: "Jul 2026",
    dayResults: ["win", "win", "flat", "loss", "win"],
    pnlHistory: [
      { label: "Dec 27", value: 1000 },
      { label: "Jan 1", value: 3000 },
      { label: "Today", value: 7080 }
    ]
  },
  {
    rank: 10,
    slug: "aenews",
    displayName: "aenews",
    avatarUrl: "https://api.dicebear.com/9.x/glass/svg?seed=aenews",
    platforms: ["PM"],
    joinedDaysAgo: 320,
    pnlUsd: 5420.00,
    monthlyPnlUsd: 5420.00,
    wins: 9,
    losses: 5,
    wallet: "0xaenews",
    profileViews: 2134,
    xLinked: false,
    smartScore: 58.3,
    sharpe: 1.62,
    winRate: 58.3,
    roi: 19.1,
    maxDrawdown: 16.4,
    profitFactor: 1.42,
    consistency: 72,
    bio: "Fast-moving event and politics trader.",
    monthLabel: "Jul 2026",
    dayResults: ["win", "loss", "win", "flat", "win"],
    pnlHistory: [
      { label: "Dec 27", value: 1500 },
      { label: "Jan 1", value: 2800 },
      { label: "Today", value: 5420 }
    ]
  },
  {
    rank: 11,
    slug: "labvek",
    displayName: "labvek",
    avatarUrl: "https://api.dicebear.com/9.x/glass/svg?seed=labvek",
    platforms: ["PM"],
    joinedDaysAgo: 490,
    pnlUsd: 14870.50,
    monthlyPnlUsd: 14870.50,
    wins: 18,
    losses: 7,
    wallet: "0xlabvek",
    profileViews: 6782,
    xLinked: true,
    smartScore: 71.4,
    sharpe: 2.08,
    winRate: 71.4,
    roi: 31.2,
    maxDrawdown: 11.9,
    profitFactor: 1.88,
    consistency: 86,
    bio: "Sports & politics prediction specialist.",
    monthLabel: "Jul 2026",
    dayResults: ["win", "win", "flat", "win", "loss"],
    pnlHistory: [
      { label: "Dec 27", value: 4000 },
      { label: "Jan 1", value: 8000 },
      { label: "Today", value: 14870 }
    ]
  }
];

const trendingMarkets: TrendingMarket[] = [
  {
    slug: "fed-july-2026",
    title: "Will there be no change in Fed interest rates after the July 2026 meeting?",
    platform: "PM",
    volumeLabel: "$1.8M today",
    momentum: "+14.2%",
    probability: 97,
    traders: [
      { name: "wkmfa57", txs: "132/5", inflow: 264004, last: "2d" },
      { name: "sorcerer", txs: "13/47", inflow: -24473, last: "7hr" },
      { name: "x.compo...", txs: "34/29", inflow: -41528, last: "8hr" },
      { name: "trader4", txs: "12/4", inflow: 15000, last: "1d" },
      { name: "trader5", txs: "8/2", inflow: 8000, last: "3d" },
      { name: "trader6", txs: "5/1", inflow: 2000, last: "5d" }
    ],
    url: "https://polymarket.com",
    endsIn: "16d left"
  },
  {
    slug: "hormuz-july-31",
    title: "Strait of Hormuz traffic returns to normal by July 31?",
    platform: "PM",
    volumeLabel: "$339k tracked",
    momentum: "-$190,006",
    probability: 3,
    traders: [
      { name: "losingan...", txs: "2/0", inflow: 375, last: "1d" },
      { name: "MistaJen...", txs: "1/0", inflow: 119, last: "5d" },
      { name: "Rooke B...", txs: "1/0", inflow: 115, last: "2d" }
    ],
    url: "https://polymarket.com",
    endsIn: "45d left"
  },
  {
    slug: "argentina-world-cup",
    title: "Will Argentina win the 2026 FIFA World Cup?",
    platform: "PM",
    volumeLabel: "$300k tracked",
    momentum: "+$20,648",
    probability: 18,
    traders: [
      { name: "Parz1val", txs: "3/10", inflow: 2612, last: "11hr" },
      { name: "debased", txs: "43/17", inflow: 5971, last: "1d" },
      { name: "Xplayer", txs: "20/10", inflow: 6814, last: "10hr" }
    ],
    url: "https://polymarket.com",
    endsIn: "163h left"
  },
  {
    slug: "us-election-2024",
    title: "Who will win the 2024 US Presidential Election?",
    platform: "PM",
    volumeLabel: "$3.2B tracked",
    momentum: "$0",
    probability: 100,
    traders: [
      { name: "DonaldT", txs: "1/0", inflow: 1000000, last: "1y" }
    ],
    url: "https://polymarket.com",
    endsIn: "Ended"
  }
];

const recentTrades: RecentTrade[] = [
  {
    id: "t1",
    traderSlug: "aenews",
    traderName: "aenews",
    marketTitle: "No Fed change in July 2026?",
    side: "YES",
    sizeUsd: 450,
    timestamp: "2m ago",
    platform: "PM",
    price: 47,
    traderScore: 2.33,
    category: "Politics"
  },
  {
    id: "t2",
    traderSlug: "labvek",
    traderName: "labvek",
    marketTitle: "Will Lionel Messi be the top goalscorer?",
    side: "YES",
    sizeUsd: 16930,
    timestamp: "1 hour ago",
    platform: "PM",
    price: 34,
    traderScore: 0.46,
    category: "Sports"
  },
  {
    id: "t3",
    traderSlug: "iqdegen",
    traderName: "IqDegen",
    marketTitle: "Will there be no change in Fed interest rates in July?",
    side: "YES",
    sizeUsd: 1520,
    timestamp: "1 hour ago",
    platform: "PM",
    price: 76,
    traderScore: -0.93,
    category: "Macro"
  },
  {
    id: "t4",
    traderSlug: "robdfs",
    traderName: "RobDFS",
    marketTitle: "Will the Republican Party control the House in 2028?",
    side: "NO",
    sizeUsd: 850,
    timestamp: "2 hours ago",
    platform: "PM",
    price: 83,
    traderScore: 2.92,
    category: "Politics"
  },
  {
    id: "t5",
    traderSlug: "labvek",
    traderName: "labvek",
    marketTitle: "Will Mitch McConnell step down in 2026?",
    side: "NO",
    sizeUsd: 31874,
    timestamp: "2 hours ago",
    platform: "PM",
    price: 68,
    traderScore: 3.56,
    category: "Politics"
  },
  {
    id: "t6",
    traderSlug: "haon",
    traderName: "haon",
    marketTitle: "Will NVIDIA be the largest company by market cap?",
    side: "YES",
    sizeUsd: 2500,
    timestamp: "2 hours ago",
    platform: "KS",
    price: 91,
    traderScore: 1.88,
    category: "Tech"
  },
  {
    id: "t7",
    traderSlug: "aenews",
    traderName: "aenews",
    marketTitle: "Will France win the 2026 World Cup?",
    side: "YES",
    sizeUsd: 125000,
    timestamp: "3 hours ago",
    platform: "PM",
    price: 96,
    traderScore: 2.24,
    category: "Sports"
  },
  {
    id: "t8",
    traderSlug: "user-x",
    traderName: "user.x",
    marketTitle: "Will the Fed cut rates by 25bps in September?",
    side: "YES",
    sizeUsd: 8500,
    timestamp: "4 hours ago",
    platform: "KS",
    price: 72,
    traderScore: 2.38,
    category: "Macro"
  },
  {
    id: "t9",
    traderSlug: "iqdegen",
    traderName: "IqDegen",
    marketTitle: "Will OpenAI announce GPT-5 in 2026?",
    side: "YES",
    sizeUsd: 150,
    timestamp: "4 hours ago",
    platform: "PM",
    price: 98,
    traderScore: 0.84,
    category: "Tech"
  },
  {
    id: "t10",
    traderSlug: "robdfs",
    traderName: "RobDFS",
    marketTitle: "Will England win the 2026 World Cup?",
    side: "NO",
    sizeUsd: 55000,
    timestamp: "5 hours ago",
    platform: "KS",
    price: 97,
    traderScore: 1.04,
    category: "Sports"
  },
  {
    id: "t11",
    traderSlug: "haon",
    traderName: "haon",
    marketTitle: "Will US Inflation fall below 2% by YTD?",
    side: "YES",
    sizeUsd: 12000,
    timestamp: "6 hours ago",
    platform: "KS",
    price: 45,
    traderScore: 1.88,
    category: "Macro"
  },
  {
    id: "t12",
    traderSlug: "labvek",
    traderName: "labvek",
    marketTitle: "Will Spain reach the World Cup semi-finals?",
    side: "YES",
    sizeUsd: 42000,
    timestamp: "6 hours ago",
    platform: "PM",
    price: 99,
    traderScore: 1.96,
    category: "Sports"
  },
  {
    id: "t13",
    traderSlug: "cigarettes",
    traderName: "cigarettes",
    marketTitle: "Will Trump sign a new tariff executive order in Q3?",
    side: "YES",
    sizeUsd: 3200,
    timestamp: "7 hours ago",
    platform: "PM",
    price: 62,
    traderScore: 1.55,
    category: "Politics"
  },
  {
    id: "t14",
    traderSlug: "coby",
    traderName: "Coby",
    marketTitle: "Will Germany win the 2026 World Cup?",
    side: "NO",
    sizeUsd: 7800,
    timestamp: "8 hours ago",
    platform: "KS",
    price: 88,
    traderScore: 2.71,
    category: "Sports"
  },
  {
    id: "t15",
    traderSlug: "sorcerer",
    traderName: "sorcerer.money",
    marketTitle: "Will Bitcoin exceed $120k before Aug 2026?",
    side: "YES",
    sizeUsd: 5500,
    timestamp: "9 hours ago",
    platform: "PM",
    price: 55,
    traderScore: 1.25,
    category: "Crypto"
  },
  {
    id: "t16",
    traderSlug: "eltonma",
    traderName: "EltonMa",
    marketTitle: "Will the ECB cut rates again in September 2026?",
    side: "YES",
    sizeUsd: 920,
    timestamp: "10 hours ago",
    platform: "PM",
    price: 71,
    traderScore: -0.42,
    category: "Macro"
  },
  {
    id: "t17",
    traderSlug: "domer",
    traderName: "Domer",
    marketTitle: "Will the US Senate pass a budget bill before Oct 2026?",
    side: "NO",
    sizeUsd: 14500,
    timestamp: "12 hours ago",
    platform: "KS",
    price: 33,
    traderScore: 2.18,
    category: "Politics"
  },
  {
    id: "t18",
    traderSlug: "aenews",
    traderName: "aenews",
    marketTitle: "Will there be a ceasefire in Ukraine by Dec 2026?",
    side: "YES",
    sizeUsd: 2100,
    timestamp: "13 hours ago",
    platform: "PM",
    price: 41,
    traderScore: 1.62,
    category: "Geopolitics"
  }
  ,
  {
    id: "t19",
    traderSlug: "cigarettes",
    traderName: "cigarettes",
    marketTitle: "Will the EU impose new crypto regulations in 2026?",
    side: "NO",
    sizeUsd: 7500,
    timestamp: "14 hours ago",
    platform: "PM",
    price: 68,
    traderScore: -0.95,
    category: "Macro"
  },
  {
    id: "t20",
    traderSlug: "labvek",
    traderName: "labvek",
    marketTitle: "Will Lionel Messi retire before end of 2026?",
    side: "YES",
    sizeUsd: 12000,
    timestamp: "15 hours ago",
    platform: "PM",
    price: 73,
    traderScore: 2.12,
    category: "Sports"
  }
];

const positions: PositionMarket[] = [
  {
    slug: "france-world-cup",
    title: "Will France win the 2026 FIFA World Cup?",
    platform: "PM",
    side: "YES",
    marketValueUsd: 556378,
    smartMoneyShare: 89,
    traders: [
      { traderSlug: "aenews", traderName: "aenews", score: 79, entry: 0.71, pnlUsd: 9833, shares: "406.3k", valueUsd: 193521 },
      { traderSlug: "labvek", traderName: "labvek", score: 75, entry: 0.74, pnlUsd: 12044, shares: "220.5k", valueUsd: 79486 },
      { traderSlug: "haon", traderName: "haon", score: 73, entry: 0.75, pnlUsd: 29695, shares: "350.1k", valueUsd: 79202 }
    ]
  },
  {
    slug: "iran-regime-2027",
    title: "Will the Iranian regime fall before 2027?",
    platform: "PM",
    side: "NO",
    marketValueUsd: 320000,
    smartMoneyShare: 75,
    traders: [
      { traderSlug: "aenews", traderName: "aenews", score: 63, entry: 0.66, pnlUsd: 71040, shares: "399.0k", valueUsd: 286205 },
      { traderSlug: "labvek", traderName: "labvek", score: 48, entry: 0.76, pnlUsd: 19994, shares: "79.8k", valueUsd: 44010 },
      { traderSlug: "robdfs", traderName: "RobDFS", score: 39, entry: 0.74, pnlUsd: 6930, shares: "48.0k", valueUsd: 16900 }
    ]
  },
  {
    slug: "argentina-world-cup",
    title: "Will Argentina win the 2026 FIFA World Cup?",
    platform: "PM",
    side: "NO",
    marketValueUsd: 180000,
    smartMoneyShare: 47,
    traders: [
      { traderSlug: "iqdegen", traderName: "IqDegen", score: 60, entry: 0.79, pnlUsd: 3257, shares: "66.8k", valueUsd: 153178 },
      { traderSlug: "haon", traderName: "haon", score: 77, entry: 0.79, pnlUsd: 22779, shares: "386.2k", valueUsd: 101524 },
      { traderSlug: "aenews", traderName: "aenews", score: 69, entry: 0.76, pnlUsd: 1802, shares: "37.2k", valueUsd: 47199 }
    ]
  }
];

const getPeriodMultiplier = (slug: string, period: PeriodKey) => {
  let seed = 0;
  for (let i = 0; i < slug.length; i++) {
    seed += slug.charCodeAt(i);
  }
  const val = (seed % 10) / 100; // 0.00 to 0.09 variation
  if (period === "YTD") return 0.8 + val;
  if (period === "1M") return 0.15 + val;
  if (period === "1D") return 0.01 + (seed % 5 === 0 ? -val * 0.5 : val); // can even be negative
  return 1.0;
};

export function getLeaderboard(options?: {
  search?: string;
  platform?: "ALL" | PlatformCode;
  minPnl?: number;
  sort?: LeaderboardSortKey;
  period?: PeriodKey;
  xLinkedOnly?: boolean;
}) {
  const search = options?.search?.toLowerCase().trim();
  const platform = options?.platform ?? "ALL";
  const minPnl = options?.minPnl ?? 0;
  const sort = options?.sort ?? "smart_score";
  const period = options?.period ?? "ALL";

  const filtered = traders
    .map((trader) => {
      const mult = getPeriodMultiplier(trader.slug, period);
      return { ...trader, pnlUsd: trader.pnlUsd * mult };
    })
    .filter((trader) => {
      if (search && !trader.displayName.toLowerCase().includes(search) && !trader.slug.toLowerCase().includes(search)) {
        return false;
      }

      if (platform !== "ALL" && !trader.platforms.includes(platform)) {
        return false;
      }

      if (options?.xLinkedOnly && !trader.xLinked) {
        return false;
      }

      return trader.pnlUsd >= minPnl;
    })
    .sort((a, b) => {
      const mapping: Record<LeaderboardSortKey, keyof TraderSummary> = {
        smart_score: "smartScore",
        sharpe: "sharpe",
        win_rate: "winRate",
        roi: "roi",
        pnl: "pnlUsd"
      };

      const key = mapping[sort];
      return Number(b[key]) - Number(a[key]);
    })
    .map((trader, index) => ({ ...trader, rank: index + 1 }));

  return {
    asOf: "2026-07-12T22:33:00Z",
    total: filtered.length,
    period,
    items: filtered
  };
}

export function getTraderProfile(slug: string) {
  return traders.find((trader) => trader.slug === slug) ?? null;
}

export function getTrendingMarkets(window: TrendWindow = "1W") {
  const windowMultipliers: Record<TrendWindow, number> = {
    "1H": 0.05,
    "6H": 0.25,
    "24H": 0.5,
    "3D": 0.8,
    "1W": 1.0
  };

  const mult = windowMultipliers[window];
  const items = trendingMarkets.map((market) => {
    let prob = market.probability ?? 50;
    if (window === "1H") {
      prob = Math.max(1, Math.min(99, prob + 2));
    } else if (window === "6H") {
      prob = Math.max(1, Math.min(99, prob - 3));
    } else if (window === "24H") {
      prob = Math.max(1, Math.min(99, prob + 1));
    } else if (window === "3D") {
      prob = Math.max(1, Math.min(99, prob - 1));
    }

    let volLabel = market.volumeLabel;
    const match = market.volumeLabel.match(/\$([\d.]+)([MK])/);
    if (match) {
      const val = parseFloat(match[1]) * mult;
      volLabel = `$${val.toFixed(1)}${match[2]} in ${window}`;
    }

    return {
      ...market,
      probability: prob,
      volumeLabel: volLabel
    };
  });

  return {
    asOf: "2026-07-12T22:33:00Z",
    window,
    items
  };
}

export function getRecentTrades() {
  return {
    asOf: "2026-07-12T22:33:00Z",
    items: recentTrades
  };
}

export function getPositions(side: "ALL" | "YES" | "NO" = "ALL", platform: "ALL" | PlatformCode = "ALL") {
  const items = positions.filter((position) => {
    if (side !== "ALL" && position.side !== side) {
      return false;
    }

    if (platform !== "ALL" && position.platform !== platform) {
      return false;
    }

    return true;
  });

  return {
    asOf: "2026-07-12T22:33:00Z",
    totalMarkets: items.length,
    totalPositions: items.reduce((acc, item) => acc + item.traders.length, 0),
    items
  };
}

export function getFilterMeta() {
  return {
    asOf: "2026-07-12T22:33:00Z",
    periods: ["1D", "1M", "YTD", "ALL"],
    sortKeys: ["smart_score", "sharpe", "win_rate", "roi", "pnl"],
    platforms: ["ALL", "PM", "KS", "OL"],
    trendWindows: ["1H", "6H", "24H", "3D", "1W"]
  };
}
