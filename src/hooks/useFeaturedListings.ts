/**
 * Hook for fetching featured listings across all categories.
 * Provides access to highlighted or promoted listings across the system.
 */
import {useQuery, UseQueryResult} from "@tanstack/react-query";
import {getFeaturedListings, ListingSummary} from "../api/listingApi.ts";

/**
 * Custom hook that provides functionality to fetch featured listings.
 * @param {number} [limit=5] - The maximum number of featured listings to fetch
 * @returns {Object} Query object with featured listings data and query state
 */
export const useFeaturedListings = (limit: number = 5): UseQueryResult<ListingSummary[], Error> =>
    useQuery<ListingSummary[]>({
        queryKey: ['featuredHero', limit],
        queryFn: () => getFeaturedListings(limit),
        staleTime: 60_000,
    });