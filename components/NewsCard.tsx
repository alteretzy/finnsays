
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useNews } from '@/hooks/useNews';

function timeAgo(dateString: string) {
    const now = new Date();
    const then = new Date(dateString);
    const diff = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

const CATEGORIES = ['All', 'Stocks', 'Crypto', 'Earnings', 'Economy'];

export default function NewsFeed({ symbol }: { symbol?: string }) {
    const [category, setCategory] = useState('All');
    const { news, loading, error } = useNews(symbol, category);

    return (
        <div className="space-y-6">
            {/* Show filters only if not viewing specific symbol news */}
            {!symbol && (
                <div className="flex gap-2 flex-wrap">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`btn-reflection text-sm px-4 py-1.5 rounded-full border transition-all duration-300 font-medium tracking-wide
                                ${category === cat
                                    ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-blue-500/50 hover:text-blue-400 hover:bg-white/10'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            {loading ? (
                <div className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-gray-800 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <p className="text-red-400 text-sm">Failed to load news</p>
            ) : (
                <div className="space-y-4">
                    {news.map(item => (
                        <a
                            key={item.id}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex gap-3 group hover:bg-white/5 p-3 rounded-lg transition"
                        >
                            {/* Thumbnail */}
                            {item.thumbnail && (
                                <div className="relative w-24 h-16 flex-shrink-0">
                                    <Image
                                        src={item.thumbnail}
                                        alt={item.title}
                                        fill
                                        className="object-cover rounded"
                                        sizes="(max-width: 768px) 96px, 120px"
                                    />
                                </div>
                            )}

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-blue-400 transition">
                                    {item.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs text-gray-400">{item.source}</span>
                                    <span className="text-gray-600">·</span>
                                    <span className="text-xs text-gray-500">
                                        {timeAgo(item.publishedAt)}
                                    </span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
