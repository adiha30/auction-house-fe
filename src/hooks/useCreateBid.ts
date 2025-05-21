import {useMutation, useQueryClient} from '@tanstack/react-query';
import {enqueueSnackbar} from 'notistack';
import {createBid, CreateBidPayload} from '../api/bidApi';
import {AxiosError} from "axios";

export const useCreateBid = (listingId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Omit<CreateBidPayload, 'listingId'>) =>
            createBid({listingId, ...payload}),
        onSuccess: () => {
            enqueueSnackbar('Bid placed!', {variant: 'success'});
            queryClient.invalidateQueries({queryKey: ['listings']});
            queryClient.invalidateQueries({queryKey: ['listings', listingId]});
            queryClient.invalidateQueries({queryKey: ['bids', listingId]});
        },
        onError: (error: AxiosError<{ cause?: string }>) => {
                const msg =
                    error?.response?.data?.cause ??
                    'Bid failed - please try again';
                enqueueSnackbar(msg, {variant: 'error'});
        },
    });
}