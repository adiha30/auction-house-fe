import { useQuery } from '@tanstack/react-query';
import { getUser, User } from '../api/userApi';
import { useAuth } from '../context/AuthContext';

export const useCurrentUser = () => {
    const { userId } = useAuth()!;
    return useQuery<User>({
        queryKey: ['currentUser', userId],
        enabled: !!userId,
        queryFn: () => getUser(userId!),
    });
};
