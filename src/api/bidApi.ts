/**
 * Bid API module for creating bids and retrieving active bids for the current user.
 * Provides functions to place a bid and to fetch the user's active bids with resolved image URLs.
 *
 * @module bidApi
 */

import api from './axios';
import {ActiveBid} from "../hooks/useBids.ts";
import {resolveImageUrls} from "../utils/imageUrls.ts";

/**
 * Payload for creating a new bid.
 * @property listingId - The ID of the listing to bid on.
 * @property amount - The bid amount.
 * @property buy_now - Whether this is a buy-now action.
 */
export interface CreateBidPayload {
    listingId: string;
    amount: number;
    buy_now: boolean;
}

/**
 * Create a new bid on a listing.
 * @param body - The bid payload containing listingId, amount, and buy_now flag.
 * @returns Promise resolving to void or an object with a cause string if the bid fails.
 */
export const createBid = (body: CreateBidPayload) =>
    api.post<void | { cause: string }>('/bids', body).then(r => r.data);

/**
 * Get the current user's active bids, resolving image URLs for each bid.
 * @returns Promise resolving to an array of ActiveBid objects with resolved image URLs.
 */
export const getMyActiveBids = async (): Promise<ActiveBid[]> => {
    const res = await api.get<ActiveBid[]>('/bids/user/active');
    return res.data.map(activeBid => ({
        ...activeBid,
        imageIds: resolveImageUrls(activeBid.imageIds)
    }));
}
