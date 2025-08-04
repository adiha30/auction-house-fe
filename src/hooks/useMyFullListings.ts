/**
 * Hooks for fetching the current user's listings with complete details.
 * Provides separate hooks for active and inactive listings.
 */
import {useQuery, UseQueryResult} from '@tanstack/react-query'
import {getUserListings, getUserOpenListings, ListingDetails} from '../api/listingApi'

/**
 * Custom hook that provides functionality to fetch the current user's active listings with full details.
 * @param {boolean} isAdmin - Whether the current user is an admin, controls if query is enabled
 * @returns {Object} Query object with the user's active listings data and query state
 */
export const useMyFullActiveListings = (isAdmin: boolean) : UseQueryResult<ListingDetails[], Error> =>
    useQuery<ListingDetails[]>({
        queryKey: ["myFullListings", "active"],
        queryFn: getUserOpenListings,
        enabled: !isAdmin,
    });

/**
 * Custom hook that provides functionality to fetch the current user's inactive listings with full details.
 * @param {boolean} isAdmin - Whether the current user is an admin, controls if query is enabled
 * @returns {Object} Query object with the user's inactive listings data and query state
 */
export const useMyFullInactiveListings = (isAdmin: boolean): UseQueryResult<ListingDetails[], Error> =>
    useQuery<ListingDetails[]>({
        queryKey: ["myFullListings", "inactive"],
        queryFn: getUserListings,
        enabled: !isAdmin,
    });