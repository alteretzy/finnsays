import { NextRequest, NextResponse } from 'next/server';
import { dataAggregator } from '@/lib/dataManager/aggregator';

export const revalidate = 0; // No caching for real-time quotes

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const symbol = searchParams.get('symbol');

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    try {
        const quote = await dataAggregator.getQuote(symbol);

        if (!quote) {
            return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
        }

        // Transform AggregatedQuote to FinnhubQuote format for frontend compatibility
        return NextResponse.json({
            c: quote.price,
            d: quote.change,
            dp: quote.changePercent,
            h: quote.high,
            l: quote.low,
            o: quote.open,
            pc: quote.previousClose,
            t: Math.floor(quote.timestamp / 1000)
        });

    } catch (error) {
        console.error('[quote] Error fetching quote:', error);
        return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 });
    }
}
