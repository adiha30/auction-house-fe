import {useMutation, useQueryClient} from "@tanstack/react-query";
import {rejectOffer} from "../api/offerApi";
import {enqueueSnackbar} from "notistack";

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