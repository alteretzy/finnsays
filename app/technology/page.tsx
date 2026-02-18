import { Metadata } from 'next';
import TechnologyClient from './TechnologyClient';

export const metadata: Metadata = {
    title: 'Technology — FinnSays',
    description: 'Explore the high-performance infrastructure powering FinnSays — from sub-millisecond execution to proprietary synchronization gateways.',
    openGraph: {
        title: 'Technology — FinnSays',
        description: 'High-performance infrastructure powering institutional-grade market intelligence.',
        type: 'website',
    },
    twitter: {
        card: 'summary',
        title: 'Technology — FinnSays',
        description: 'High-performance infrastructure for real-time market data.',
    },
    alternates: {
        canonical: '/technology',
    },
};

export default function TechnologyPage() {
    return <TechnologyClient />;
}
