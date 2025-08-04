/**
 * Hook for accessing the current authenticated user's data.
 * Provides access to the currently logged-in user's details from the API.
 */
import {useQuery, UseQueryResult} from '@tanstack/react-query';
import {getUser, User} from '../api/userApi';
import {useAuth} from '../context/AuthContext';

/**
 * Custom hook that fetches and provides access to the current user's data.
 * Only enabled when a valid userId is available from the auth context.
 * @returns {Object} Query object with the current user data and query state
 */
export const useCurrentUser = (): UseQueryResult<User, Error> => {
    const {userId} = useAuth()!;
    return useQuery<User>({
        queryKey: ['currentUser', userId],
        enabled: !!userId,
        queryFn: () => getUser(userId!),
    });
};
