/**
 * Utility functions for handling image URL resolution.
 * This module provides functions to convert image IDs to fully qualified URLs.
 */
import {API_URL} from "../api/config.ts";
import {uploadsPath} from "../api/listingApi.ts";

/**
 * Resolves a single image ID to a complete URL.
 * If the ID already starts with 'http', it's assumed to be a complete URL and returned as is.
 * Otherwise, it's combined with the API URL and uploads path.
 *
 * @param id - The image ID or URL to resolve
 * @returns A complete URL to the image
 */
export const resolveImageUrl = (id: string): string =>
    id.startsWith('http') ? id : `${API_URL}${uploadsPath}/${id}`;

/**
 * Resolves an array of image IDs to complete URLs.
 * Filters out null or undefined values before processing.
 *
 * @param ids - Array of image IDs or URLs to resolve
 * @returns Array of complete image URLs
 */
export const resolveImageUrls = (ids: (string | undefined | null)[] = []): string[] =>
    ids.filter(Boolean).map(id => resolveImageUrl(String(id)));