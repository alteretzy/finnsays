/**
 * Comprehensive Market Data Service
 * Fetches real data via Yahoo Finance (sourced from DataAggregator)
 * Covers: Wall Street stocks, major cryptos, commodities, metals
 */

import { MarketAsset } from '@/lib/finnhub/types';
import { getMockMarketData } from '@/lib/finnhub/api'; // Keep as last resort fallback
import { dataAggregator } from '@/lib/dataManager/aggregator';
import { logAPIError } from '@/lib/errors/handler';

// ── Wall Street Stocks ────────────────────────────
export const STOCK_WATCHLIST = [
    // Mega-Cap Tech
    { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology' },
    { symbol: 'META', name: 'Meta Platforms', sector: 'Technology' },
    { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Cyclical' },
    { symbol: 'AVGO', name: 'Broadcom Inc.', sector: 'Technology' },
    { symbol: 'ORCL', name: 'Oracle Corp.', sector: 'Technology' },
    { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology' },
    { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology' },
    { symbol: 'AMD', name: 'AMD Inc.', sector: 'Technology' },
    { symbol: 'INTC', name: 'Intel Corp.', sector: 'Technology' },
    { symbol: 'CSCO', name: 'Cisco Systems', sector: 'Technology' },
    { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services' },
    // Finance / Banking
    { symbol: 'JPM', name: 'JPMorgan Chase', sector: 'Financial Services' },
    { symbol: 'V', name: 'Visa Inc.', sector: 'Financial Services' },
    { symbol: 'MA', name: 'Mastercard Inc.', sector: 'Financial Services' },
    { symbol: 'BAC', name: 'Bank of America', sector: 'Financial Services' },
    { symbol: 'GS', name: 'Goldman Sachs', sector: 'Financial Services' },
    { symbol: 'MS', name: 'Morgan Stanley', sector: 'Financial Services' },
    { symbol: 'WFC', name: 'Wells Fargo', sector: 'Financial Services' },
    { symbol: 'C', name: 'Citigroup Inc.', sector: 'Financial Services' },
    { symbol: 'BLK', name: 'BlackRock Inc.', sector: 'Financial Services' },
    { symbol: 'SCHW', name: 'Charles Schwab', sector: 'Financial Services' },
    // Healthcare / Pharma
    { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
    { symbol: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare' },
    { symbol: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare' },
    { symbol: 'ABBV', name: 'AbbVie Inc.', sector: 'Healthcare' },
    { symbol: 'LLY', name: 'Eli Lilly', sector: 'Healthcare' },
    { symbol: 'MRK', name: 'Merck & Co.', sector: 'Healthcare' },
    // Consumer / Retail
    { symbol: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Defensive' },
    { symbol: 'HD', name: 'Home Depot', sector: 'Consumer Cyclical' },
    { symbol: 'KO', name: 'Coca-Cola Co.', sector: 'Consumer Defensive' },
    { symbol: 'PEP', name: 'PepsiCo Inc.', sector: 'Consumer Defensive' },
    { symbol: 'MCD', name: "McDonald's Corp.", sector: 'Consumer Cyclical' },
    { symbol: 'NKE', name: 'Nike Inc.', sector: 'Consumer Cyclical' },
    { symbol: 'SBUX', name: 'Starbucks Corp.', sector: 'Consumer Cyclical' },
    { symbol: 'DIS', name: 'Walt Disney Co.', sector: 'Communication Services' },
    // Industrial / Energy
    { symbol: 'XOM', name: 'Exxon Mobil', sector: 'Energy' },
    { symbol: 'CVX', name: 'Chevron Corp.', sector: 'Energy' },
    { symbol: 'BA', name: 'Boeing Co.', sector: 'Industrials' },
    { symbol: 'CAT', name: 'Caterpillar Inc.', sector: 'Industrials' },
    { symbol: 'GE', name: 'General Electric', sector: 'Industrials' },
    { symbol: 'LMT', name: 'Lockheed Martin', sector: 'Industrials' },
    { symbol: 'RTX', name: 'RTX Corp.', sector: 'Industrials' },
    { symbol: 'UPS', name: 'United Parcel Service', sector: 'Industrials' },
    // Telecom / Other
    { symbol: 'T', name: 'AT&T Inc.', sector: 'Communication Services' },
    { symbol: 'VZ', name: 'Verizon Comms.', sector: 'Communication Services' },
    { symbol: 'PYPL', name: 'PayPal Holdings', sector: 'Financial Services' },
    { symbol: 'SQ', name: 'Block Inc.', sector: 'Financial Services' },
    { symbol: 'UBER', name: 'Uber Technologies', sector: 'Technology' },
    { symbol: 'ABNB', name: 'Airbnb Inc.', sector: 'Consumer Cyclical' },
    { symbol: 'COIN', name: 'Coinbase Global', sector: 'Financial Services' },
    { symbol: 'SNAP', name: 'Snap Inc.', sector: 'Communication Services' },
    { symbol: 'PLTR', name: 'Palantir Tech.', sector: 'Technology' },
    { symbol: 'RIVN', name: 'Rivian Automotive', sector: 'Consumer Cyclical' },
];

export interface CryptoID {
    id: string; // Slug (for linking)
    symbol: string; // Yahoo Ticker
    name: string;
}

export const CRYPTO_IDS: Record<string, CryptoID> = {
    'bitcoin': { id: 'bitcoin', symbol: 'BTC-USD', name: 'Bitcoin' },
    'ethereum': { id: 'ethereum', symbol: 'ETH-USD', name: 'Ethereum' },
    'solana': { id: 'solana', symbol: 'SOL-USD', name: 'Solana' },
    'ripple': { id: 'ripple', symbol: 'XRP-USD', name: 'XRP' },
    'cardano': { id: 'cardano', symbol: 'ADA-USD', name: 'Cardano' },
    'avalanche-2': { id: 'avalanche-2', symbol: 'AVAX-USD', name: 'Avalanche' },
    'dogecoin': { id: 'dogecoin', symbol: 'DOGE-USD', name: 'Dogecoin' },
    'polkadot': { id: 'polkadot', symbol: 'DOT-USD', name: 'Polkadot' },
    'chainlink': { id: 'chainlink', symbol: 'LINK-USD', name: 'Chainlink' },
    'matic-network': { id: 'matic-network', symbol: 'MATIC-USD', name: 'Polygon' },
    litecoin: { id: 'litecoin', symbol: 'LTC-USD', name: 'Litecoin' },
    uniswap: { id: 'uniswap', symbol: 'UNI-USD', name: 'Uniswap' },
    stellar: { id: 'stellar', symbol: 'XLM-USD', name: 'Stellar' },
    cosmos: { id: 'cosmos', symbol: 'ATOM-USD', name: 'Cosmos' },
    near: { id: 'near', symbol: 'NEAR-USD', name: 'NEAR Protocol' },
};

export const COMMODITIES = [
    { symbol: 'CL=F', name: 'Crude Oil (WTI)', fallbackPrice: 76.84 },
    { symbol: 'BZ=F', name: 'Brent Crude', fallbackPrice: 82.10 },
    { symbol: 'NG=F', name: 'Natural Gas', fallbackPrice: 2.18 },
    { symbol: 'HO=F', name: 'Heating Oil', fallbackPrice: 2.52 },
    { symbol: 'RB=F', name: 'Gasoline (RBOB)', fallbackPrice: 2.28 },
    { symbol: 'ZC=F', name: 'Corn', fallbackPrice: 4.52 },
    { symbol: 'ZW=F', name: 'Wheat', fallbackPrice: 5.98 },
    { symbol: 'ZS=F', name: 'Soybeans', fallbackPrice: 11.82 },
    { symbol: 'KC=F', name: 'Coffee', fallbackPrice: 185.40 },
    { symbol: 'CT=F', name: 'Cotton', fallbackPrice: 78.50 },
    { symbol: 'SB=F', name: 'Sugar', fallbackPrice: 22.15 },
    { symbol: 'CC=F', name: 'Cocoa', fallbackPrice: 4850.00 },
    { symbol: 'LE=F', name: 'Live Cattle', fallbackPrice: 175.20 },
    { symbol: 'LBS=F', name: 'Lumber', fallbackPrice: 562.00 },
];

export const COMMODITY_MAP: Record<string, { symbol: string; name: string; description: string; slug: string }> = {
    'crude-oil': { symbol: 'CL=F', name: 'Crude Oil', description: 'Crude Oil (WTI) Futures', slug: 'crude-oil' },
    'brent-oil': { symbol: 'BZ=F', name: 'Brent Crude', description: 'Brent Crude Oil Futures', slug: 'brent-oil' },
    'natural-gas': { symbol: 'NG=F', name: 'Natural Gas', description: 'Natural Gas Futures', slug: 'natural-gas' },
    'corn': { symbol: 'ZC=F', name: 'Corn', description: 'Corn Futures', slug: 'corn' },
    'wheat': { symbol: 'ZW=F', name: 'Wheat', description: 'Wheat Futures', slug: 'wheat' },
    'soybeans': { symbol: 'ZS=F', name: 'Soybeans', description: 'Soybean Futures', slug: 'soybeans' },
    'coffee': { symbol: 'KC=F', name: 'Coffee', description: 'Coffee Futures', slug: 'coffee' },
    'gold': { symbol: 'GC=F', name: 'Gold', description: 'Gold Futures', slug: 'gold' },
    'silver': { symbol: 'SI=F', name: 'Silver', description: 'Silver Futures', slug: 'silver' },
    'platinum': { symbol: 'PL=F', name: 'Platinum', description: 'Platinum Futures', slug: 'platinum' },
    'palladium': { symbol: 'PA=F', name: 'Palladium', description: 'Palladium Futures', slug: 'palladium' },
    'copper': { symbol: 'HG=F', name: 'Copper', description: 'Copper Futures', slug: 'copper' },
};

export const METALS = [
    { symbol: 'GC=F', name: 'Gold', fallbackPrice: 2038.50 },
    { symbol: 'SI=F', name: 'Silver', fallbackPrice: 22.94 },
    { symbol: 'PL=F', name: 'Platinum', fallbackPrice: 908.50 },
    { symbol: 'PA=F', name: 'Palladium', fallbackPrice: 965.00 },
    { symbol: 'HG=F', name: 'Copper', fallbackPrice: 3.82 },
    { symbol: 'ALI=F', name: 'Aluminum', fallbackPrice: 2285.00 },
];

function generateSparkline(base: number, volatility: number): number[] {
    const points: number[] = [];
    let current = base;
    for (let i = 0; i < 20; i++) {
        current += (Math.random() - 0.48) * volatility;
        points.push(current);
    }
    return points;
}

// ── Main export: get all market data ──────────────
export async function getMarketData(): Promise<MarketAsset[]> {
    const isBuild = process.env.NODE_ENV === 'production' && !process.env.NEXT_RUNTIME;

    if (isBuild) {
        return getMockMarketData();
    }

    try {
        const stockAssets = STOCK_WATCHLIST.map(s => ({ ...s, type: 'stock' as const }));
        const cryptoAssets = Object.values(CRYPTO_IDS).map(c => ({ ...c, type: 'crypto' as const }));
        const commodityAssets = COMMODITIES.map(c => ({ ...c, type: 'commodity' as const }));
        const metalAssets = METALS.map(m => ({ ...m, type: 'metal' as const }));

        // Combine all assets
        const allAssets = [...stockAssets, ...cryptoAssets, ...commodityAssets, ...metalAssets];

        // Extract symbols for batch fetching
        const allSymbols = allAssets.map(a => a.symbol);

        // Fetch using DataAggregator's safe batching with sparklines enabled
        const quotes = await dataAggregator.getQuotes(allSymbols, true);

        // Map quotes back to MarketAsset format
        const finalResults: MarketAsset[] = [];

        // Create a map for fast lookup
        const quoteMap = new Map(quotes.map(q => [q.symbol, q]));

        for (const asset of allAssets) {
            const quote = quoteMap.get(asset.symbol);
            if (quote) {
                finalResults.push({
                    symbol: asset.symbol,
                    name: asset.name,
                    type: asset.type,
                    sector: 'sector' in asset ? (asset as { sector: string }).sector : undefined,
                    price: quote.price,
                    change: quote.change,
                    changePercent: quote.changePercent,
                    volume: quote.volume,
                    marketCap: quote.marketCap,
                    // Use real sparkline if available, otherwise fallback to generator (unlikely needed if API works)
                    sparklineData: quote.sparkline && quote.sparkline.length > 5
                        ? quote.sparkline
                        : generateSparkline(quote.price, quote.price * 0.01),
                });
            }
        }

        if (finalResults.length >= 5) {
            return finalResults;
        }

        return getMockMarketData();
    } catch (error) {
        logAPIError('market-data.fetch', error);
        return getMockMarketData();
    }
}

// ── Real-time Helper for API Route ────────────────
export async function getRealtimeQuote(symbol: string): Promise<{ price: number; change: number; changePercent: number; high: number; low: number; open: number; prevClose: number } | null> {
    try {
        const quote = await dataAggregator.getQuote(symbol);
        if (quote) {
            return {
                price: quote.price,
                change: quote.change,
                changePercent: quote.changePercent,
                high: quote.high,
                low: quote.low,
                open: quote.open,
                prevClose: quote.previousClose
            };
        }
    } catch (error) {
        logAPIError('market-data.getRealtimeQuote', error);
    }
    return null;
}

export function getAllAssetIds(): string[] {
    const stocks = STOCK_WATCHLIST.map(s => s.symbol);
    const crypto = Object.values(CRYPTO_IDS).map(c => c.symbol);
    const commodities = COMMODITIES.map(c => c.symbol);
    const metals = METALS.map(m => m.symbol);
    return [...stocks, ...crypto, ...commodities, ...metals];
}

export { getMockMarketData } from '@/lib/finnhub/api';
