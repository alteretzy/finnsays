import { NextResponse } from 'next/server';
import { dataAggregator } from '@/lib/dataManager/aggregator';
import { COMMODITIES } from '@/lib/data/market-data';

export const revalidate = 60;

export async function GET() {
    try {
        const symbols = COMMODITIES.map(c => c.symbol);
        const quotes = await dataAggregator.getQuotes(symbols);

        const formatted = quotes.map(q => {
            const staticData = COMMODITIES.find(c => c.symbol === q.symbol);
            return {
                symbol: q.symbol,
                name: staticData?.name || q.symbol,
                type: 'Commodity',
                price: q.price,
                changePercent: q.changePercent,
                change: q.change,
                volume: q.volume,
                marketCap: 0,
                high: q.high,
                low: q.low,
            };
        });

        return NextResponse.json(formatted);
    } catch (error) {
        console.error('Commodities API failed:', error);
        return NextResponse.json(
            { error: 'Failed to fetch commodities' },
            { status: 500 }
        );
    }
}
