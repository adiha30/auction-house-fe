/**
 * Hook and helper functions for countdown timer functionality.
 * Provides a countdown timer that updates every second until a specified end time.
 */
import {useEffect, useState} from 'react';

/**
 * Calculates the time left until the specified end time.
 * @param {string} endTime - The ISO string date representing the end time
 * @returns {Object} Object containing the difference in milliseconds and timeLeft object with days, hours, minutes, seconds
 */
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

/**
 * Formats the time left object into a human-readable string.
 * @param {Object} timeLeft - Object containing days, hours, minutes, seconds
 * @returns {string} Formatted string representation of the time left
 */
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

/**
 * Custom hook that provides countdown functionality for a specific end time.
 * @param {string} endTime - The ISO string date representing the end time
 * @returns {Object} Object containing the formatted time left, isUrgent flag, and individual time components
 */
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
