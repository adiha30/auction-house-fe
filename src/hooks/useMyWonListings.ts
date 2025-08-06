/**
 * Hook for fetching listings that the current user has won.
 * Provides access to auctions the user has successfully won with pagination and sorting options.
 */
import {useQuery} from "@tanstack/react-query";
import {getUserWonListings, ListingDetails, PaginatedResponse} from "../api/listingApi.ts";

/**
 * Custom hook that provides functionality to fetch listings won by the current user.
 * Includes pagination and sorting capabilities.
 * @param {boolean} isAdmin - Whether the current user is an admin, controls if query is enabled
 * @param {'recent' | 'title'} [sort='recent'] - The field to sort results by
 * @param {number} [page=0] - The page number for pagination (zero-indexed)
 * @param {number} [limit=10] - The number of items per page
 * @param {'asc' | 'desc'} [order='desc'] - The sort direction
 * @returns {Object} Query object with the user's won listings data and query state
 */
export const useMyWonListings = (
    isAdmin: boolean,
    sort: 'recent' | 'title' = 'recent',
    page: number = 0,
    limit: number = 10,
    order: 'asc' | 'desc' = "desc"
): ReturnType<typeof useQuery<PaginatedResponse<ListingDetails>>> => {
    return useQuery<PaginatedResponse<ListingDetails>>({
        queryKey: ["myWonListings", sort, page, limit, order],
        queryFn: () => getUserWonListings(sort, page, limit, order),
        enabled: !isAdmin,
    });
}