/**
 * Hook for debouncing values to limit how often they update.
 * Useful for search inputs, form fields, or any value that changes frequently.
 */
import {useEffect, useState} from 'react';

/**
 * Custom hook that delays updating a value until a specified delay has passed.
 * Prevents rapid, successive updates by waiting until input has stopped changing.
 * @template T The type of the value being debounced
 * @param {T} value - The value to debounce
 * @param {number} delay - The delay time in milliseconds
 * @returns {T} The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}