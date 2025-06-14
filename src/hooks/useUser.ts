import {useQuery} from '@tanstack/react-query';
import {getUser, User} from '../api/userApi';

export const useUser = (userId?: string) => {
    return useQuery<User>({
        queryKey: ['currentUser', userId],
        enabled: !!userId,
        queryFn: () => getUser(userId!),
    });
};
