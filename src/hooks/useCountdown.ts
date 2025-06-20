import {useEffect, useState} from "react";

export function useCountdown(targetIso: string) {
    const [remaining, setRemaining] = useState<number>(() => new Date(targetIso).getTime() - Date.now());

    useEffect(() => {
        const id = setInterval(() => setRemaining(new Date(targetIso).getTime() - Date.now()), 1_000);
        return () => clearInterval(id);
    }, [targetIso]);

    const total = Math.max(remaining, 0);
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / (1000 * 60)) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const isUrgent = total > 0 && total <= 3_600_000;

    return { days, hours, minutes, seconds, isExpired: total <= 0, isUrgent };
}