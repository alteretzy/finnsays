import { Metadata } from 'next';
import { getMarketData } from '@/lib/data/market-data';
import PortfolioClient from '@/components/data/PortfolioClient';

export const metadata: Metadata = {
    title: 'Portfolio Tracker — FinnSays',
    description: 'Track your wealth and performance across stocks, crypto, metals and commodities with real-time portfolio analytics.',
    openGraph: {
        title: 'Portfolio Tracker — FinnSays',
        description: 'Track your wealth across global markets with real-time analytics.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Portfolio Tracker — FinnSays',
        description: 'Track your wealth across global markets with real-time analytics.',
    },
    alternates: {
        canonical: '/portfolio',
    },
};

export const revalidate = 60;

export default async function PortfolioPage() {
    const marketData = await getMarketData();

    return <PortfolioClient initialData={marketData} />;
}
