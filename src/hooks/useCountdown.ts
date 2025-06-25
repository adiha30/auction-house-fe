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
        const timer = setTimeout(() => {
            setTime(calculateTimeLeft(endTime));
        }, 1000);

        return () => clearTimeout(timer);
    });

    const formattedTimeLeft = formatTimeLeft(time.timeLeft);
    const isUrgent = time.difference > 0 && time.difference < 1000 * 60 * 60 * 24; // Urgent if less than 1 day left

    return {
        timeLeft: formattedTimeLeft,
        isUrgent: isUrgent,
        ...time.timeLeft,
    };
};