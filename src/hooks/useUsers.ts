/**
 * Hook for fetching and searching users in the system.
 * Provides admin functionality to list and search for users with pagination support.
 */
import {useQuery} from "@tanstack/react-query";
import {User} from "../api/userApi.ts";
import {getUsers, Page, searchUsers} from "../api/adminApi.ts";

/**
 * Interface for the useUsers hook parameters.
 */
interface UseUsersProps {
    page: number;
    size: number;
    query: string;
    isAdmin: boolean;
    showInactive: boolean;
}

/**
 * Custom hook that provides functionality to fetch and search users.
 * Uses search functionality when query length is greater than 1, otherwise returns all users.
 * Only enabled when the current user is an admin.
 * @param {UseUsersProps} params - The parameters for user fetching and searching
 * @returns {Object} Query object with paginated users data and query state
 */
export const useUsers = ({page, size, query, isAdmin, showInactive}: UseUsersProps) =>
    useQuery<Page<User>>({
        queryKey: ['users', {page, size, query, showInactive}],
        enabled: isAdmin,
        queryFn: () => query.trim().length > 1
            ? searchUsers(query, page, size, showInactive)
            : getUsers(page, size, showInactive),
        placeholderData: (previousData) => previousData,
        staleTime: 5000,
    });