/**
 * Hook for creating bids on listings.
 * Provides functionality to place regular bids or buy-now bids with error handling and cache invalidation.
 */
import {useMutation, UseMutationResult, useQueryClient} from '@tanstack/react-query';
import {enqueueSnackbar} from 'notistack';
import {createBid, CreateBidPayload} from '../api/bidApi';
import {AxiosError} from "axios";
import {useCurrentUser} from "./useCurrentUser.ts";
import {useNavigate} from "react-router-dom";

/**
 * Custom hook that provides functionality to create bids on a listing.
 * Handles validation for user address, success/error states, and cache invalidation.
 * @param {string} listingId - The ID of the listing to bid on
 * @returns {Object} A mutation object with functions to create a bid and track mutation state
 */
export const useCreateBid = (listingId: string): UseMutationResult<any, AxiosError<{ cause?: string }>, Omit<CreateBidPayload, 'listingId'>> => {    const queryClient = useQueryClient();
    const {data: user} = useCurrentUser();
    const nav = useNavigate();

    /**
     * Invalidates related queries after a successful bid
     */
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
        onMutate: () => {
            if (!user?.address?.street || !user?.address?.city || !user?.address?.zipCode || !user?.address?.country) {
                enqueueSnackbar('You must have a complete address to place a bid.', {variant: 'error'});
                nav('/dashboard');
                return Promise.reject(new Error('Address is missing'));
            }
        },
        onSuccess: (_data, variables) => {
            if (!(variables as Omit<CreateBidPayload, 'listingId'>).buy_now) {
                enqueueSnackbar('Bid placed!', {variant: 'success'});
            }
            invalidateListingQueries();
        },
        onError: (error: AxiosError<{ cause?: string }>) => {
            if (error.message !== 'Address is missing') {
                const msg =
                    error?.response?.data?.cause ??
                    'Bid failed - please try again';
                enqueueSnackbar(msg, {variant: 'error'});
            }
        },
    });
}