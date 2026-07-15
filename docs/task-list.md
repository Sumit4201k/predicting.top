# Product Task List And Sprint Plan

## Planning Goal

This sprint plan closes the major gaps identified in [docs/gap-analysis.md](/C:/Users/Admin/OneDrive/Documents/Predicting.top/docs/gap-analysis.md) while preserving our strongest current features: `Trending Markets` and `Recent Trades`.

## Product Outcome We Are Driving Toward

Ship a coherent prediction market analytics product with five connected surfaces:

- leaderboard
- trader profile
- top positions
- trending markets
- recent trades

## Sprint 1: Foundation And Information Architecture

### Goal

Turn the current set of pages into a single product system with shared navigation, shared filters, and consistent layout behavior.

### Deliverables

- Add global top navigation for:
  - Leaderboard
  - Positions
  - Trending Markets
  - Recent Trades
- Create shared page shell and section header components
- Create shared filter primitives:
  - chip group
  - dropdown
  - segmented control
  - search input
- Standardize page spacing, table spacing, panel styling, and data labels
- Add page-level route structure for dedicated `Trending Markets` and `Recent Trades`

### UI/UX Improvements

- Improve homepage hierarchy so users understand the primary entry point in under 5 seconds
- Normalize filter placement and reduce visual noise from ad hoc controls
- Establish a single color system for positive, negative, warning, and neutral states

### Acceptance Criteria

- Every major page uses the same header and navigation model
- Filters feel visually and behaviorally consistent across pages
- Mobile and desktop layouts use the same component system

## Sprint 2: Leaderboard Parity And Upgrade

### Goal

Build a competitive leaderboard that matches `predicting.top` on trust and exceeds it on scanability and extensibility.

### Deliverables

- Add searchable leaderboard page
- Add filters for:
  - period
  - platform
  - minimum P&L
  - linked/all identity
- Add sortable metrics:
  - smart score
  - Sharpe
  - Win%
  - ROI
  - P&L
- Add leaderboard summary stats:
  - traders tracked
  - last updated
  - total smart-money activity today
- Add score explanation and metric glossary

### UI/UX Improvements

- Make the leaderboard header feel like a decision dashboard rather than a raw table
- Add sticky or anchored filter controls on large screens
- Improve row hover and click affordances for trader drilldown

### Acceptance Criteria

- Users can find a trader quickly
- Users can sort and filter without losing context
- The leaderboard clearly explains why a trader ranks highly

## Sprint 3: Trader Profile Depth

### Goal

Create a profile page that makes trader quality understandable and actionable.

### Deliverables

- Add full trader profile header
- Add linked accounts and platform badges
- Add monthly summary strip
- Add win/loss daily activity indicators
- Improve P&L history chart
- Add scorecard for:
  - smart score
  - win rate
  - Sharpe
  - max drawdown
  - profit factor
  - consistency
- Add trader-specific recent trades section
- Add trader-specific top positions section

### UI/UX Improvements

- Improve chart readability with better axis treatment, hover states, and labels
- Create a clearer hierarchy between identity, monthly result, and long-term performance
- Add profile-level breadcrumbs back to leaderboard and positions

### Acceptance Criteria

- A user can understand who the trader is, how they perform, and how stable that performance is
- The page feels materially deeper than the current MVP profile

## Sprint 4: Top Positions Parity And Upgrade

### Goal

Build a positions surface that clearly translates trader conviction into market-level opportunity.

### Deliverables

- Create grouped market cards for top positions
- Add filters for:
  - side
  - score threshold
  - Sharpe threshold
  - market end date
  - minimum exposure
  - platform
- Show market-level stats:
  - total smart money
  - number of traders
  - smart-money side split
- Show trader-level rows:
  - trader
  - side
  - score
  - entry
  - P&L
  - shares
  - value

### UI/UX Improvements

- Reduce table density inside cards without losing scanability
- Improve card-level hierarchy so market summary is legible before row details
- Add quick links from each row to trader profiles and recent flow

### Acceptance Criteria

- Users can find concentrated conviction markets quickly
- The page feels more powerful than `predicting.top`, not just equivalent

## Sprint 5: Promote Trending Markets Into A First-Class Intelligence Surface

### Goal

Keep our strongest current advantage and connect it more tightly to the rest of the product.

### Deliverables

- Create dedicated `Trending Markets` page in the product shell
- Preserve advanced filters:
  - time window
  - threshold
  - category
  - status
  - time-to-resolution
  - position size or trader count
- Improve market cards with:
  - clearer probability display
  - better inflow presentation
  - stronger trader subrow layout
- Add direct transitions to:
  - top positions
  - relevant traders
  - recent trades for that market

### UI/UX Improvements

- Improve density balance so cards stay rich without becoming visually noisy
- Make trader contribution rows easier to compare at a glance
- Add a stronger “show more” and pagination model

### Acceptance Criteria

- The page remains richer than `predicting.top`
- Users can move from a trending market directly into traders and conviction

## Sprint 6: Promote Recent Trades Into A First-Class Flow Surface

### Goal

Preserve our second major advantage and make it central to trader/market evaluation.

### Deliverables

- Create dedicated `Recent Trades` page in shared product shell
- Preserve advanced filtering:
  - amount threshold
  - category
  - score
  - Sharpe
  - side
  - time window
- Add row-level linking to:
  - trader profile
  - market detail
  - top positions if relevant
- Add optional grouping by trader or market

### UI/UX Improvements

- Improve row color usage so positive and negative context is clear without overpowering the table
- Use sticky headers and clear column hierarchy for dense scan workflows
- Improve spacing and truncation behavior for long market names

### Acceptance Criteria

- The page is fast to scan for action
- It integrates naturally with leaderboard and market discovery

## Sprint 7: Unified Metrics, Data Model, And Cross-Surface Consistency

### Goal

Make the same trader look the same everywhere in the product.

### Deliverables

- Normalize metric definitions across all pages
- Add shared score glossary and tooltips
- Standardize display for:
  - smart score
  - Sharpe
  - Win%
  - ROI
  - drawdown
  - profit factor
- Align trader naming, avatar usage, and platform badge logic across every page
- Add consistent timestamp and freshness indicators

### UI/UX Improvements

- Remove mismatched metric styling between tables, cards, and profile score sections
- Improve trust by clearly labeling what each metric means

### Acceptance Criteria

- Metrics never contradict each other across pages
- Users can build trust in the system without guessing definitions

## Sprint 8: Mobile, Polish, And Product Finish

### Goal

Make the product production-feeling on all breakpoints and remove obvious friction.

### Deliverables

- Mobile layouts for leaderboard, profile, positions, trending, recent trades
- Collapsible advanced filters on smaller screens
- Loading states, empty states, and error states for all major views
- Visual polish pass for:
  - buttons
  - tables
  - cards
  - charts
  - typography
- Accessibility pass for focus states and keyboard navigation

### UI/UX Improvements

- Replace desktop-only dense tables with responsive card/table hybrids
- Improve tap targets and horizontal overflow handling
- Add persistent route awareness so users always know where they are

### Acceptance Criteria

- Core workflows are usable on mobile
- The product feels cohesive, polished, and intentionally designed

## Priority Order

### P0

- Sprint 1
- Sprint 2
- Sprint 3
- Sprint 4

### P1

- Sprint 5
- Sprint 6
- Sprint 7

### P2

- Sprint 8

## Notes

- We should **not** degrade `Trending Markets` or `Recent Trades` to imitate `predicting.top`.
- We should use `predicting.top` mainly as the benchmark for:
  - leaderboard completeness
  - positions clarity
  - profile depth
  - product cohesion
- Our target should be a product that is:
  - richer than `predicting.top`
  - more coherent than our current isolated pages
