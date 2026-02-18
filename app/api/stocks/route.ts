import { NextResponse } from 'next/server';
import { dataAggregator } from '@/lib/dataManager/aggregator';
import { STOCK_WATCHLIST } from '@/lib/data/market-data';

export const revalidate = 60;

export async function GET() {
    try {
        const symbols = STOCK_WATCHLIST.map(s => s.symbol);
        const quotes = await dataAggregator.getQuotes(symbols);

        const formatted = quotes.map(q => {
            const staticData = STOCK_WATCHLIST.find(s => s.symbol === q.symbol);
            return {
                symbol: q.symbol,
                name: staticData?.name || q.symbol,
                type: 'Stock',
                price: q.price,
                changePercent: q.changePercent,
                change: q.change,
                volume: q.volume,
                marketCap: 0, // Yahoo quote might not have it in AggregatedQuote, can add later if crucial
                high: q.high,
                low: q.low,
                open: q.open,
                prevClose: q.previousClose,
                exchange: 'US', // Placeholder
                currency: 'USD',
            };
        });

        return NextResponse.json(formatted, {
            headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' }
        });
    } catch (error) {
        console.error('Stocks API failed:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stocks' },
            { status: 500 }
        );
    }
}
