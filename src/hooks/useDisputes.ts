import {useNavigate} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    addDisputeMessage,
    createDispute,
    CreateDisputeRequest,
    Dispute,
    getDispute,
    getMyDisputes
} from "../api/disputeApi.ts";
import {enqueueSnackbar} from "notistack";
import {useCurrentUser} from "./useCurrentUser.ts";

export function useCreateDispute() {
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

export function useDispute(disputeId: string) {
    return useQuery({
        queryKey: ['dispute', disputeId],
        queryFn: () => getDispute(disputeId),
        enabled: !!disputeId,
        refetchOnWindowFocus: true,
    })
}

export const useAddDisputeMessage = (disputeId: string) => {
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

export function useMyDisputes(userId: string, page: number, size: number) {
    return useQuery({
        queryKey: ['disputes', 'my', {userId, page, size}],
        queryFn: () => getMyDisputes(userId!, page, size),
        enabled: !!userId,
    });
}