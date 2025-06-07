import {useMutation, useQueryClient} from '@tanstack/react-query';
import {enqueueSnackbar} from 'notistack';
import {createBid, CreateBidPayload} from '../api/bidApi';
import {AxiosError} from "axios";

export const useCreateBid = (listingId: string) => {
    const queryClient = useQueryClient();

    function invalidateListingQueries() {
        queryClient.invalidateQueries({
            predicate: (query) => {
                const key = query.queryKey;
                return (
                    (Array.isArray(key) && (
                        (key[0] === 'listings') ||
                        (key[0] === 'bids' && key[1] === listingId) ||
                        (key[0] === 'featuredListings') ||
                        (key[0] === 'watch' && key[1] === listingId) ||
                        (key[0] === 'listings' && key[1] === 'category')
                    ))
                );
            }
        });
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