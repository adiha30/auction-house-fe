/**
 * Hook for rejecting offers on a listing.
 * Provides functionality to reject an offer for a specific listing with success/error handling.
 */
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {rejectOffer} from "../api/offerApi";
import {enqueueSnackbar} from "notistack";

/**
 * Custom hook that provides functionality to reject an offer on a listing.
 * @param {string} listingId - The ID of the listing to reject an offer for
 * @returns {Object} A mutation object with functions to reject an offer and track mutation state
 */
export const useRejectOffer = (listingId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (offerId: string) => rejectOffer(offerId),
        onSuccess: () => {
            enqueueSnackbar("Offer rejected ✘", {variant: "success"});
            queryClient.invalidateQueries({queryKey: ["offers", listingId]});
            queryClient.invalidateQueries({queryKey: ["listings", listingId]});
        },
        onError: () =>
            enqueueSnackbar("Could not reject offer - please try again", {variant: "error"}),
    });
};