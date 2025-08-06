/**
 * Hook for searching listings by query.
 * Provides functionality to search for listings with sorting capabilities.
 */
import {useQuery, UseQueryResult} from "@tanstack/react-query";
import {ListingSummary, searchListings} from "../api/listingApi.ts";

/**
 * Custom hook that provides functionality to search for listings based on a query string.
 * Only enabled when the query is at least 2 characters long.
 * @param {string} query - The search query
 * @param {string} sort - The sorting method to apply to results
 * @returns {Object} Query object with search results and query state
 */
export const useSearchListings = (query: string, sort: string): UseQueryResult<ListingSummary[], Error> =>
    useQuery<ListingSummary[]>({
        queryKey: ['search', query, sort],
        enabled: query.length >= 2,
        queryFn: () => searchListings(query, sort),
    });