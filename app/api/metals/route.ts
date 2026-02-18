import { NextResponse } from 'next/server';
import { dataAggregator } from '@/lib/dataManager/aggregator';
import { METALS } from '@/lib/data/market-data';

export const revalidate = 60;

export async function GET() {
    try {
        const symbols = METALS.map(m => m.symbol);
        const quotes = await dataAggregator.getQuotes(symbols);

        const formatted = quotes.map(q => {
            const staticData = METALS.find(m => m.symbol === q.symbol);
            return {
                symbol: q.symbol,
                name: staticData?.name || q.symbol,
                type: 'Metal',
                price: q.price,
                changePercent: q.changePercent,
                change: q.change,
                volume: q.volume,
                marketCap: 0,
                high: q.high,
                low: q.low,
            };
        });

        return NextResponse.json(formatted, {
            headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' }
        });
    } catch (error) {
        console.error('Metals API failed:', error);
        return NextResponse.json(
            { error: 'Failed to fetch metals' },
            { status: 500 }
        );
    }
}
