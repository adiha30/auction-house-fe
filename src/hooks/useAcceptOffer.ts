/**
 * Hook for accepting offers on a listing.
 * Provides functionality to accept an offer for a specific listing and handle success/error states.
 */
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {acceptOffer} from "../api/offerApi";
import {enqueueSnackbar} from "notistack";

 /**
  * Custom hook that provides functionality to accept an offer on a listing.
  * @param {string} listingId - The ID of the listing to accept an offer for
  * @returns {Object} A mutation object with functions to accept an offer and track mutation state
  */
export const useAcceptOffer = (listingId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (offerId: string) => acceptOffer(offerId),
        onSuccess: () => {
            enqueueSnackbar("Offer accepted ✔", {variant: "success"});
            queryClient.invalidateQueries({queryKey: ["offers", listingId]});
            queryClient.invalidateQueries({queryKey: ["listings", listingId]});
        },
        onError: () =>
            enqueueSnackbar("Could not accept offer - please try again", {variant: "error"}),
    });
};