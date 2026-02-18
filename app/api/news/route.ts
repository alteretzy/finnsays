import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

interface NewsSearchResult {
    news?: Array<{
        uuid: string;
        title: string;
        summary?: string;
        link: string;
        publisher: string;
        providerPublishTime?: Date;
        thumbnail?: {
            resolutions?: Array<{ url: string }>;
        };
        relatedTickers?: string[];
        type?: string;
    }>;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || null;
    const category = searchParams.get('category') || 'All';

    try {
        let news = [];

        if (symbol) {
            // Get news for a specific stock symbol
            const result = await yahooFinance.search(symbol, {
                newsCount: 20,
                quotesCount: 0,
            });
            news = result.news || [];
        } else {
            // Get general market news based on category
            let topics = ['stock market today', 'nasdaq'];

            if (category === 'Crypto') {
                topics = ['cryptocurrency', 'bitcoin', 'blockchain', 'ethereum'];
            } else if (category === 'Stocks') {
                topics = ['stock market', 'wall street', 'sp500', 'dow jones'];
            } else if (category === 'Earnings') {
                topics = ['earnings reports', 'quarterly results', 'revenue beat'];
            } else if (category === 'Economy') {
                topics = ['economy', 'inflation', 'fed rates', 'jobs report'];
            } else {
                // All / Default
                topics = ['stock market', 'crypto market', 'economy', 'financial news'];
            }

            const results = await Promise.allSettled(
                topics.map(topic =>
                    yahooFinance.search(topic, {
                        newsCount: 8,
                        quotesCount: 0,
                    })
                )
            );

            // Merge all news from all topics
            const allNews = results
                .filter((r) => r.status === 'fulfilled')
                .flatMap((r) => (r as unknown as PromiseFulfilledResult<NewsSearchResult>).value.news || []);

            // Deduplicate by UUID
            const seen = new Set();
            news = allNews.filter(item => {
                if (seen.has(item.uuid)) return false;
                seen.add(item.uuid);
                return true;
            });
        }

        // Clean and format the news
        const formatted = news.map((item) => ({
            id: item.uuid,
            title: item.title,
            summary: item.summary || '',
            url: item.link,
            source: item.publisher,
            publishedAt: item.providerPublishTime
                ? new Date(item.providerPublishTime).toISOString()
                : new Date().toISOString(),
            thumbnail: item.thumbnail?.resolutions?.[0]?.url || null,
            relatedTickers: item.relatedTickers || [],
            type: item.type || 'STORY',
        }));

        return NextResponse.json(formatted, {
            headers: {
                'Cache-Control': 's-maxage=300, stale-while-revalidate', // Cache 5 mins
            },
        });

    } catch {
        return NextResponse.json(
            { error: 'Failed to fetch news' },
            { status: 500 }
        );
    }
}
