import { Metadata } from 'next';
import MarketsClient from '../markets/MarketsClient';
import { getMarketData } from '@/lib/data/market-data';

export const metadata: Metadata = {
    title: 'Stocks Market — Institutional-Grade Analytics | FinnSays',
    description: 'Track global stocks with real-time data, advanced charts, and technical indicators. Monitor Apple, Microsoft, Tesla, and more mega-cap growth stocks.',
};

export const revalidate = 60;

export default async function StocksPage() {
    let initialAssets: Awaited<ReturnType<typeof getMarketData>> = [];
    try {
        initialAssets = (await getMarketData()).filter(a => a.type === 'stock');
    } catch {
        // Client will fetch on mount
    }
    return <MarketsClient initialType="Stocks" initialAssets={initialAssets} />;
}
