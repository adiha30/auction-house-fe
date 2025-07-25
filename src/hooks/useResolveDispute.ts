import {useMutation, useQueryClient} from '@tanstack/react-query';
import {updateDisputeStatus} from '../api/disputeApi.ts';

export const useResolveDispute = (disputeId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => updateDisputeStatus(disputeId, 'CLOSED'),
        onSuccess: () => {
            // Invalidate and refetch
            return queryClient.invalidateQueries({queryKey: ['dispute', disputeId]});
        },
        onError: (error) => {
            console.error("Error resolving dispute:", error);
            // Here you could show a notification to the user
        },
    });
};

