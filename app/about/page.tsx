import { Metadata } from 'next';
import Link from 'next/link';
import FadeIn from '@/components/animations/FadeIn';

export const metadata: Metadata = {
    title: 'About FinnSays — Our Mission & Technology',
    description:
        'FinnSays delivers institutional-grade market intelligence for retail traders. Learn about our data sources, technology stack, and SEO-driven architecture.',
    openGraph: {
        title: 'About FinnSays — Institutional-Grade Market Intelligence',
        description: 'Learn about our mission, data sources, and the technology powering FinnSays.',
        type: 'website',
    },
    twitter: {
        card: 'summary',
        title: 'About FinnSays',
        description: 'Learn about our mission, data sources, and the technology powering FinnSays.',
    },
    alternates: {
        canonical: '/about',
    },
};

const DATA_SOURCES = [
    { name: 'Yahoo Finance', description: 'Real-time and historical stock quotes, candlestick data, and financial news', type: 'Primary' },
    { name: 'Finnhub', description: 'Company profiles, analyst ratings, and institutional-grade fundamental data', type: 'Primary' },
    { name: 'CoinGecko', description: 'Cryptocurrency prices, market caps, and 24h trading volumes', type: 'Primary' },
    { name: 'Alpha Vantage', description: 'Supplementary historical time-series data and technical indicators', type: 'Secondary' },
];

const TECH_STACK = [
    { name: 'Next.js 15', description: 'App Router with React Server Components for SSR' },
    { name: 'TypeScript', description: 'Strict mode with zero `any` types for full type safety' },
    { name: 'Tailwind CSS', description: 'Utility-first styling with custom design system' },
    { name: 'SWR', description: 'Stale-while-revalidate data fetching with client-side caching' },
    { name: 'Zustand', description: 'Lightweight state management for watchlist and portfolio' },
    { name: 'Lightweight Charts', description: 'Performant candlestick and area charts' },
];

const SEO_FEATURES = [
    'Dynamic meta titles and descriptions per page',
    'OpenGraph and Twitter Card metadata for social sharing',
    'JSON-LD structured data (FinancialProduct, BreadcrumbList, Organization)',
    'Auto-generated sitemap.xml covering 100+ pages',
    'Canonical URLs to prevent duplicate content',
    'Semantic HTML with proper heading hierarchy',
    'Server-side rendering for search engine crawlability',
    'Keyword-optimized content across all page types',
];

export default function AboutPage() {
    const aboutSchema = {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About FinnSays',
        description: 'FinnSays delivers institutional-grade market intelligence for retail traders.',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://finnsays.com'}/about`,
        mainEntity: {
            '@type': 'Organization',
            name: 'FinnSays',
            url: process.env.NEXT_PUBLIC_SITE_URL || 'https://finnsays.com',
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
            />
            <main className="max-w-5xl mx-auto px-4 md:px-8 pt-32 pb-20 min-h-screen">
                {/* Hero */}
                <FadeIn>
                    <h1 className="text-4xl md:text-5xl font-light text-white mb-6">
                        About FinnSays
                    </h1>
                    <p className="text-lg text-white/50 max-w-3xl leading-relaxed mb-16">
                        FinnSays is a <strong className="text-white/70">programmatic SEO</strong> and{' '}
                        <strong className="text-white/70">server-side rendered</strong> financial data platform
                        built with Next.js. It aggregates real-time market data from multiple institutional-grade
                        sources to deliver actionable intelligence across stocks, cryptocurrencies, precious metals,
                        and commodities.
                    </p>
                </FadeIn>

                {/* Data Sources */}
                <FadeIn delay={0.1}>
                    <section className="mb-16">
                        <h2 className="text-2xl font-light text-white mb-6">Data Sources</h2>
                        <p className="text-white/40 mb-8 max-w-2xl">
                            We chose financial market data because it produces hundreds of unique, keyword-rich pages
                            with genuine search volume — perfect for demonstrating programmatic SEO at scale.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {DATA_SOURCES.map((source) => (
                                <div key={source.name} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 hover:border-white/10 transition-colors">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="text-lg font-medium text-white">{source.name}</h3>
                                        <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full ${source.type === 'Primary' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                            {source.type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-white/40 leading-relaxed">{source.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </FadeIn>

                {/* Tech Stack */}
                <FadeIn delay={0.2}>
                    <section className="mb-16">
                        <h2 className="text-2xl font-light text-white mb-6">Technology Stack</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {TECH_STACK.map((tech) => (
                                <div key={tech.name} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 hover:border-white/10 transition-colors">
                                    <h3 className="text-sm font-medium text-[#0066FF] mb-1">{tech.name}</h3>
                                    <p className="text-xs text-white/40 leading-relaxed">{tech.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </FadeIn>

                {/* SSR Strategy */}
                <FadeIn delay={0.3}>
                    <section className="mb-16">
                        <h2 className="text-2xl font-light text-white mb-6">SSR & SEO Strategy</h2>
                        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8">
                            <p className="text-white/60 leading-relaxed mb-6">
                                Instead of legacy <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded">getServerSideProps</code>,
                                FinnSays uses Next.js 15&apos;s <strong className="text-white/80">React Server Components</strong> with{' '}
                                <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded">generateMetadata</code> and{' '}
                                <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded">generateStaticParams</code> for
                                optimal SEO performance. Every asset page is pre-rendered with full HTML on the server,
                                ensuring search engines see complete content on first crawl.
                            </p>
                            <h3 className="text-lg font-light text-white mb-4">SEO Features Implemented</h3>
                            <ul className="space-y-2">
                                {SEO_FEATURES.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-sm text-white/50">
                                        <span className="text-emerald-400 mt-0.5">✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                </FadeIn>

                {/* Architecture */}
                <FadeIn delay={0.4}>
                    <section className="mb-16">
                        <h2 className="text-2xl font-light text-white mb-6">Architecture Decisions</h2>
                        <div className="space-y-4">
                            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
                                <h3 className="text-sm font-medium text-white mb-2">Data Aggregation Layer</h3>
                                <p className="text-sm text-white/40 leading-relaxed">
                                    A centralized <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded">DataAggregator</code> class
                                    provides a unified API for fetching quotes and candles across all asset types (stocks, crypto, commodities).
                                    It handles provider fallbacks, in-memory caching, and rate limiting transparently.
                                </p>
                            </div>
                            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
                                <h3 className="text-sm font-medium text-white mb-2">ISR with 60s Revalidation</h3>
                                <p className="text-sm text-white/40 leading-relaxed">
                                    Pages use Incremental Static Regeneration with a 60-second revalidation window.
                                    This balances real-time data freshness with edge-cached performance, achieving
                                    sub-second Time to First Byte (TTFB) for returning visitors.
                                </p>
                            </div>
                            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
                                <h3 className="text-sm font-medium text-white mb-2">Component Architecture</h3>
                                <p className="text-sm text-white/40 leading-relaxed">
                                    Server Components handle data fetching and SEO metadata. Client Components manage
                                    interactive features (charts, filters, search). This separation minimizes client-side
                                    JavaScript while maintaining rich interactivity.
                                </p>
                            </div>
                        </div>
                    </section>
                </FadeIn>

                {/* Links */}
                <FadeIn delay={0.5}>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/markets"
                            className="px-6 py-3 bg-[#0066FF] hover:bg-[#0052CC] text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            Explore Markets →
                        </Link>
                        <Link
                            href="/blog"
                            className="px-6 py-3 bg-white/[0.03] border border-white/10 text-white/60 text-sm rounded-lg hover:text-white hover:border-white/20 transition-all"
                        >
                            Read Our Blog
                        </Link>
                        <Link
                            href="/"
                            className="px-6 py-3 bg-white/[0.03] border border-white/10 text-white/60 text-sm rounded-lg hover:text-white hover:border-white/20 transition-all"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </FadeIn>
            </main>
        </>
    );
}
