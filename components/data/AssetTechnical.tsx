'use client';

import FadeIn from '@/components/animations/FadeIn';
import TradingViewWidget from '@/components/charts/TradingViewWidget';
import OrderBook from '@/components/data/OrderBook';
import { formatVolume } from '@/lib/utils/formatters';

import { CandleData } from '@/lib/finnhub/types';

interface AssetTechnicalProps {
    symbol: string;
    candleData: CandleData[];
    currentPrice: number;
}

export default function AssetTechnical({
    symbol,
    candleData,
    currentPrice
}: AssetTechnicalProps) {
    return (
        <FadeIn delay={0.05}>
            <section className="mb-10">
                <h2 className="text-xl font-light mb-5 text-white/80">Technical Analysis</h2>

                {/* Chart with indicators enabled */}
                <div className="mb-8">
                    <div className="h-[600px] w-full bg-[#131722] rounded-xl overflow-hidden border border-white/5">
                        <TradingViewWidget symbol={symbol} />
                    </div>
                </div>

                {/* Technical indicators summary & Order Book */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Book - Takes up 1 column on large screens */}
                    <div className="lg:col-span-1">
                        <h3 className="text-sm font-medium text-white/50 mb-3 uppercase tracking-wider">Order Book (Level 2)</h3>
                        <OrderBook symbol={symbol} currentPrice={currentPrice} />
                    </div>

                    {/* Indicators Grid - Takes up 2 columns */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
                            <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Moving Averages</p>
                            <div className="space-y-2">
                                {candleData.length >= 20 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-blue-400">SMA 20</span>
                                        <span className="text-white/70 font-mono">
                                            ${(candleData.slice(-20).reduce((s, d) => s + d.close, 0) / 20).toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                {candleData.length >= 50 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-amber-400">SMA 50</span>
                                        <span className="text-white/70 font-mono">
                                            ${(candleData.slice(-50).reduce((s, d) => s + d.close, 0) / 50).toFixed(2)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
                            <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Price Range</p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/40">Period High</span>
                                    <span className="text-emerald-400 font-mono">
                                        ${Math.max(...candleData.map((d) => d.high)).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/40">Period Low</span>
                                    <span className="text-red-400 font-mono">
                                        ${Math.min(...candleData.map((d) => d.low)).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/40">Avg Volume</span>
                                    <span className="text-white/70 font-mono">
                                        {formatVolume(candleData.reduce((s, d) => s + (d.volume || 0), 0) / candleData.length)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
                            <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Trend</p>
                            <div className="space-y-2">
                                {candleData.length >= 2 && (() => {
                                    const first = candleData[0].close;
                                    const last = candleData[candleData.length - 1].close;
                                    const change = ((last - first) / first) * 100;
                                    return (
                                        <>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-white/40">Period Return</span>
                                                <span className={`font-mono ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-white/40">Direction</span>
                                                <span className={change >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                                                    {change >= 0 ? '↗ Bullish' : '↘ Bearish'}
                                                </span>
                                            </div>
                                        </>
                                    );
                                })()}
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/40">Data Points</span>
                                    <span className="text-white/70 font-mono">{candleData.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </FadeIn>
    );
}
