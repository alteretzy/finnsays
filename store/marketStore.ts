import { create } from 'zustand';

import { TickerData } from '@/lib/websocket/manager';

interface MarketState {
    prices: Record<string, number>;
    changes: Record<string, number>; // 24h Change %
    volumes: Record<string, number>;
    previousCloses: Record<string, number>;
    lastUpdated: Record<string, number>;
    connected: boolean;

    updateFromTicker: (data: TickerData) => void;
    setPreviousClose: (symbol: string, pc: number) => void;
    setConnected: (status: boolean) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
    prices: {},
    changes: {},
    volumes: {},
    previousCloses: {},
    lastUpdated: {},
    connected: false,

    setPreviousClose: (symbol, pc) =>
        set((state) => ({
            previousCloses: { ...state.previousCloses, [symbol]: pc }
        })),

    updateFromTicker: (data) =>
        set((state) => {
            const currentPrice = data.price;
            let changePercent = data.changePercent;

            // If ticker doesn't provide changePercent (like Finnhub), calculate it from previousClose
            if (changePercent === 0 && state.previousCloses[data.symbol]) {
                const pc = state.previousCloses[data.symbol];
                changePercent = ((currentPrice - pc) / pc) * 100;
            }

            return {
                prices: { ...state.prices, [data.symbol]: currentPrice },
                changes: { ...state.changes, [data.symbol]: changePercent || state.changes[data.symbol] || 0 },
                volumes: { ...state.volumes, [data.symbol]: data.volume || state.volumes[data.symbol] || 0 },
                lastUpdated: { ...state.lastUpdated, [data.symbol]: data.timestamp || Date.now() }
            };
        }),

    setConnected: (status) => set({ connected: status })
}));
