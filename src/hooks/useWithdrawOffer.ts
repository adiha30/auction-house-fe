import {useMutation, useQueryClient} from "@tanstack/react-query";
import {withdrawOffer} from "../api/offerApi.ts";
import {enqueueSnackbar} from "notistack";

export const useWithdrawOffer = (listingId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (offerId: string) => withdrawOffer(offerId),
        onSuccess: () => {
            enqueueSnackbar("Offer withdrawn ✓", {variant: "success"});
            queryClient.invalidateQueries({ queryKey: ["offers", listingId]});
        },
        onError: () =>
            enqueueSnackbar("Could not withdraw offer - please try again", { variant: "error" }),
    });
};