/**
 * Hook for creating offers on listings.
 * Provides functionality to make offers on listings with address validation.
 */
import {useMutation, UseMutationResult, useQueryClient} from "@tanstack/react-query";
import {createOffer, OfferResponse} from "../api/offerApi";
import {enqueueSnackbar} from "notistack";
import {useCurrentUser} from "./useCurrentUser.ts";
import {useNavigate} from "react-router-dom";

/**
 * Custom hook that provides functionality to create an offer on a listing.
 * Validates user address, handles success/error states, and invalidates related queries.
 * @param {string} listingId - The ID of the listing to make an offer on
 * @returns {Object} A mutation object with functions to create an offer and track mutation state
 */
export const useCreateOffer = (listingId: string): UseMutationResult<OfferResponse, Error, number, unknown> => {
    const queryClient = useQueryClient();
    const {data: user} = useCurrentUser();
    const nav = useNavigate();

    return useMutation<OfferResponse, Error, number>({
        mutationFn: (amount: number) => createOffer(listingId, amount),
        onMutate: () => {
            if (!user?.address?.street || !user?.address?.city || !user?.address?.zipCode || !user?.address?.country) {
                enqueueSnackbar('You must have a complete address to make an offer.', {variant: 'error'});
                nav('/dashboard');
                return Promise.reject(new Error('Address is missing'));
            }
        },
        onSuccess: () => {
            enqueueSnackbar("Offer sent!", {variant: "success"});
            queryClient.invalidateQueries({queryKey: ["offers", listingId]});
        },
        onError: (error) => {
            if (error.message !== 'Address is missing') {
                enqueueSnackbar("Could not send offer - you can't offer the same amount twice and must have a valid credit card", {variant: "error"});
            }
        },
    });
};