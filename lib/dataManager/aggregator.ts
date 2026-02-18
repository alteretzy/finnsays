import YahooFinance from 'yahoo-finance2';
import { deduplicator } from '@/lib/utils/deduplicator';
import { logAPIError } from '@/lib/errors/handler';
import fs from 'fs';
import path from 'path';

const yahooFinance = new YahooFinance({
    suppressNotices: ['yahooSurvey']
});

// ── In-memory & Persistent cache ──────────────────
interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

const MEMORY_CACHE = new Map<string, CacheEntry<unknown>>();
const CACHE_DIR = path.join(process.cwd(), '.next/cache/finnsays');

// Ensure cache directory exists
if (typeof window === 'undefined' && !fs.existsSync(CACHE_DIR)) {
    try {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
    } catch {
        // Ignore
    }
}

function getCachePath(key: string): string {
    return path.join(CACHE_DIR, `${Buffer.from(key).toString('hex')}.json`);
}

function getCached<T>(key: string, ttlMs: number): T | null {
    // 1. Try memory
    const entry = MEMORY_CACHE.get(key);
    if (entry && (Date.now() - entry.timestamp <= ttlMs)) {
        return entry.data as T;
    }

    // 2. Try file (only on server)
    if (typeof window === 'undefined') {
        const filePath = getCachePath(key);
        if (fs.existsSync(filePath)) {
            try {
                const stats = fs.statSync(filePath);
                if (Date.now() - stats.mtimeMs <= ttlMs) {
                    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                    MEMORY_CACHE.set(key, { data, timestamp: stats.mtimeMs });
                    return data as T;
                }
            } catch {
                // Ignore cache read errors
            }
        }
    }

    return null;
}

function setCache<T>(key: string, data: T): void {
    MEMORY_CACHE.set(key, { data, timestamp: Date.now() });

    if (typeof window === 'undefined') {
        try {
            const filePath = getCachePath(key);
            fs.writeFileSync(filePath, JSON.stringify(data), 'utf-8');
        } catch {
            // Ignore cache write errors
        }
    }
}

// ── Quote type ────────────────────────────────────
export interface AggregatedQuote {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    high: number;
    low: number;
    open: number;
    previousClose: number;
    volume: number;
    marketCap: number;
    sparkline?: number[];
    timestamp: number;
    source: string;
}

export interface AggregatedCandle {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

// ── DataAggregator class (Yahoo Finance) ───────────

class DataAggregator {
    /**
     * Get a real-time quote with caching
     */
    async getQuote(symbol: string, includeSparkline = false): Promise<AggregatedQuote | null> {
        const cacheKey = `quote:${symbol}:${includeSparkline}`;
        return deduplicator.deduplicate(cacheKey, async () => {
            const cached = getCached<AggregatedQuote>(cacheKey, 30_000); // 30s cache
            if (cached) return cached;

            try {
                // Parallel fetch if sparkline requested
                const [quote, chart] = await Promise.all([
                    yahooFinance.quote(symbol).catch(() => null),
                    includeSparkline
                        ? yahooFinance.chart(symbol, {
                            period1: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
                            period2: new Date(),
                            interval: '60m'
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        } as any).catch(() => null) // Cast to any to avoid strict type issues if library types are outdated
                        : Promise.resolve(null)
                ]);

                if (!quote) return null;

                let sparkline: number[] | undefined;
                if (chart && chart.quotes) {
                    sparkline = (chart.quotes as Array<{ close: number }>)
                        .map(q => q.close)
                        .filter(c => c !== null && c !== undefined) as number[];
                }

                const result: AggregatedQuote = {
                    symbol,
                    price: quote.regularMarketPrice || 0,
                    change: quote.regularMarketChange || 0,
                    changePercent: quote.regularMarketChangePercent || 0,
                    high: quote.regularMarketDayHigh || 0,
                    low: quote.regularMarketDayLow || 0,
                    open: quote.regularMarketOpen || 0,
                    previousClose: quote.regularMarketPreviousClose || 0,
                    volume: quote.regularMarketVolume || 0,
                    marketCap: quote.marketCap || 0,
                    sparkline,
                    timestamp: (new Date(quote.regularMarketTime).getTime() || Date.now()),
                    source: 'yahoo',
                };

                setCache(cacheKey, result);
                return result;
            } catch {
                return null;
            }
        });
    }

    /**
     * Get multiple quotes with rate limiting (Batching)
     */
    async getQuotes(symbols: string[], includeSparkline = false): Promise<AggregatedQuote[]> {
        const results: AggregatedQuote[] = [];
        const chunkSize = 5; // Fetch 5 symbols at a time
        const delayBetweenChunks = 100; // 100ms delay

        // Deduplicate symbols input
        const uniqueSymbols = Array.from(new Set(symbols));

        for (let i = 0; i < uniqueSymbols.length; i += chunkSize) {
            const chunk = uniqueSymbols.slice(i, i + chunkSize);
            const promises = chunk.map(symbol => this.getQuote(symbol, includeSparkline));

            const chunkResults = await Promise.all(promises);
            chunkResults.forEach(r => {
                if (r) results.push(r);
            });

            if (i + chunkSize < uniqueSymbols.length) {
                await new Promise(resolve => setTimeout(resolve, delayBetweenChunks));
            }
        }

        return results;
    }

    /**
     * Get historical candles
     */
    async getCandles(
        symbol: string,
        resolution: 'D' | 'W' | 'M' | '60' | '15' | '5' | '1',
        from: number, // Unix timestamp in seconds (Finnhub style)
        to: number    // Unix timestamp in seconds
    ): Promise<AggregatedCandle[]> {
        // Map resolution to Yahoo interval
        const intervalMap: Record<string, '1d' | '1wk' | '1mo' | '1h' | '15m' | '5m' | '1m'> = {
            'D': '1d',
            'W': '1wk',
            'M': '1mo',
            '60': '1h',
            '15': '15m',
            '5': '5m',
            '1': '1m'
        };
        const interval = intervalMap[resolution] || '1d';

        return deduplicator.deduplicate(`candles:${symbol}:${resolution}:${from}:${to}`, async () => {
            const cacheKey = `candles:${symbol}:${resolution}:${from}:${to}`;
            const cached = getCached<AggregatedCandle[]>(cacheKey, 300_000); // 5 min cache
            if (cached) return cached;

            try {
                const result = await yahooFinance.chart(symbol, {
                    period1: new Date(from * 1000),
                    period2: new Date(to * 1000),
                    interval,
                });

                const quotes = (result.quotes || []) as Array<{ date: Date | number; open?: number | null; high?: number | null; low?: number | null; close?: number | null; volume?: number | null }>;
                const candles: AggregatedCandle[] = quotes.map((quote) => {
                    return {
                        time: new Date(quote.date).toISOString().split('T')[0], // YYYY-MM-DD
                        open: quote.open ?? 0,
                        high: quote.high ?? 0,
                        low: quote.low ?? 0,
                        close: quote.close ?? 0,
                        volume: quote.volume ?? 0,
                    };
                });

                if (candles.length > 0) {
                    setCache(cacheKey, candles);
                }

                return candles;

            } catch (error) {
                logAPIError('DataAggregator.getCandles', error);
                return [];
            }
        });
    }
}

// Singleton export
export const dataAggregator = new DataAggregator();
