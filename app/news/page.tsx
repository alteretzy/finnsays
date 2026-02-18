
import { Metadata } from 'next';
import NewsFeed from '@/components/NewsCard';

export const metadata: Metadata = {
    title: 'Market News | FinnSays',
    description: 'Real-time financial news covering stocks, crypto, commodities and global markets. Stay informed with curated market intelligence.',
    keywords: [
        'financial news',
        'stock market news',
        'crypto news',
        'market intelligence',
        'trading news',
        'commodity news',
        'real-time news',
    ],
    openGraph: {
        title: 'Market News — FinnSays',
        description: 'Real-time financial news covering stocks, crypto and global markets.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Market News — FinnSays',
        description: 'Real-time financial news covering stocks, crypto and global markets.',
    },
    alternates: {
        canonical: '/news',
    },
};

export default function NewsPage() {
    return (
        <main className="max-w-4xl mx-auto px-4 py-24">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Market News</h1>
                <span className="text-xs text-gray-400 bg-green-500/10 text-green-400 px-2 py-1 rounded-full">
                    ● Live via Yahoo Finance
                </span>
            </div>



            <NewsFeed />
        </main>
    );
}
