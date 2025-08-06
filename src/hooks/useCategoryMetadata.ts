/**
 * Hook for fetching metadata for a specific category.
 * Provides functionality to fetch category metadata when a category name is provided.
 */
import {useQuery, UseQueryResult} from '@tanstack/react-query';
import {CategoryMetadata, getCategoryMetadata} from '../api/categoryApi';

/**
 * Custom hook that provides functionality to fetch metadata for a specific category.
 * @param {string} name - The name of the category to fetch metadata for
 * @returns {Object} Query object with category metadata and query state
 */
export const useCategoryMetadata = (name?: string): UseQueryResult<CategoryMetadata, Error> =>
    useQuery<CategoryMetadata>({
        queryKey: ['categoryMeta', name],
        queryFn: () => getCategoryMetadata(name!),
        enabled: !!name,
    });