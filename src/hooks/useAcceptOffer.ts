import {useMutation, useQueryClient} from "@tanstack/react-query";
import {acceptOffer} from "../api/offerApi";
import {enqueueSnackbar} from "notistack";

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