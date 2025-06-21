import {useAuth} from '../context/AuthContext';
import api from '../api/axios';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

export function useWatch(listingId: string) {
    const qc = useQueryClient();
    const {token} = useAuth()!;
    const enabled = !!token;

    const watchingQ = useQuery({
        queryKey: ['watch', listingId],
        queryFn: () => api.get<boolean>(`/watch/${listingId}`).then(r => r.data),
        enabled,
        staleTime: 60_000,
    });

    const toggleMutation = useMutation({
        mutationFn: () => api.post(`/watch/${listingId}`),
        onSuccess: () => qc.invalidateQueries({queryKey: ['watch', listingId]}),
    });

    if (!enabled) {
        return {
            watching: false,
            toggle: {
                mutate: () => {
                }, isPending: false
            } as const,
        };
    }

    return {
        watching: watchingQ.data ?? false,
        toggle: toggleMutation,
    };
}
