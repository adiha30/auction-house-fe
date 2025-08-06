/**
 * Hook for fetching featured listings for a specific category.
 * Provides access to hot or popular listings within a given category.
 */

import {useQuery, UseQueryResult} from '@tanstack/react-query'
import {getHotListings, ListingSummary} from '../api/listingApi'

const limit = 5;

/**
 * Custom hook that provides functionality to fetch featured listings for a specific category.
 * @param {string} category - The category to fetch featured listings for
 * @returns {Object} Query object with featured listings data and query state
 */
export const useFeaturedCategoryListings = (category: string): UseQueryResult<ListingSummary[], Error> => {
    return useQuery<ListingSummary[]>({
        queryKey: ['featuredListings', category],
        queryFn: () => getHotListings(category, limit),
        staleTime: 30_000,
        enabled: category !== 'All Categories',
    });
}