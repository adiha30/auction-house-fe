import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import {getSellerListings, Page} from "../api/adminApi.ts";
import {ListingDetails} from "../api/listingApi.ts";

export const useSellerHistory = (userId: string | undefined, page: number, size: number, options?: Omit<UseQueryOptions<Page<ListingDetails>>, 'queryKey' | 'queryFn' | 'enabled'>) => {
    return useQuery({
        queryKey: ['sellerListings', userId, page, size],
        queryFn: () => getSellerListings(userId!, page, size),
        enabled: !!userId,
        ...options,
    });
};