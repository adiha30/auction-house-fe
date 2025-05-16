import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export interface Bid {
    bidId: string;
    amount: number;
    isBuyNow: boolean;
    createdAt: string;
    bidder: {
        userId: string;
        username: string;
    };
}

export const useBids = (listingId: string, enabled = true) =>
    useQuery<Bid[]>({
        queryKey: ['bids', listingId],
        enabled,
        queryFn: () => api
            .get<Bid[]>(`/bids/${listingId}`)
            .then(r => r.data),
    });