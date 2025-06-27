import {useQuery} from "@tanstack/react-query";
import {User} from "../api/userApi.ts";
import {getUsers, Page, searchUsers} from "../api/adminApi.ts";

interface UseUsersProps {
    page: number;
    size: number;
    query: string;
    isAdmin: boolean;
}

export const useUsers = ({page, size, query, isAdmin}: UseUsersProps) =>
    useQuery<Page<User>>({
        queryKey: ['users', {page, size, query}],
        enabled: isAdmin,
        queryFn: () => query.trim().length > 1
            ? searchUsers(query, page, size)
            : getUsers(page, size),
        placeholderData: (previousData) => previousData,
        staleTime: 5000,
    });