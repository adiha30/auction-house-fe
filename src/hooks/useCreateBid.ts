import {useMutation, useQueryClient} from '@tanstack/react-query';
import {enqueueSnackbar} from 'notistack';
import {createBid, CreateBidPayload} from '../api/bidApi';
import {AxiosError} from "axios";

export const useCreateBid = (listingId: string) => {
    const queryClient = useQueryClient();

    function invalidateListingQueries() {
        queryClient.invalidateQueries({queryKey: ['listings']});
        queryClient.invalidateQueries({queryKey: ['listings', listingId]});
        queryClient.invalidateQueries({queryKey: ['bids', listingId]});
        queryClient.invalidateQueries({queryKey: ['bids', listingId]});
        queryClient.invalidateQueries({queryKey: ['featuredListings']});
        queryClient.invalidateQueries({queryKey: ['listings', 'category']});
    }

    return useMutation({
        mutationFn: (payload: Omit<CreateBidPayload, 'listingId'>) =>
            createBid({listingId, ...payload}),
        onSuccess: () => {
            enqueueSnackbar('Bid placed!', {variant: 'success'});
            invalidateListingQueries();
        },
        onError: (error: AxiosError<{ cause?: string }>) => {
                const msg =
                    error?.response?.data?.cause ??
                    'Bid failed - please try again';
                enqueueSnackbar(msg, {variant: 'error'});
        },
    });
}