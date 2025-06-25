import {useQuery} from '@tanstack/react-query';
import api from '../api/axios';
import {ListingSummary} from "../api/listingApi.ts";

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

export interface ActiveBid {
    bidId: string;
    amount: number;
    isBuyNow: boolean;
    createdAt: string;
    // listing snapshot -----------------------------
    listingId: string;
    title: string;
    startPrice: number;
    latestBidAmount?: number | null;
    imageIds: string[];
    buyNowPrice?: number | null;
    endTime: string;
    status: 'OPEN' | 'SOLD' | 'CLOSED';
}


export const useBids = (listingId: string, enabled = true) =>
    useQuery<Bid[]>({
        queryKey: ['bids', listingId],
        enabled,
        queryFn: () => api
            .get<Bid[]>(`/bids/${listingId}`)
            .then(r => r.data),
    });