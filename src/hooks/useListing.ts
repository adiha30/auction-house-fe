/**
 * Hook for fetching a specific listing by ID.
 * Provides detailed information about a single auction listing.
 */

import {useQuery, UseQueryResult} from '@tanstack/react-query'
import {getListing} from "../api/listingApi.ts";

/**
 * Custom hook that provides functionality to fetch a specific listing by ID.
 * @param {string | undefined} id - The ID of the listing to fetch
 * @returns {Object} Query object with listing data and query state
 */
export function useListing(id: string | undefined) : UseQueryResult<any, Error> {
    return useQuery({
        queryKey: ['listing', id],
        queryFn: () => getListing(id!),
        enabled: !!id,
        retry: 1
    });
}