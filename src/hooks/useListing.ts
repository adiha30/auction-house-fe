import {useQuery} from '@tanstack/react-query'
import {getListing} from "../api/listingApi.ts";
import {Bid} from "./useBids.ts";

export interface Listing {
    listingId: string;
    startPrice: number;
    buyNowPrice: number;
    startTime: string | null;
    endTime: string;
    finalPrice: number;
    latestBidAmount?: number | null;
    item: {
        title: string;
        description: string;
        imageIds: string[];
    };
    status: string;
    closingMethod: string | null;
    category: string;
    bids: Bid[];
    winner: null | {
        userId: string;
        username: string;
    };
    seller: {
        userId: string;
        username: string;
        email: string;
        password: string;
        role: string;
        ccInfo: null | Record<string, unknown>;
    };
}

export function useListing(id: string) {
    return useQuery({
        queryKey: ['listing', id],
        queryFn: () => getListing(id),
        retry: 1
    });
}