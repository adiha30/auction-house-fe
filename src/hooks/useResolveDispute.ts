/**
 * Hook for resolving (closing) disputes.
 * Provides functionality to mark a dispute as resolved with error handling.
 */
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {updateDisputeStatus} from '../api/disputeApi.ts';

/**
 * Custom hook that provides functionality to resolve (close) a dispute.
 * @param {string} disputeId - The ID of the dispute to resolve
 * @returns {Object} A mutation object with functions to resolve a dispute and track mutation state
 */
export const useResolveDispute = (disputeId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => updateDisputeStatus(disputeId, 'CLOSED'),
        onSuccess: () =>
            queryClient.invalidateQueries({queryKey: ['dispute', disputeId]}),
        onError: (error) =>
            console.error("Error resolving dispute:", error),
    });
};
