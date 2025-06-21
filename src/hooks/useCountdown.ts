// src/hooks/useCountdown.ts
import {useEffect, useState} from 'react';

function pad(num: number, len = 2) {
    return num.toString().padStart(len, '0');
}

export interface Countdown {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    finished: boolean;
    isUrgent: boolean;
}

export function useCountdown(isoEnd: string): Countdown {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        if (!isoEnd) return;

        const drift = 1000 - (Date.now() % 1000);
        const timeout = setTimeout(() => {
            setNow(Date.now());
            const id = setInterval(() => setNow(Date.now()), 1000);
            return () => clearInterval(id);
        }, drift);

        return () => clearTimeout(timeout);
    }, [isoEnd]);

    const diff = Math.max(new Date(isoEnd).getTime() - now, 0);
    const s = Math.floor(diff / 1000);

    const days = Math.floor(s / 86400);
    const hours = Math.floor((s % 86400) / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;
    const isUrgent = diff < 1000 * 60 * 60;

    return {
        days: pad(days, 2),
        hours: pad(hours, 2),
        minutes: pad(minutes, 2),
        seconds: pad(seconds, 2),
        finished: diff === 0,
        isUrgent: isUrgent,
    };
}
