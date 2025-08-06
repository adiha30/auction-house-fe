/**
 * Hook and interfaces for working with auction bids.
 * Provides functionality to fetch bids for a specific listing.
 */
import {useQuery, UseQueryResult} from '@tanstack/react-query';
import api from '../api/axios';
import {ListingSummary} from "../api/listingApi.ts";

/**
 * Interface representing a bid in the system.
 */
export interface Bid {
    bidId: string;
    amount: number;
    isBuyNow: boolean;
    createdAt: string;
    bidder: {
        userId: string;
        username: string;
    };
    listing: ListingSummary;
}

/**
 * Interface representing an active bid with listing details.
 */
export interface ActiveBid {
    bidId: string;
    amount: number;
    isBuyNow: boolean;
    createdAt: string;
    listingId: string;
    title: string;
    startPrice: number;
    latestBidAmount?: number | null;
    imageIds: string[];
    buyNowPrice?: number | null;
    endTime: string;
    status: 'OPEN' | 'SOLD' | 'CLOSED' | 'REMOVED';
}

/**
 * Custom hook that provides functionality to fetch bids for a specific listing.
 * @param {string} listingId - The ID of the listing to fetch bids for
 * @param {boolean} enabled - Whether the query is enabled, defaults to true
 * @returns {Object} Query object with bids data and query state
 */
export const useBids = (listingId: string, enabled: boolean = true): UseQueryResult<Bid[]> =>
    useQuery<Bid[]>({
        queryKey: ['bids', listingId],
        enabled,
        queryFn: () => api
            .get<Bid[]>(`/bids/${listingId}`)
            .then(r => r.data),
    });