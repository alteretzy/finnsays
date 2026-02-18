import { NextResponse } from 'next/server';
import { getMarketData } from '@/lib/data/market-data';

export const revalidate = 60;

export async function GET() {
    try {
        const assets = await getMarketData();
        const cryptoAssets = assets.filter(a => a.type === 'crypto');

        const formatted = cryptoAssets.map(coin => ({
            symbol: coin.symbol,
            name: coin.name,
            type: 'Crypto',
            price: coin.price,
            changePercent: coin.changePercent,
            change7d: 0, // Finnhub doesn't provide 7d change in quote
            volume: coin.volume,
            marketCap: coin.marketCap,
            image: '', // No image in Finnhub data
            sparkline: coin.sparklineData,
            rank: 0,
        }));

        return NextResponse.json(formatted, {
            headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' }
        });

    } catch (error) {
        console.error('Crypto API failed:', error);
        return NextResponse.json(
            { error: 'Failed to fetch crypto data' },
            { status: 500 }
        );
    }
}
