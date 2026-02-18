'use client';

import { useEffect, useState, ReactNode } from 'react';

interface PriceFlashProps {
    value: number;
    children: (flashing: 'up' | 'down' | null) => ReactNode;
}

export default function PriceFlash({ value, children }: PriceFlashProps) {
    const [flashing, setFlashing] = useState<'up' | 'down' | null>(null);
    const [previousValue, setPreviousValue] = useState(value);

    useEffect(() => {
        if (value !== previousValue) {
            setFlashing(value > previousValue ? 'up' : 'down');
            setPreviousValue(value);

            const timer = setTimeout(() => {
                setFlashing(null);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [value, previousValue]);

    return (
        <div
            className={`transition-all duration-300 rounded ${flashing === 'up'
                ? 'bg-emerald-500/10'
                : flashing === 'down'
                    ? 'bg-red-500/10'
                    : ''
                }`}
        >
            {children(flashing)}
        </div>
    );
}
