/**
 * Hook for fetching the current user's open listings.
 * Provides access to the authenticated user's active listings.
 */
import {useQuery} from '@tanstack/react-query'
import {getUserOpenListings, ListingDetails} from '../api/listingApi'
import {useAuth} from "../context/AuthContext.tsx";

/**
 * Custom hook that provides functionality to fetch the current user's open listings.
 * Only enabled when the user is authenticated.
 * @returns {Object} Query object with the user's listings data and query state
 */
export const useUserListings = () => {
    const {token} = useAuth()!;

    return useQuery<ListingDetails[]>({
        queryKey: ['mylistings'],
        queryFn: async () => (await getUserOpenListings()),
        enabled: !!token,
    })
};
