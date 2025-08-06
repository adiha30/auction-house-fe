/**
 * Hook for fetching a seller's listing history.
 * Provides access to all listings created by a specific seller with pagination.
 */
import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import {getSellerListings, Page} from "../api/adminApi.ts";
import {ListingDetails} from "../api/listingApi.ts";

/**
 * Custom hook that provides functionality to fetch a seller's listing history.
 * @param {string | undefined} userId - The ID of the seller
 * @param {number} page - The page number for pagination
 * @param {number} size - The number of items per page
 * @param {Object} [options] - Additional options to pass to the useQuery hook
 * @returns {Object} Query object with the seller's listings data and query state
 */
export const useSellerHistory = (userId: string | undefined, page: number, size: number, options?: Omit<UseQueryOptions<Page<ListingDetails>>, 'queryKey' | 'queryFn' | 'enabled'>) => {
    return useQuery({
        queryKey: ['sellerListings', userId, page, size],
        queryFn: () => getSellerListings(userId!, page, size),
        enabled: !!userId,
        ...options,
    });
};
