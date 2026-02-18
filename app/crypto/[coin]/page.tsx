import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CRYPTO_IDS } from '@/lib/data/market-data';
import { dataAggregator } from '@/lib/dataManager/aggregator';
import AssetClient from '../../asset/[symbol]/AssetClient';
import { MarketAsset } from '@/lib/finnhub/types';

interface PageProps {
    params: Promise<{
        coin: string;
    }>;
}

export const revalidate = 60;

// Generate static params for all tracked cryptos
export async function generateStaticParams() {
    return Object.keys(CRYPTO_IDS).map((coin) => ({
        coin: coin,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { coin } = await params;
    const coinId = coin.toLowerCase();
    const mapping = CRYPTO_IDS[coinId];

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://finnsays.com';

    if (mapping) {
        return {
            title: `${mapping.name} (${mapping.symbol}) Price Today — Live Crypto Charts | FinnSays`,
            description: `Live ${mapping.name} price, market cap, and 24h volume. View real-time ${mapping.symbol} candlestick charts and institutional news.`,
            openGraph: {
                title: `${mapping.name} (${mapping.symbol}) — Live Price & Charts | FinnSays`,
                description: `Live ${mapping.name} price, market cap, and 24h trading volume with real-time charts.`,
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: `${mapping.name} Price Today — FinnSays`,
                description: `Track ${mapping.name} (${mapping.symbol}) live with real-time analytics.`,
            },
            alternates: {
                canonical: `${siteUrl}/crypto/${coinId}`,
            },
        };
    }
    return {
        title: `${coin} Price | FinnSays`,
        description: `Live ${coin} price, market cap, and trading volume.`,
        openGraph: {
            title: `${coin} Price — FinnSays`,
            description: `Live ${coin} price and trading volume.`,
            type: 'website',
        },
        twitter: {
            card: 'summary',
            title: `${coin} Price — FinnSays`,
            description: `Live ${coin} price and trading volume.`,
        },
        alternates: {
            canonical: `${siteUrl}/crypto/${coinId}`,
        },
    };
}

export default async function CryptoPage({ params }: PageProps) {
    const { coin: coinParam } = await params;
    const coinId = coinParam.toLowerCase();
    const mapping = CRYPTO_IDS[coinId];
    const symbol = mapping?.symbol || `${coinParam.toUpperCase()}-USD`;

    // 1. Fetch Data via Aggregator
    const now = Math.floor(Date.now() / 1000);
    const twoMonthsAgo = now - 60 * 24 * 60 * 60;

    const [quote, candles] = await Promise.all([
        dataAggregator.getQuote(symbol),
        dataAggregator.getCandles(symbol, 'D', twoMonthsAgo, now)
    ]);

    if (!quote) {
        notFound();
    }

    const currentPrice = quote.price;

    // 2. Transform to MarketAsset
    const marketAsset: MarketAsset = {
        symbol: symbol,
        name: mapping?.name || symbol,
        type: 'crypto',
        price: currentPrice,
        change: quote.change,
        changePercent: quote.changePercent,
        volume: quote.volume,
        marketCap: 0, // Fallback if not easily available from search api
        sparklineData: candles.slice(-20).map(c => c.close)
    };

    // 3. Transform candles (already transformed by aggregator usually, but we ensure format)
    const candleData = candles.map(d => ({
        time: d.time,
        open: d.open || d.close,
        high: d.high || d.close,
        low: d.low || d.close,
        close: d.close,
        volume: d.volume || 0
    }));

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Currency",
        "name": mapping?.name || symbol,
        "currency": "USD",
        "currentExchangeRate": {
            "@type": "ExchangeRateSpecification",
            "currency": "USD",
            "currentExchangeRate": currentPrice
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <AssetClient
                symbol={symbol}
                asset={marketAsset}
                candleData={candleData}
            />
        </>
    );
}
