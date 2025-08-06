/**
 * Utility for text manipulation and formatting.
 * This module provides functions for standardizing and formatting text.
 */

/**
 * Converts a string to title case format.
 * First letter of each word is capitalized, with the rest in lowercase.
 * 
 * @param str - The string to convert to title case
 * @returns The string in title case format
 */
export const toTitleCase = (str: string): string => {
    return str.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase());
}