/**
 * Collection of hooks for managing dispute functionality.
 * Provides functionality for creating disputes, retrieving dispute details,
 * sending messages in disputes, and listing disputes.
 */
import {useNavigate} from "react-router-dom";
import {useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult} from "@tanstack/react-query";
import {
    addDisputeMessage,
    createDispute,
    CreateDisputeRequest,
    Dispute,
    getAllDisputes,
    getDispute,
    getMyDisputes, PaginatedDisputes
} from "../api/disputeApi.ts";
import {enqueueSnackbar} from "notistack";
import {useCurrentUser} from "./useCurrentUser.ts";

/**
 * Custom hook that provides functionality to create a new dispute.
 * @returns {Object} A mutation object with functions to create a dispute and track mutation state
 */
export function useCreateDispute(): UseMutationResult<string, Error, CreateDisputeRequest> {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: CreateDisputeRequest) => createDispute(request),
        onSuccess: (disputeId) => {
            enqueueSnackbar('Dispute created successfully', {variant: 'success'});
            queryClient.invalidateQueries({queryKey: ['disputes']});
            navigate(`/disputes/${disputeId}`);
        },
        onError: (error) => {
            enqueueSnackbar(`Failed to create dispute: ${error.message}`, {variant: 'error'});
        }
    });
}

/**
 * Custom hook that provides functionality to fetch a specific dispute.
 * @param {string} disputeId - The ID of the dispute to fetch
 * @returns {Object} Query object with dispute data and query state
 */
export function useDispute(disputeId: string): UseQueryResult<Dispute, Error> {
    return useQuery({
        queryKey: ['dispute', disputeId],
        queryFn: () => getDispute(disputeId),
        enabled: !!disputeId,
        refetchOnWindowFocus: true,
    })
}

/**
 * Custom hook that provides functionality to add a message to a dispute.
 * Uses optimistic updates to immediately show the message in the UI.
 * @param {string} disputeId - The ID of the dispute to add a message to
 * @returns {Object} A mutation object with functions to add a message and track mutation state
 */
export const useAddDisputeMessage = (disputeId: string): UseMutationResult<void, Error, { message: string, senderId: string }> => {
    const queryClient = useQueryClient();
    const {data: currentUser} = useCurrentUser();

    return useMutation({
        mutationFn: ({message, senderId}: {
            message: string,
            senderId: string
        }) => addDisputeMessage(disputeId, message, senderId),
        onMutate: async ({message}) => {
            await queryClient.cancelQueries({queryKey: ['dispute', disputeId]});

            const previousDispute = queryClient.getQueryData<Dispute>(['dispute', disputeId]);

            if (previousDispute && currentUser) {
                const newMessage = {
                    messageId: `temp-${Date.now()}`, // Temporary ID
                    disputeId,
                    senderId: currentUser.userId,
                    message,
                    createdAt: new Date().toISOString(),
                };

                const updatedDispute: Dispute = {
                    ...previousDispute,
                    disputeMessages: [...previousDispute.disputeMessages, newMessage],
                };

                queryClient.setQueryData(['dispute', disputeId], updatedDispute);
            }

            return {previousDispute};
        },
        onError: (_err, _vars, context) => {
            if (context?.previousDispute) {
                queryClient.setQueryData(['dispute', disputeId], context.previousDispute);
            }
            enqueueSnackbar('Failed to send message', {variant: 'error'});
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: ['dispute', disputeId]});
        },
    });
};

/**
 * Custom hook that provides functionality to fetch disputes for the current user.
 * @param {string} userId - The ID of the user whose disputes to fetch
 * @param {number} page - The page number for pagination
 * @param {number} size - The number of items per page
 * @returns {Object} Query object with user's disputes data and query state
 */
export function useMyDisputes(userId: string, page: number, size: number): UseQueryResult<PaginatedDisputes, Error> {
    return useQuery({
        queryKey: ['disputes', 'my', {userId, page, size}],
        queryFn: () => getMyDisputes(userId!, page, size),
        enabled: !!userId,
    });
}

/**
 * Custom hook that provides functionality to fetch all disputes in the system.
 * @param {number} page - The page number for pagination
 * @param {number} size - The number of items per page
 * @param {Object} [options] - Additional options for the query
 * @param {boolean} [options.enabled] - Whether the query should be enabled
 * @returns {Object} Query object with all disputes data and query state
 */
export function useAllDisputes(page: number, size: number, options?: { enabled?: boolean }): UseQueryResult<PaginatedDisputes, Error> {
    return useQuery({
        queryKey: ['disputes', 'all', {page, size}],
        queryFn: () => getAllDisputes(page, size),
        enabled: options?.enabled,
    });
}