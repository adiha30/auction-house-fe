/**
 * Hook for fetching all categories in the auction system.
 * Provides functionality to fetch category data with caching.
 */
import {useQuery, UseQueryResult} from '@tanstack/react-query';
import {Category, getCategories} from '../api/categoryApi';

/**
 * Custom hook that provides functionality to fetch all categories.
 * Uses React Query for data fetching with a 30-second stale time.
 * @returns {Object} Query object with categories data and query state
 */
export const useCategories = (): UseQueryResult<Category[], Error> =>
    useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: getCategories,
        staleTime: 30_000,
    });