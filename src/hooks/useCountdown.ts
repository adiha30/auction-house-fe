import {useEffect, useState} from 'react';

const calculateTimeLeft = (endTime: string) => {
    const difference = +new Date(endTime) - +new Date();
    let timeLeft: { days?: number, hours?: number, minutes?: number, seconds?: number } = {};

    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }
    return {difference, timeLeft};
};

const formatTimeLeft = (timeLeft: { days?: number, hours?: number, minutes?: number, seconds?: number }): string => {
    if (Object.keys(timeLeft).length === 0) return "Ended";

    const parts = [];
    if ((timeLeft.days ?? 0) > 0) parts.push(`${timeLeft.days}d`);
    if ((timeLeft.hours ?? 0) > 0) parts.push(`${timeLeft.hours}h`);
    if ((timeLeft.minutes ?? 0) > 0) parts.push(`${timeLeft.minutes}m`);
    if (parts.length === 0 && (timeLeft.seconds ?? 0) > 0) {
        parts.push(`${timeLeft.seconds}s`);
    }
    return parts.slice(0, 2).join(' ');
};

export const useCountdown = (endTime: string) => {
    const [time, setTime] = useState(calculateTimeLeft(endTime));

    useEffect(() => {
        const interval = setInterval(() => {
            const newTime = calculateTimeLeft(endTime);
            setTime(newTime);

            if (newTime.difference <= 0) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [endTime]);

    const formattedTimeLeft = formatTimeLeft(time.timeLeft);
    const isUrgent = time.difference > 0 && time.difference < 1000 * 60 * 60 * 24;

    return {
        timeLeft: formattedTimeLeft,
        isUrgent: isUrgent,
        ...time.timeLeft,
    };
};