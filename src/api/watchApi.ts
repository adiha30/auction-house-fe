/**
 * Watch API module for managing watched listings.
 * Provides functions to add, remove, toggle, and fetch watched listings for the current user.
 *
 * @module watchApi
 */

import api from './axios';
import {ListingSummary} from "./listingApi.ts";
import {resolveImageUrls} from "../utils/imageUrls.ts";
import {enqueueSnackbar} from "notistack";

/**
 * Check if a listing is being watched by the current user.
 * @param id - The listing ID.
 * @returns Promise resolving to true if watching, false otherwise.
 */
export const isWatching = (id: string) =>
    api.get<boolean>(`/watch/${id}`).then(res => res.data);

/**
 * Add a listing to the user's watchlist.
 * @param id - The listing ID.
 * @returns Promise resolving when the listing is added.
 */
export const addWatch = (id: string) =>
    api.post<void>(`/watch/${id}`);

/**
 * Remove a listing from the user's watchlist.
 * @param id - The listing ID.
 * @returns Promise resolving when the listing is removed.
 */
export const removeWatch = (id: string) =>
    api.delete<void>(`/watch/${id}`);

/**
 * Get all listings watched by the current user.
 * @returns Promise resolving to an array of ListingSummary objects.
 */
export const getMyWatches = () =>
    api.get<ListingSummary[]>(`/watch`).then(res =>
        res.data.map(listing => ({
            ...listing,
            item: {
                ...listing.item,
                imageIds: resolveImageUrls(listing.item.imageIds)
            },
        })));

/**
 * Toggle the watch status for a listing.
 * @param id - The listing ID.
 * @param isSeller - Whether the current user is the seller (default false).
 * @returns Promise resolving when the toggle is complete.
 */
export const toggleWatch = async (id: string, isSeller: boolean = false) => {
    const watching = await isWatching(id);
    if (watching) {
        if (isSeller) {
            enqueueSnackbar("You cannot unwatch your own listing", {variant: 'warning'});
            return Promise.resolve();
        }
        return removeWatch(id);
    } else {
        return addWatch(id);
    }
};
