/**
 * Hook for fetching a specific user's data by ID.
 * Provides access to user details when given a valid user ID.
 */
import {useQuery} from '@tanstack/react-query';
import {getUser} from '../api/userApi'; // Assuming the API function is named getUser

/**
 * Custom hook that provides functionality to fetch a specific user's data.
 * @param {string | undefined} userId - The ID of the user to fetch
 * @returns {Object} Query object with user data and query state
 */
export function useUser(userId: string | undefined) {
    return useQuery({
        queryKey: ['user', userId],
        queryFn: () => getUser(userId!),
        enabled: !!userId,
    });
}
