/**
 * Hook for withdrawing offers on a listing.
 * Provides functionality to withdraw an offer with success/error handling.
 */
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {withdrawOffer} from "../api/offerApi.ts";
import {enqueueSnackbar} from "notistack";

 /**
  * Custom hook that provides functionality to withdraw an offer on a listing.
  * @param {string} listingId - The ID of the listing the offer is on
  * @returns {Object} A mutation object with functions to withdraw an offer and track mutation state
  */
export const useWithdrawOffer = (listingId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (offerId: string) => withdrawOffer(offerId),
        onSuccess: () => {
            enqueueSnackbar("Offer withdrawn ✓", {variant: "success"});
            queryClient.invalidateQueries({queryKey: ["offers", listingId]});
        },
        onError: () =>
            enqueueSnackbar("Could not withdraw offer - please try again", {variant: "error"}),
    });
};