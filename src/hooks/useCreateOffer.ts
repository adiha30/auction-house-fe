import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createOffer, OfferResponse} from "../api/offerApi";
import {enqueueSnackbar} from "notistack";

export const useCreateOffer = (listingId: string) => {
    const queryClient = useQueryClient();

    return useMutation<OfferResponse, unknown, number>({
        mutationFn: (amount: number) => createOffer(listingId, amount),
        onSuccess: () => {
            enqueueSnackbar("Offer sent!", {variant: "success"});
            queryClient.invalidateQueries({queryKey: ["offers", listingId]});
        },
        onError: () =>
            enqueueSnackbar("Could not send offer - you can't offer the same amount twice and must have a valid credit card", { variant: "error" }),
    });
};