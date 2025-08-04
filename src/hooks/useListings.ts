/**
 * Hooks for fetching listings data.
 * Provides functionality to get both listings collections and individual listing details.
 */
import {useQuery, UseQueryResult} from '@tanstack/react-query'
import {getAllListings, getListing, ListingDetails, ListingSummary} from '../api/listingApi'

/**
 * Custom hook that provides functionality to fetch multiple listings, optionally filtered by category.
 * Only returns listings with 'OPEN' status.
 * @param {string} [category] - Optional category to filter listings by
 * @returns {Object} Query object with filtered listings data and query state
 */
export const useListings = (category?: string) : UseQueryResult<ListingSummary[], Error> =>
    useQuery<ListingSummary[]>({
        queryKey: ['listings', category ?? 'all'],
        queryFn: async () =>
            (await getAllListings(category)).filter(l => l.status === 'OPEN'),
        staleTime: 30_000,
    });

/**
 * Custom hook that provides functionality to fetch a specific listing by ID.
 * @param {string} [id] - The ID of the listing to fetch
 * @param {boolean} [enabled=true] - Whether the query should be enabled
 * @returns {Object} Query object with listing data and query state
 */
export const useListing = (id?: string, enabled: boolean = true): UseQueryResult<ListingSummary, Error> =>
    useQuery<ListingDetails>({
        queryKey: ['listing', id],
        queryFn: () => getListing(id!),
        enabled: !!id && enabled,
    });