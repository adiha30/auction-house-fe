import {useQuery} from "@tanstack/react-query";
import {User} from "../api/userApi.ts";
import {getUsers, Page, searchUsers} from "../api/adminApi.ts";

interface UseUsersProps {
    page: number;
    size: number;
    query: string;
    isAdmin: boolean;
    showInactive: boolean;
}

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