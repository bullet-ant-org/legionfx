
## Scope

You've described a full private client portal with many large pages (Overview, Wallet, Messages, Trading Bots, Academy & Mentorship, Prop Firm, Signals, Settings, Security, Support, Profile). Each of those is essentially a full app on its own. Building all of them in one turn would produce shallow, generic UI. I'll build it in focused phases so each page is genuinely premium and matches the public site's luxury aesthetic.

## Phase 1 — Foundation + Overview + Wallet (this turn)

**Auth flow (no backend)**
- Update `/login` to accept `demo@gmail.com` / `demo123`, persist a fake session in `localStorage`, and redirect to `/dashboard`.
- Lightweight `useAuth` hook guarding all `/dashboard/*` routes (redirect to `/login` if not signed in).

**Dashboard shell** (`src/routes/dashboard/route.tsx` + components under `src/components/dashboard/`)
- Sticky 70px glass top navbar: breadcrumb, search, notifications dropdown (5 demo items, mark-all-read, click-outside close), wallet balance chip, profile avatar dropdown (full menu list as specified).
- Collapsible left sidebar (280px ↔ 80px) with accordion user-stats card at top, full nav grouped exactly as listed (Overview, Wallet, Messages, Trading Bots, Academy, Prop Firm, Signals, Settings, Security, Support, Profile), sticky Logout at bottom with confirmation modal. Tooltips when collapsed. Mobile = slide-out drawer.
- Reusable primitives: `GlassCard`, `StatCard` (animated counter), `SectionHeader`, `Sparkline`, `Donut`, `AreaChart` (Recharts), `DataTable` wrapper, `Modal`.

**Overview page** (`/dashboard`)
Welcome block, 8 quick-stat cards, large portfolio performance area chart with timeframe tabs, wallet summary, active bots cards, prop firm challenge card, academy progress, latest signals list, recent transactions table, mini calendar, market overview widgets, recent messages, achievements row, referral card, footer.

**Wallet page** (`/dashboard/wallet`)
Header with Deposit / Withdraw / Transfer buttons + modals (multi-field, validation, success states), 6 summary cards w/ sparklines, portfolio donut, performance chart, per-wallet asset breakdown cards (Main / Prop Firm / Bots / Signals / Academy / Referral), quick-action grid, transaction history table with filters + details modal, performance cards, payment methods, security cards, activity feed, FAQ accordion, final CTA.

**Demo data**
Single `src/lib/demo-data.ts` module feeding both pages so numbers stay consistent.

**Deps to add**: `recharts`, `framer-motion`, `@tanstack/react-table`, `react-hook-form`, `zod`.

## Phase 2 (next turn, after you confirm Phase 1)
Messages page (3-panel chat, conversations, composer, info panel, community channels).

## Phase 3
Trading Bots page (portfolio cards, 7-step create-bot wizard, bot dashboard with chart, marketplace, analytics).

## Phase 4
Academy & Mentorship + Prop Firm + Signals.

## Phase 5
Settings, Security, Support Tickets, Profile.

## Technical notes
- TanStack Start file-based routes under `src/routes/dashboard/`, with `_authenticated`-style guard via the existing pattern.
- No backend; all data is local demo data + `localStorage` for auth + preferences.
- Reuses existing tokens in `src/styles.css` (orange brand, glass, gradients) — no new aesthetic invented.
- Framer Motion for page/sidebar/dropdown/modal animations; Recharts for all charts; lucide-react for icons (already installed).

## Confirm before I start
Reply "go" and I'll build Phase 1 (Auth + Shell + Overview + Wallet) end-to-end in the next turn. If you'd rather I tackle a different page first or combine phases, say which.
