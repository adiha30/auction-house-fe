import {useNavigate} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createDispute, CreateDisputeRequest, getDispute} from "../api/disputeApi.ts";
import {enqueueSnackbar} from "notistack";

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
    })
}