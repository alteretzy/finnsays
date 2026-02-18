# FinnSays — Institutional-Grade Market Intelligence

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Live-000?logo=vercel)](https://finnsays.vercel.app)

A modern, SEO-first financial dashboard that tracks **100+ global assets** — stocks, cryptocurrencies, precious metals, and commodities — with real-time data, candlestick charts, and institutional-grade analytics.

> **Live Demo:** [finnsays.vercel.app](https://finnsays.vercel.app)

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | Next.js 15 (App Router, React Server Components) |
| **Language** | TypeScript (strict mode, zero `any`) |
| **Styling** | Tailwind CSS with custom dark design system |
| **State** | Zustand (watchlist, portfolio) |
| **Data Fetching** | SWR (client), Server Components (SSR) |
| **Charts** | Lightweight Charts (TradingView), Recharts |
| **Auth** | Supabase (optional) |
| **Icons** | Lucide React |
| **Deployment** | Vercel with ISR (60s revalidation) |

---

## SSR Strategy

This project uses **React Server Components (RSC)** — Next.js 15's modern SSR approach — instead of legacy `getServerSideProps`. Key architectural decisions:

- **`generateMetadata()`** — Dynamic per-page meta titles, descriptions, OG/Twitter cards, and canonical URLs
- **`generateStaticParams()`** — Pre-renders all asset pages at build time for instant TTFB
- **`revalidate = 60`** — ISR with 60-second windows balances freshness with edge-cached performance
- **Server → Client split** — Server Components fetch data and inject SEO; Client Components handle interactivity (charts, filters, search)

Every page delivers **fully rendered HTML** on the first response, ensuring searchbot crawlability.

---

## SEO Implementation

### Per-Page Metadata

Every route exports `metadata` or `generateMetadata` with:

- **Title** (templated via `%s | FinnSays`)
- **Description** (keyword-optimized)
- **OpenGraph** (title, description, type, images)
- **Twitter Cards** (summary_large_image or summary)
- **Canonical URL** (`alternates.canonical`)

### Structured Data (JSON-LD)

- **Organization schema** on every page (via root layout)
- **FinancialProduct schema** on asset detail pages (stocks, crypto)
- **Currency schema** on cryptocurrency pages
- **AboutPage schema** on the `/about` page

### Technical SEO

- `sitemap.xml` — Auto-generated covering all static + dynamic routes
- `robots.txt` — Allows all, disallows private routes
- Semantic HTML — Proper `<main>`, `<article>`, `<section>`, heading hierarchy
- Skip-to-content link for accessibility
- Self-referencing canonicals on all pages

### Keyword Strategy

See [KEYWORD-RESEARCH.md](./KEYWORD-RESEARCH.md) for the full keyword research document covering transactional, informational, and long-tail keyword pillars.

---

## Pages & Features

| Page | Route | SSR | Features |
| --- | --- | --- | --- |
| Dashboard | `/` | ✅ ISR | Hero, search bar, market overview, sparklines |
| Markets | `/markets` | ✅ ISR | Full asset table, sorting, pagination, filters |
| Asset Detail | `/stocks/[symbol]` | ✅ SSG+ISR | Candlestick chart, price data, JSON-LD schema |
| Crypto | `/crypto/[coin]` | ✅ ISR | Live crypto price, chart, Currency JSON-LD |
| Commodities | `/commodities/[comp]` | ✅ ISR | Gold, silver, oil, natural gas tracking |
| Screener | `/screener` | ✅ ISR | Multi-column sort, filters, real-time table |
| Watchlist | `/watchlist` | ✅ ISR | Persistent favorites with localStorage |
| Portfolio | `/portfolio` | ✅ ISR | Wealth tracking across asset classes |
| News | `/news` | ✅ CSR+API | Live financial news from Yahoo Finance |
| Blog | `/blog` | ✅ SSR | Financial education and market insights |
| About | `/about` | ✅ SSR | Tech stack, data sources, architecture, SEO strategy |
| Contact | `/contact` | ✅ SSR | Contact form |
| Technology | `/technology` | ✅ SSR | Infrastructure and performance overview |
| SEO Dashboard | `/seo` | ✅ SSR | Internal SEO metrics (noindex) |

---

## Data Architecture

```text
Client (SWR) ──► API Routes ──► DataAggregator ──► Yahoo Finance
                                    │
                                    ▼
                              In-Memory Cache
                              + File Cache
                              (TTL: 30s quotes, 5m candles)
```

The `DataAggregator` singleton provides a unified API across all asset types with caching, rate limiting, and request deduplication.

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/alteretzy/finnsays-.git
cd finnsays
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Fill in your API keys (see `.env.example` for documentation):

- `NEXT_PUBLIC_FINNHUB_API_KEY` — Get free from [Finnhub](https://finnhub.io/)
- `ALPHA_VANTAGE_API_KEY` — Optional, from [Alpha Vantage](https://www.alphavantage.co/)

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Build & Verify

```bash
npm run build   # Production build (zero warnings)
npm run lint     # ESLint check
npm run test     # Jest unit tests
```

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import into [Vercel](https://vercel.com/)
3. Set environment variables from `.env.example`
4. Deploy — ISR and edge caching are automatic

### Vercel CLI

```bash
npm i -g vercel
vercel login
vercel           # Follow prompts
vercel --prod    # Production deploy
```

---

## Code Quality

- **TypeScript strict mode** — Zero `any` types in production code
- **ESLint** — `next/core-web-vitals` + `next/typescript` rules
- **Prettier** — Consistent formatting (`.prettierrc`)
- **Zero console.log** — Only `console.error`/`warn` in error boundaries
- **Security headers** — `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy` via `vercel.json`

---

## License

MIT
