import {useQuery} from '@tanstack/react-query';
import {getUser} from '../api/userApi'; // Assuming the API function is named getUser

export function useUser(userId: string | undefined) {
    return useQuery({
        queryKey: ['user', userId],
        queryFn: () => getUser(userId!),
        enabled: !!userId,
    });
}