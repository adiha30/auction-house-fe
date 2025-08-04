/**
 * Hook for managing watched listings.
 * Provides functionality to check if a listing is being watched and toggle its watch status.
 */
import {useAuth} from '../context/AuthContext';
import api from '../api/axios';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

/**
 * Custom hook that provides functionality to check and toggle the watch status of a listing.
 * Only functional when a user is authenticated, otherwise returns default values.
 * @param {string} listingId - The ID of the listing to check/toggle watch status
 * @returns {Object} Object containing the watch status and toggle mutation
 * @returns {boolean} watching - Whether the current user is watching the listing
 * @returns {Object} toggle - Mutation object to toggle the watch status
 */
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
