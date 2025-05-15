import {useQuery} from '@tanstack/react-query'
import {getListing} from "../api/listingApi.ts";

export interface Listing {
    listingId: string;
    startPrice: number;
    buyNowPrice: number;
    startTime: string | null;
    endTime: string;
    finalPrice: number;
    item: {
        title: string;
        description: string;
        imageIds: string[];
    };
    status: string;
    closingMethod: string | null;
    category: string;
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
        queryKey: ['listings', id],
        queryFn: () => getListing(id),
        retry: 1
    });
}