import { Metadata } from 'next';
import { getMarketData } from '@/lib/data/market-data';
import AssetPage from '../../asset/[symbol]/page';

interface PageProps {
    params: Promise<{
        symbol: string;
    }>;
}

export const revalidate = 60;

// Generate static params from our curated watchlist
export async function generateStaticParams() {
    const data = await getMarketData();
    // Only return stock symbols for this route
    return data.filter(a => a.type === 'stock').map((asset) => ({
        symbol: asset.symbol,
    }));
}

// Reuse AssetPage for consistent rendering and logic
export default AssetPage;

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const { symbol: rawSymbol } = await props.params;
    const symbol = rawSymbol.toUpperCase();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://finnsays.com';

    return {
        title: `${symbol} Stock Price Today (Live) | FinnSays`,
        description: `Track real-time ${symbol} stock price, analyst ratings, performance charts, and financial news.`,
        openGraph: {
            title: `${symbol} Stock Price Today (Live) | FinnSays`,
            description: `Real-time ${symbol} stock price, performance charts, and institutional-grade analytics.`,
            type: 'website',
            siteName: 'FinnSays',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${symbol} Stock Price — FinnSays`,
            description: `Track ${symbol} live with real-time analytics and charts.`,
        },
        alternates: {
            canonical: `${siteUrl}/stocks/${symbol}`,
        },
    };
}
