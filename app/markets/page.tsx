
import { Metadata } from 'next';
import MarketsClient from './MarketsClient';
import { getMarketData } from '@/lib/data/market-data';

export const metadata: Metadata = {
    title: 'All Markets — Stocks, Crypto, Metals & Commodities',
    description:
        'Explore real-time market data for stocks, cryptocurrencies, precious metals and commodities. Sort, filter, and analyze 100+ assets with institutional-grade tools.',
    keywords: [
        'stock market data',
        'cryptocurrency prices',
        'commodity prices',
        'real-time market data',
        'stock screener',
        'crypto tracker',
        'gold price',
        'market overview',
    ],
    openGraph: {
        title: 'All Markets — Stocks, Crypto, Metals & Commodities | FinnSays',
        description: 'Explore real-time data for 100+ global assets. Sort, filter, and analyze with institutional-grade tools.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'All Markets — FinnSays',
        description: 'Real-time market data for stocks, crypto, metals and commodities.',
    },
    alternates: {
        canonical: '/markets',
    },
};

export const revalidate = 60;

export default async function MarketsPage() {
    let initialAssets: Awaited<ReturnType<typeof getMarketData>> = [];
    try {
        initialAssets = await getMarketData();
    } catch {
        // Client will fetch on mount
    }
    return <MarketsClient initialAssets={initialAssets} />;
}
